var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var manager = require('../lib/manager');
var apiKey = "ea0df90a-db0a-11e5-bd35-3bd106df139b";
chai.should();
chai.use(chaiAsPromised);

var sampleUser = {"name": "test"};
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
	"properties": {"data1": "'value1'", "data2" : "'value2'"}
};
var sampleSubscription = {
	"topic": "sampletopic",
	"selector": "data1='value1'",
	"range": 300,
	"duration": 60
};

describe('Manager', function () {
    describe('#instanciation', function () {
        it('should allow being instanciated with an apiKey', function () {
            var mgr = new manager.Manager(apiKey);
            mgr.should.have.property('apiKey');
        });
    });

    describe('createUser()', function () {
        it('should create and send an user back', function (done) {
			var completion =  function(user) {
				user.should.have.property('name');
				user.should.have.property('userId');
				done();
			};
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(sampleUser.name, completion);
        });
        it('should define the "defaultUser"', function (done) {
			var completion =  function(user) {
				mgr.should.have.property('defaultUser');
				mgr.defaultUser.should.equal(user);
				done();
			};
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(sampleUser.name, completion);
        });
        it('should allow to be used as a promise', function () {
            var mgr = new manager.Manager(apiKey);
			const promise = mgr.createUser(sampleUser.name);
			return Promise.all([
				promise.should.eventually.have.property("name").and.should.eventually.equal(sampleUser.name),
				promise.should.eventually.have.property("userId")
			]);
        });
        it('should add the newly created user to users', function () {
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(sampleUser.name).then(function(user){
				chai.expect(mgr).to.have.property('users');
				chai.expect(mgr.users).to.include(user);
			});
        });
    });
    describe('createDevice()', function () {
        it('should not allow to be called before createUser', function () {
			var completionDevice =  function(device) {
			  var mgr = new manager.Manager(apiKey);
			  chai.expect(() => {mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy, completionDevice);}).to.throw(Error);
			};
        });
        it('should create and send a device back', function (done) {
			var completionUser = function(user){
			mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy, completionDevice);
			};

			var completionDevice =  function(device) {
				chai.expect(device).to.have.property('name');
				chai.expect(device).to.have.property('deviceId');
				chai.expect(device).to.have.property('location');
				done();
			};
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(sampleUser.name, completionUser);
        });
        it('should define the "defaultDevice"', function (done) {
			var completionUser = function(user){
				mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy, completionDevice);
			};

			var completionDevice =  function(device) {
				mgr.should.have.property('defaultDevice');
				mgr.defaultDevice.should.equal(device);
				done();
			};
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(sampleUser.name, completionUser);
        });
        it('should allow to be used as a promise', function () {
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(sampleUser.name).then((user)=>{
				mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					device.should.have.property('name');
					device.should.have.property('deviceId');
					device.should.have.property('location');
				});
			});
        });
        it('should add the newly created device to devices', function () {
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(sampleUser.name).then((user)=>{
				mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
				mgr.should.have.property('devices');
				mgr.devices.should.include(device);
				});
			});
        });
    });
    describe('createPublication()', function () {
        it('should create and send a publication back', function () {
            var mgr = new manager.Manager(apiKey);
			let publication =  mgr.createUser(sampleUser.name).then((user) => {
				return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					
					return mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties).then((publication)=>{
						return publication;
					});
				});
			});
			return Promise.all([
				publication.should.eventually.have.property("topic").and.should.eventually.equal(samplePublication.topic),
				]
			)
        });
        it('should add the newly created publication to publications', function () {
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(sampleUser.name).then((user) => {
				return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties).then((publication)=>{
						mgr.should.have.property('publications');
						mgr.publications.should.include(publication);
					});
				});
			});
        });
        it('should not allow to be called before createUser and createDevice', function () {
			var completionDevice =  function(device) {
				var mgr = new manager.Manager(apiKey);
				chai.expect(() => {mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties);}).to.throw(Error);
			};
        });
    });
    describe('createSubscription()', function () {
        it('should create and send a subscription back', function () {
            var mgr = new manager.Manager(apiKey);
			let subscription =  mgr.createUser(sampleUser.name).then((user) => {
				return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration).then((subscription)=>{
						return subscription;
					});
				});
			});
			return Promise.all([
				subscription.should.eventually.have.property("topic").and.should.eventually.equal(sampleSubscription.topic),
				]
			)
        });
        it('should add the newly created subscription to subscriptions', function () {
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(sampleUser.name).then((user) => {
				return mgr.createDevice(sampleDevice.deviceName, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.latitude, sampleDevice.longitude, sampleDevice.altitude, sampleDevice.horizontalAccuracy, sampleDevice.verticalAccuracy).then((device) => {
					return mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration).then((subscription)=>{
						mgr.should.have.property('subscriptions');
						mgr.subscriptions.should.include(subscription);
					});
				});
			});
        });
        it('should not allow to be called before createUser and createDevice', function () {
			var completionDevice =  function(device) {
				var mgr = new manager.Manager(apiKey);
				chai.expect(() => {mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration);}).to.throw(Error);
			};
        });
    });
});
