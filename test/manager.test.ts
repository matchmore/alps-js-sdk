// API key and apiEndpoint are stored in test/config.js
import { environment } from "./config";

// const assert = require('assert');
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import "mocha";
import { Manager } from "../src/manager";
import * as models from "../src/model/models";
import { MatchMonitorMode } from "../src/matchmonitor";
import {
  sampleDevice,
  sampleSubscription,
  sampleLocation,
  samplePublication
} from "./common";

chai.should();
chai.use(chaiAsPromised);

const apiKey = environment.apiKey;
const apiLocation = environment.apiLocation;

describe("Manager", function() {
  describe("#instantiation", function() {
    it("should allow being instantiated with an apiKey", function() {
      const mgr = new Manager(apiKey, apiLocation);
      mgr.should.have.property("apiKey");
    });
  });

  describe("createMobileDevice()", function() {
    it("should create and send a device back", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );

      chai.expect(device).to.have.property("name");
      chai.expect(device).to.have.property("id");
      chai.expect(device).to.have.property("location");
    });
    it('should define the "defaultDevice"', async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );

      mgr.should.have.property("defaultDevice");
      chai.assert.equal(mgr.defaultDevice, device);
    });
    it("should allow to be used as a promise", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      device.should.have.property("name");
      device.should.have.property("id");
      device.should.have.property("location");
    });
    it("should add the newly created device to devices", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      mgr.should.have.property("devices");
      mgr.devices.should.include(device);
    });
  });
  describe("createPublication()", function() {
    it("should create and send a publication back", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );

      const publication = await mgr.createPublication(
        samplePublication.topic,
        samplePublication.range,
        samplePublication.duration,
        samplePublication.properties
      );

      publication.should.have.property("topic");
      publication.topic.should.equal(samplePublication.topic);
    });
    it("should add the newly created publication to publications", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      const publication = await mgr.createPublication(
        samplePublication.topic,
        samplePublication.range,
        samplePublication.duration,
        samplePublication.properties
      );
      mgr.should.have.property("publications");
      mgr.publications.should.include(publication);
    });
    it("should not allow to be called before createUser and createMobileDevice", function() {
      const completionDevice = function(device) {
        const mgr = new Manager(apiKey, apiLocation);
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
    it("should create and send a subscription back", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      const subscription = await mgr.createSubscription(
        sampleSubscription.topic,
        sampleSubscription.range,
        sampleSubscription.duration,
        sampleSubscription.selector
      );

      subscription.should.have.property("topic");
      subscription.topic.should.equal(sampleSubscription.topic);
    });
    it("should add the newly created subscription to subscriptions", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      const subscription = await mgr.createSubscription(
        sampleSubscription.topic,
        sampleSubscription.range,
        sampleSubscription.duration,
        sampleSubscription.selector
      );
      mgr.should.have.property("subscriptions");
      mgr.subscriptions.should.include(subscription);
    });
    it("should not allow to be called before createMobileDevice", function() {
      const mgr = new Manager(apiKey, apiLocation);
      return chai
        .expect(
          mgr.createSubscription(
            sampleSubscription.topic,
            sampleSubscription.range,
            sampleSubscription.duration,
            sampleSubscription.selector
          )
        )
        .to.be.eventually.rejectedWith(
          "There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id"
        );
    });
  });
  describe("updateLocation()", function() {
    it("should create location", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      await mgr.updateLocation(sampleLocation);
    });
    it("should not allow to be called before createMobileDevice", function() {
      const mgr = new Manager(apiKey, apiLocation);
      return chai
        .expect(mgr.updateLocation(sampleLocation))
        .to.be.eventually.rejectedWith(
          "There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id"
        );
    });
  });

  describe("getAllMatches()", function() {
    it("should not allow to be called before createMobileDevice", function() {
      const mgr = new Manager(apiKey, apiLocation);
      return chai
        .expect(mgr.getAllMatches())
        .to.be.eventually.rejectedWith(
          "There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id"
        );
    });
    it("should get an empty array when no matches are available", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      const matches = await mgr.getAllMatches();
      matches.should.be.instanceof(Array);
      matches.should.eql([]);
    });
  });
  describe("getAllPublications()", function() {
    it("should return an empty [] when no publication exist for a given device", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );

      const publications = await mgr.getAllPublications(device.id);
      publications.should.be.instanceof(Array);
      publications.should.eql([]);
    });
    it("should return a publication when it has been created for a given device", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );

      const publication = await mgr.createPublication(
        samplePublication.topic,
        samplePublication.range,
        samplePublication.duration,
        samplePublication.properties
      );

      const publications = await mgr.getAllPublications(device.id);
      publications.should.be.instanceof(Array);
      publications.should.contain(publication);
    });
  });
  describe("getAllSubscriptions()", function() {
    it("should return an empty [] when no publication exist for a given device", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      const subscriptions = await mgr.getAllSubscriptions(device.id);
      subscriptions.should.be.instanceof(Array);
      subscriptions.should.eql([]);
    });
    it("should return a subscription when it has been created for a given device", async () => {
      const mgr = new Manager(apiKey, apiLocation);
      const device = await mgr.createMobileDevice(
        sampleDevice.name,
        sampleDevice.platform,
        sampleDevice.deviceToken
      );
      const subscription = await mgr.createSubscription(
        sampleSubscription.topic,
        sampleSubscription.range,
        sampleSubscription.duration,
        sampleSubscription.selector
      );
      const subscriptions = await mgr.getAllSubscriptions(device.id);
      subscriptions.should.be.instanceof(Array);
      subscriptions.should.contain(subscription);
    });
  });
});
