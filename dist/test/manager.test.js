"use strict";
// API key and apiEndpoint are stored in test/config.js
var config_1 = require("./config");
// let assert = require('assert');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
require("mocha");
var manager_1 = require("../src/manager");
chai.should();
chai.use(chaiAsPromised);
var apiKey = config_1.environment.apiKey;
var apiLocation = config_1.environment.apiLocation;
// STUB OBJECTS
var samplePublication = {
    topic: "sampletopic",
    range: 300,
    duration: 60,
    properties: { data1: "value1", data2: 1, data3: false }
};
var sampleSubscription = {
    topic: "sampletopic",
    selector: "data1='value1'",
    range: 300,
    duration: 60
};
var sampleLocation = {
    latitude: 0,
    longitude: 0,
    altitude: 0,
    horizontalAccuracy: 1.0,
    verticalAccuracy: 1.0
};
var sampleDevice = {
    name: "test",
    platform: "iOS",
    deviceToken: "f4eea68c-a349-4dbe-a395-c935abc7f6f2",
    location: sampleLocation
};
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
            mgr.createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location, completionDevice);
        });
        it('should define the "defaultDevice"', function (done) {
            var completionDevice = function (device) {
                mgr.should.have.property("defaultDevice");
                mgr.defaultDevice.should.equal(device);
                done();
            };
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            mgr.createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location, completionDevice);
        });
        it("should allow to be used as a promise", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                device.should.have.property("name");
                device.should.have.property("id");
                device.should.have.property("location");
            });
        });
        it("should add the newly created device to devices", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
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
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties)
                    .then(function (publication) {
                    return publication;
                });
            });
            return Promise.all([
                publication.should.eventually.have
                    .property("topic")
                    .and.should.eventually.equal(samplePublication.topic)
            ]);
        });
        it("should add the newly created publication to publications", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties)
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
                    mgr.createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties);
                })
                    .to.throw(Error);
            };
        });
    });
    describe("createSubscription()", function () {
        it("should create and send a subscription back", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            var subscription = mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration)
                    .then(function (subscription) {
                    return subscription;
                });
            });
            return Promise.all([
                subscription.should.eventually.have
                    .property("topic")
                    .and.should.eventually.equal(sampleSubscription.topic)
            ]);
        });
        it("should add the newly created subscription to subscriptions", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration)
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
                    mgr.createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration);
                })
                    .to.throw(Error);
            };
        });
    });
    describe("updateLocation()", function () {
        it("should create and send a location back", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            var location = mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .updateLocation(sampleLocation.latitude, sampleLocation.longitude, sampleLocation.altitude, sampleLocation.horizontalAccuracy, sampleLocation.verticalAccuracy)
                    .then(function (location) {
                    return location;
                });
            });
            return Promise.all([
                location.should.eventually.have.property("latitude"),
                location.should.eventually.have.property("longitude"),
                location.should.eventually.have.property("altitude")
            ]);
        });
        it("should add the newly created location to locations", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .updateLocation(sampleLocation.latitude, sampleLocation.longitude, sampleLocation.altitude, sampleLocation.horizontalAccuracy, sampleLocation.verticalAccuracy)
                    .then(function (location) {
                    mgr.should.have.property("locations");
                    mgr.locations.should.include(location);
                });
            });
        });
        it("should not allow to be called before  createMobileDevice", function () {
            var completionDevice = function (device) {
                var mgr = new manager_1.Manager(apiKey, apiLocation);
                chai
                    .expect(function () {
                    mgr.updateLocation(sampleLocation.latitude, sampleLocation.longitude, sampleLocation.altitude, sampleLocation.horizontalAccuracy, sampleLocation.verticalAccuracy);
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
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr.getAllMatches().then(function (matches) {
                    matches.should.be.instanceof(Array);
                    matches.should.eql([]);
                });
            });
        });
    });
    describe("getAllPublicationsForDevice()", function () {
        it("should return an empty [] when no publication exist for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .getAllPublicationsForDevice(device.id)
                    .then(function (publications) {
                    publications.should.be.instanceof(Array);
                    publications.should.eql([]);
                });
            });
        });
        it("should return a publication when it has been created for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .createPublication(samplePublication.topic, samplePublication.range, samplePublication.duration, samplePublication.properties)
                    .then(function (publication) {
                    return mgr
                        .getAllPublicationsForDevice(device.id)
                        .then(function (publications) {
                        publications.should.be.instanceof(Array);
                        publications.should.contain(publication);
                    });
                });
            });
        });
    });
    describe("getAllSubscriptionsForDevice()", function () {
        it("should return an empty [] when no publication exist for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .getAllSubscriptionsForDevice(device.id)
                    .then(function (subscriptions) {
                    subscriptions.should.be.instanceof(Array);
                    subscriptions.should.eql([]);
                });
            });
        });
        it("should return a subscription when it has been created for a given device", function () {
            var mgr = new manager_1.Manager(apiKey, apiLocation);
            return mgr
                .createMobileDevice(sampleDevice.name, sampleDevice.platform, sampleDevice.deviceToken, sampleDevice.location)
                .then(function (device) {
                return mgr
                    .createSubscription(sampleSubscription.topic, sampleSubscription.selector, sampleSubscription.range, sampleSubscription.duration)
                    .then(function (subscription) {
                    return mgr
                        .getAllSubscriptionsForDevice(device.id)
                        .then(function (subscriptions) {
                        subscriptions.should.be.instanceof(Array);
                        subscriptions.should.contain(subscription);
                    });
                });
            });
        });
    });
});
