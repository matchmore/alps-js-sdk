var assert = require('assert');
var chai = require('chai');
var manager = require('../lib/manager');
var apiKey = "ea0df90a-db0a-11e5-bd35-3bd106df139b";

describe('Manager', function () {
    describe('#instanciation', function () {
        it('should allow being instanciated with an apiKey', function () {
            var mgr = new manager.Manager(apiKey);
            chai.expect(mgr).to.have.property('apiKey');
        });
    });

    describe('createUser()', function () {
        it('should create and send an user back', function (done) {
			var testName = "test";
			var completion =  function(user) {
				chai.expect(user).to.have.property('name');
				chai.expect(user).to.have.property('userId');
				done();
			}
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(testName, completion);
        });
        it('should define the "defaultUser"', function (done) {
			var testName = "test";
			var completion =  function(user) {
				chai.expect(mgr).to.have.property('defaultUser');
				chai.expect(mgr.defaultUser).to.equal(user);
				done();
			}
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(testName, completion);
        });
        it('should allow to be used as a promise', function () {
			var testName = "test";
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(testName).then(function(user){
				chai.expect(user).to.have.property('name');
				chai.expect(user).to.have.property('userId');
			});
        });
        it('should add the newly created user to users', function () {
			var testName = "test";
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(testName).then(function(user){
				chai.expect(mgr).to.have.property('users');
				chai.expect(mgr.users).to.include(user);
			});
        });
    });
    describe('createDevice()', function () {
        it('should not allow to be called before createUser', function () {
			var deviceName = "test";
			var platform = "iOS";
			var deviceToken = "f4eea68c-a349-4dbe-a395-c935abc7f6f2";
			var latitude = 0;
			var longitude = 0;
			var altitude = 0;
			var horizontalAccuracy = 1.0;
			var verticalAccuracy = 1.0;

			var completionDevice =  function(device) {
			}
            var mgr = new manager.Manager(apiKey);
			chai.expect(() => {mgr.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completionDevice)}).to.throw(Error);
        });
        it('should create and send a device back', function (done) {
			var userName = "testUser";
			var deviceName = "test";
			var platform = "iOS";
			var deviceToken = "f4eea68c-a349-4dbe-a395-c935abc7f6f2";
			var latitude = 0;
			var longitude = 0;
			var altitude = 0;
			var horizontalAccuracy = 1.0;
			var verticalAccuracy = 1.0;

			var completionUser = function(user){
				mgr.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completionDevice);
			}

			var completionDevice =  function(device) {
				chai.expect(device).to.have.property('name');
				chai.expect(device).to.have.property('deviceId');
				chai.expect(device).to.have.property('location');
				done();
			}
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(userName, completionUser);
        });
        it('should define the "defaultDevice"', function (done) {
			var userName = "testUser";
			var deviceName = "test";
			var platform = "iOS";
			var deviceToken = "f4eea68c-a349-4dbe-a395-c935abc7f6f2";
			var latitude = 0;
			var longitude = 0;
			var altitude = 0;
			var horizontalAccuracy = 1.0;
			var verticalAccuracy = 1.0;

			var completionUser = function(user){
				mgr.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completionDevice);
			}

			var completionDevice =  function(device) {
				chai.expect(mgr).to.have.property('defaultDevice');
				chai.expect(mgr.defaultDevice).to.equal(device);
				done();
			}
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(userName, completionUser);
        });
        it('should allow to be used as a promise', function () {
			var userName = "testUser";
			var deviceName = "test";
			var platform = "iOS";
			var deviceToken = "f4eea68c-a349-4dbe-a395-c935abc7f6f2";
			var latitude = 0;
			var longitude = 0;
			var altitude = 0;
			var horizontalAccuracy = 1.0;
			var verticalAccuracy = 1.0;
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(userName).then((user)=>{
				mgr.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy).then((device) => {
					chai.expect(device).to.have.property('name');
					chai.expect(device).to.have.property('deviceId');
					chai.expect(device).to.have.property('location');
			  });
			});
        });
        it('should add the newly created device to devices', function () {
			var userName = "testUser";
			var deviceName = "test";
			var platform = "iOS";
			var deviceToken = "f4eea68c-a349-4dbe-a395-c935abc7f6f2";
			var latitude = 0;
			var longitude = 0;
			var altitude = 0;
			var horizontalAccuracy = 1.0;
			var verticalAccuracy = 1.0;
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(userName).then((user)=>{
				mgr.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy).then((device) => {
				chai.expect(mgr).to.have.property('devices');
				chai.expect(mgr.devices).to.include(device);
				});
			});
        });
        it('should belong to the first user', function () {
			var userName = "testUser";
			var deviceName = "test";
			var platform = "iOS";
			var deviceToken = "f4eea68c-a349-4dbe-a395-c935abc7f6f2";
			var latitude = 0;
			var longitude = 0;
			var altitude = 0;
			var horizontalAccuracy = 1.0;
			var verticalAccuracy = 1.0;
			var createdUser = {};
            var mgr = new manager.Manager(apiKey);
			return mgr.createUser(userName).then((user)=>{
				createdUser = user;
				mgr.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy).then((device) => {
					chai.expect(mgr.devices.userId).to.equal(createdUser.userId);
				});
			});
        });
    });
});
