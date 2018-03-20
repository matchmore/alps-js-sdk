// API key and apiEndpoint are stored in test/config.js
require('./config');

var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var manager = require('../lib/manager');
chai.should();
chai.use(chaiAsPromised);

// STUB OBJECTS

var sampleDevice = {
	"deviceName" : "test",
	"platform" : "iOS",
	"deviceToken" : "f4eea68c-a349-4dbe-a395-c935abc7f6f2",
	"latitude" : 0,
	"longitude" : 0,
	"altitude" : 0,
	"horizontalAccuracy" : 1.0,
	"verticalAccuracy" : 1.0
};
var samplePublication = {
	"topic": "sampletopic",
	"range": 300,
	"duration": 60,
	"properties": {"data1": "value1", "data2" : 1, "data3": false}
};
var sampleSubscription = {
	"topic": "sampletopic",
	"selector": "data1='value1'",
	"range": 300,
	"duration": 60
};
var sampleLocation = {
	"latitude": 0,
	"longitude": 0,
	"altitude": 0,
	"horizontalAccuracy" : 1.0,
	"verticalAccuracy" : 1.0
};

describe('Manager', function () {
    describe('#instanciation', function () {
        it('should allow being instanciated with an apiKey', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
            mgr.should.have.property('apiKey');
        });
    });

    describe('createDevice()', function () {
        it('should create and send a device back', function (done) {
			var completionDevice =  function(device) {
				chai.expect(device).to.have.property('name');
				chai.expect(device).to.have.property('deviceId');
				chai.expect(device).to.have.property('location');
				done();
			};
            var mgr = new manager.Manager(apiKey, apiLocation);
			mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy, completionDevice);
        });
        it('should define the "defaultDevice"', function (done) {
			var completionDevice =  function(device) {
				mgr.should.have.property('defaultDevice');
				mgr.defaultDevice.should.equal(device);
				done();
			};
            var mgr = new manager.Manager(apiKey, apiLocation);
			mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy, completionDevice);
        });
        it('should allow to be used as a promise', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					device.should.have.property('name');
					device.should.have.property('deviceId');
					device.should.have.property('location');
				});
        });
        it('should add the newly created device to devices', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
				mgr.should.have.property('devices');
				mgr.devices.should.include(device);
				});
        });
    });
    describe('createPublication()', function () {
        it('should create and send a publication back', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			let publication = mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties).then((publication)=>{
						return publication;
					});
				});
			return Promise.all([
				publication.should.eventually.have.property("topic").and.should.eventually.equal(samplePublication.topic),
				]);
        });
        it('should add the newly created publication to publications', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties).then((publication)=>{
						mgr.should.have.property('publications');
						mgr.publications.should.include(publication);
					});
				});
        });
        it('should not allow to be called before createUser and createDevice', function () {
			var completionDevice =  function(device) {
				var mgr = new manager.Manager(apiKey, apiLocation);
				chai.expect(() => {mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties);}).to.throw(Error);
			};
        });
    });
    describe('createSubscription()', function () {
        it('should create and send a subscription back', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			let subscription =  mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration).then((subscription)=>{
						return subscription;
					});
				});
			return Promise.all([
				subscription.should.eventually.have.property("topic").and.should.eventually.equal(sampleSubscription.topic),
				]);
        });
        it('should add the newly created subscription to subscriptions', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration).then((subscription)=>{
						mgr.should.have.property('subscriptions');
						mgr.subscriptions.should.include(subscription);
					});
				});
        });
        it('should not allow to be called before createDevice', function () {
			var completionDevice =  function(device) {
				var mgr = new manager.Manager(apiKey, apiLocation);
				chai.expect(() => {mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration);}).to.throw(Error);
			};
        });
    });
    describe('updateLocation()', function () {
        it('should create and send a location back', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			let location = mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.updateLocation(sampleLocation.latitude, sampleLocation.longitude, sampleLocation.altitude, sampleLocation.horizontalAccuracy, sampleLocation.verticalAccuracy).then((location)=>{
						return location;
					});
				});
			return Promise.all([
				location.should.eventually.have.property("latitude"),
				location.should.eventually.have.property("longitude"),
				location.should.eventually.have.property("altitude"),
			]);
        });
        it('should add the newly created location to locations', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.updateLocation(sampleLocation.latitude, sampleLocation.longitude, sampleLocation.altitude, sampleLocation.horizontalAccuracy, sampleLocation.verticalAccuracy).then((location)=>{
						mgr.should.have.property('locations');
						mgr.locations.should.include(location);
					});
				});
        });
        it('should not allow to be called before  createDevice', function () {
			var completionDevice =  function(device) {
				var mgr = new manager.Manager(apiKey, apiLocation);
				chai.expect(() => {mgr.updateLocation(sampleLocation.latitude, sampleLocation.longitude, sampleLocation.altitude, sampleLocation.horizontalAccuracy, sampleLocation.verticalAccuracy);}).to.throw(Error);
			};
        });
	});
    describe('getAllMatches()', function () {
        it('should not allow to be called before createDevice', function () {
			var mgr = new manager.Manager(apiKey, apiLocation);
			chai.expect(() => {mgr.getAllMatches();}).to.throw(Error);
        });
        it('should get an empty array when no matches are available', function () {
            var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.getAllMatches().then((matches)=>{
						matches.should.be.instanceof(Array);
						matches.should.eql([]);
					});
				});
        });
	});
    describe('getAllPublicationsForDevice()', function () {
        it('should return an empty [] when no publication exist for a given device', function () {
			var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.getAllPublicationsForDevice(user.userId, device.deviceId).then((publications)=>{
						publications.should.be.instanceof(Array);
						publications.should.eql([]);
					});
				});
        });
        it('should return a publication when it has been created for a given device', function () {
			var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties).then((publication)=>{
						return mgr.getAllPublicationsForDevice(user.userId, device.deviceId).then((publications)=>{
							publications.should.be.instanceof(Array);
							publications.should.contain(publication);
						});
					});
				});
        });
	});
    describe('getAllSubscriptionsForDevice()', function () {
        it('should return an empty [] when no publication exist for a given device', function () {
			var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.getAllSubscriptionsForDevice(user.userId, device.deviceId).then((subscriptions)=>{
						subscriptions.should.be.instanceof(Array);
						subscriptions.should.eql([]);
					});
				});
        });
        it('should return a subscription when it has been created for a given device', function () {
			var mgr = new manager.Manager(apiKey, apiLocation);
			return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration).then((subscription)=>{
						return mgr.getAllSubscriptionsForDevice(user.userId, device.deviceId).then((subscriptions)=>{
							subscriptions.should.be.instanceof(Array);
							subscriptions.should.contain(subscription);
						});
					});
				});
        });
	});
});
