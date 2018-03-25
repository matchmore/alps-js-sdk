"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
require("mocha");
var manager_1 = require("../src/manager");
var common_1 = require("./common");
chai.should();
chai.use(chaiAsPromised);
var apiKey = config_1.environment.apiKey;
var apiLocation = config_1.environment.apiLocation;
describe("Manager", function () {
    describe("#instantiation", function () {
        it("should allow being instantiated with an apiKey", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            mgr.should.have.property("apiKey");
        });
    });
    describe("createMobileDevice()", function () {
        it("should create and send a device back", function (done) {
            var completionDevice = function (device) {
                chai.expect(device).to.have.property("name");
                chai.expect(device).to.have.property("id");
                chai.expect(device).to.have.property("location");
                done();
            };
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            mgr.createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken, completionDevice);
        });
        it('should define the "defaultDevice"', function (done) {
            var completionDevice = function (device) {
                mgr.should.have.property("defaultDevice");
                chai.assert.equal(mgr.defaultDevice, device);
                done();
            };
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            mgr.createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken, completionDevice);
        });
        it("should allow to be used as a promise", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                device.should.have.property("name");
                device.should.have.property("id");
                device.should.have.property("location");
            });
        });
        it("should add the newly created device to devices", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                mgr.should.have.property("devices");
                mgr.devices.should.include(device);
            });
        });
    });
    describe("createPublication()", function () {
        it("should create and send a publication back", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            var publication = mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr
                    .createPublication(common_1.samplePublication.topic, common_1.samplePublication.range, common_1.samplePublication.duration, common_1.samplePublication.properties)
                    .then(function (publication) {
                    return publication;
                });
            });
            return Promise.all([
                publication.should.eventually.have
                    .property("topic")
                    .and.should.eventually.equal(common_1.samplePublication.topic)
            ]);
        });
        it("should add the newly created publication to publications", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr
                    .createPublication(common_1.samplePublication.topic, common_1.samplePublication.range, common_1.samplePublication.duration, common_1.samplePublication.properties)
                    .then(function (publication) {
                    mgr.should.have.property("publications");
                    mgr.publications.should.include(publication);
                });
            });
        });
        it("should not allow to be called before createUser and createMobileDevice", function () {
            var completionDevice = function (device) {
                var mgr = new manager_1.Manager(apiKey, apiLocation);
                chai
                    .expect(function () {
                    mgr.createPublication(common_1.samplePublication.topic, common_1.samplePublication.range, common_1.samplePublication.duration, common_1.samplePublication.properties);
                })
                    .to.throw(Error);
            };
        });
    });
    describe("createSubscription()", function () {
        it("should create and send a subscription back", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            var subscription = mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr
                    .createSubscription(common_1.sampleSubscription.topic, common_1.sampleSubscription.range, common_1.sampleSubscription.duration, common_1.sampleSubscription.selector)
                    .then(function (subscription) {
                    return subscription;
                });
            });
            return Promise.all([
                subscription.should.eventually.have
                    .property("topic")
                    .and.should.eventually.equal(common_1.sampleSubscription.topic)
            ]);
        });
        it("should add the newly created subscription to subscriptions", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr
                    .createSubscription(common_1.sampleSubscription.topic, common_1.sampleSubscription.range, common_1.sampleSubscription.duration, common_1.sampleSubscription.selector)
                    .then(function (subscription) {
                    mgr.should.have.property("subscriptions");
                    mgr.subscriptions.should.include(subscription);
                });
            });
        });
        it("should not allow to be called before createMobileDevice", function () {
            var completionDevice = function (device) {
                var mgr = new manager_1.Manager(apiKey, apiLocation);
                chai
                    .expect(function () {
                    mgr.createSubscription(common_1.sampleSubscription.topic, common_1.sampleSubscription.range, common_1.sampleSubscription.duration, common_1.sampleSubscription.selector);
                })
                    .to.throw(Error);
            };
        });
    });
    describe("updateLocation()", function () {
        it("should create location", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr.updateLocation(common_1.sampleLocation);
            });
        });
        it("should not allow to be called before  createMobileDevice", function () {
            var completionDevice = function (device) {
                var mgr = new manager_1.Manager(apiKey, apiLocation);
                chai
                    .expect(function () {
                    mgr.updateLocation(common_1.sampleLocation);
                })
                    .to.throw(Error);
            };
        });
    });
    describe("getAllMatches()", function () {
        it("should not allow to be called before createMobileDevice", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            chai
                .expect(function () {
                mgr.getAllMatches();
            })
                .to.throw(Error);
        });
        it("should get an empty array when no matches are available", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr.getAllMatches().then(function (matches) {
                    matches.should.be.instanceof(Array);
                    matches.should.eql([]);
                });
            });
        });
    });
    describe("getAllPublications()", function () {
        it("should return an empty [] when no publication exist for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr.getAllPublications(device.id).then(function (publications) {
                    publications.should.be.instanceof(Array);
                    publications.should.eql([]);
                });
            });
        });
        it("should return a publication when it has been created for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr
                    .createPublication(common_1.samplePublication.topic, common_1.samplePublication.range, common_1.samplePublication.duration, common_1.samplePublication.properties)
                    .then(function (publication) {
                    return mgr.getAllPublications(device.id).then(function (publications) {
                        publications.should.be.instanceof(Array);
                        publications.should.contain(publication);
                    });
                });
            });
        });
    });
    describe("getAllSubscriptions()", function () {
        it("should return an empty [] when no publication exist for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr.getAllSubscriptions(device.id).then(function (subscriptions) {
                    subscriptions.should.be.instanceof(Array);
                    subscriptions.should.eql([]);
                });
            });
        });
        it("should return a subscription when it has been created for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
                .then(function (device) {
                return mgr
                    .createSubscription(common_1.sampleSubscription.topic, common_1.sampleSubscription.range, common_1.sampleSubscription.duration, common_1.sampleSubscription.selector)
                    .then(function (subscription) {
                    return mgr.getAllSubscriptions(device.id).then(function (subscriptions) {
                        subscriptions.should.be.instanceof(Array);
                        subscriptions.should.contain(subscription);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=manager.test.js.map