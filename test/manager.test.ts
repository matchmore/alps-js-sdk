// API key and apiEndpoint are stored in test/config.js
import { environment } from "./config";

// let assert = require('assert');
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import "mocha";
import { Manager } from "../src/manager";
import * as models from "../src/model/models";
chai.should();
chai.use(chaiAsPromised);

const apiKey = environment.apiKey;
const apiLocation = environment.apiLocation;

// STUB OBJECTS

let samplePublication = {
  topic: "sampletopic",
  range: 300,
  duration: 60,
  properties: { data1: "value1", data2: 1, data3: false }
};

let sampleSubscription = {
  topic: "sampletopic",
  selector: "data1='value1'",
  range: 300,
  duration: 60
};

let sampleLocation: models.Location = {
  latitude: 0,
  longitude: 0,
  altitude: 0,
  horizontalAccuracy: 1.0,
  verticalAccuracy: 1.0
};

let sampleDevice: models.MobileDevice = {
  name: "test",
  platform: "iOS",
  deviceToken: "f4eea68c-a349-4dbe-a395-c935abc7f6f2",
  location: sampleLocation
};

describe("Manager", function() {
  this.timeout(5000);
  describe("#instantiation", function() {
    it("should allow being instantiated with an apiKey", function() {
      let mgr = new Manager(apiKey, apiLocation);
      mgr.should.have.property("apiKey");
    });
  });

  describe("createMobileDevice()", function() {
    it("should create and send a device back", function(done) {
      let completionDevice = function(device) {
        chai.expect(device).to.have.property("name");
        chai.expect(device).to.have.property("id");
        chai.expect(device).to.have.property("location");
        done();
      };
      let mgr = new Manager(apiKey, apiLocation);
      mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken,
        sampleDevice.location,
        completionDevice
      );
    });
    it('should define the "defaultDevice"', function(done) {
      let completionDevice = function(device) {
        mgr.should.have.property("defaultDevice");
        mgr.defaultDevice.should.equal(device);
        done();
      };
      let mgr = new Manager(apiKey, apiLocation);
      mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken,
        sampleDevice.location,
        completionDevice
      );
    });
    it("should allow to be used as a promise", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          device.should.have.property("name");
          device.should.have.property("id");
          device.should.have.property("location");
        });
    });
    it("should add the newly created device to devices", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          mgr.should.have.property("devices");
          mgr.devices.should.include(device);
        });
    });
  });
  describe("createPublication()", function() {
    it("should create and send a publication back", function() {
      let mgr = new Manager(apiKey, apiLocation);
      let publication = mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .createPublication(
              samplePublication.topic,
              samplePublication.range,
              samplePublication.duration,
              samplePublication.properties
            )
            .then(publication => {
              return publication;
            });
        });
      return Promise.all([
        publication.should.eventually.have
          .property("topic")
          .and.should.eventually.equal(samplePublication.topic)
      ]);
    });
    it("should add the newly created publication to publications", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .createPublication(
              samplePublication.topic,
              samplePublication.range,
              samplePublication.duration,
              samplePublication.properties
            )
            .then(publication => {
              mgr.should.have.property("publications");
              mgr.publications.should.include(publication);
            });
        });
    });
    it("should not allow to be called before createUser and createMobileDevice", function() {
      let completionDevice = function(device) {
        let mgr = new Manager(apiKey, apiLocation);
        chai
          .expect(() => {
            mgr.createPublication(
              samplePublication.topic,
              samplePublication.range,
              samplePublication.duration,
              samplePublication.properties
            );
          })
          .to.throw(Error);
      };
    });
  });
  describe("createSubscription()", function() {
    it("should create and send a subscription back", function() {
      let mgr = new Manager(apiKey, apiLocation);
      let subscription = mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .createSubscription(
              sampleSubscription.topic,
              sampleSubscription.selector,
              sampleSubscription.range,
              sampleSubscription.duration
            )
            .then(subscription => {
              return subscription;
            });
        });
      return Promise.all([
        subscription.should.eventually.have
          .property("topic")
          .and.should.eventually.equal(sampleSubscription.topic)
      ]);
    });
    it("should add the newly created subscription to subscriptions", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .createSubscription(
              sampleSubscription.topic,
              sampleSubscription.selector,
              sampleSubscription.range,
              sampleSubscription.duration
            )
            .then(subscription => {
              mgr.should.have.property("subscriptions");
              mgr.subscriptions.should.include(subscription);
            });
        });
    });
    it("should not allow to be called before createMobileDevice", function() {
      let completionDevice = function(device) {
        let mgr = new Manager(apiKey, apiLocation);
        chai
          .expect(() => {
            mgr.createSubscription(
              sampleSubscription.topic,
              sampleSubscription.selector,
              sampleSubscription.range,
              sampleSubscription.duration
            );
          })
          .to.throw(Error);
      };
    });
  });
  describe("updateLocation()", function() {
    it("should create location", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .updateLocation(
              sampleLocation
            );
        });
    });
    it("should not allow to be called before  createMobileDevice", function() {
      let completionDevice = function(device) {
        let mgr = new Manager(apiKey, apiLocation);
        chai
          .expect(() => {
            mgr.updateLocation(
              sampleLocation
            );
          })
          .to.throw(Error);
      };
    });
  });
  describe("getAllMatches()", function() {
    it("should not allow to be called before createMobileDevice", function() {
      let mgr = new Manager(apiKey, apiLocation);
      chai
        .expect(() => {
          mgr.getAllMatches();
        })
        .to.throw(Error);
    });
    it("should get an empty array when no matches are available", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr.getAllMatches().then(matches => {
            matches.should.be.instanceof(Array);
            matches.should.eql([]);
          });
        });
    });
  });
  describe("getAllPublicationsForDevice()", function() {
    it("should return an empty [] when no publication exist for a given device", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .getAllPublicationsForDevice(device.id)
            .then(publications => {
              publications.should.be.instanceof(Array);
              publications.should.eql([]);
            });
        });
    });
    it("should return a publication when it has been created for a given device", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .createPublication(
              samplePublication.topic,
              samplePublication.range,
              samplePublication.duration,
              samplePublication.properties
            )
            .then(publication => {
              return mgr
                .getAllPublicationsForDevice(device.id)
                .then(publications => {
                  publications.should.be.instanceof(Array);
                  publications.should.contain(publication);
                });
            });
        });
    });
  });
  describe("getAllSubscriptionsForDevice()", function() {
    it("should return an empty [] when no publication exist for a given device", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .getAllSubscriptionsForDevice(device.id)
            .then(subscriptions => {
              subscriptions.should.be.instanceof(Array);
              subscriptions.should.eql([]);
            });
        });
    });
    it("should return a subscription when it has been created for a given device", function() {
      let mgr = new Manager(apiKey, apiLocation);
      return mgr
        .createMobileDevice(
          sampleDevice.name,
          sampleDevice.platform,
          sampleDevice.deviceToken,
          sampleDevice.location
        )
        .then(device => {
          return mgr
            .createSubscription(
              sampleSubscription.topic,
              sampleSubscription.selector,
              sampleSubscription.range,
              sampleSubscription.duration
            )
            .then(subscription => {
              return mgr
                .getAllSubscriptionsForDevice(device.id)
                .then(subscriptions => {
                  subscriptions.should.be.instanceof(Array);
                  subscriptions.should.contain(subscription);
                });
            });
        });
    });
  });
});
