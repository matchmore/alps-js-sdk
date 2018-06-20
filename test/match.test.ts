// @ts-ignore
// API key and apiEndpoint are stored in test/config.ts
import { environment } from "./config";

// let assert = require('assert');
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
import { Match } from "../src/model/models";

chai.should();
chai.use(chaiAsPromised);

const apiKey = environment.apiKey;
const apiLocation = environment.apiLocation;

function filter<T>(promise: Promise<T>, cb: (t: T) => boolean): Promise<T> {
  return promise.then(v => {
    return new Promise<T>(resolve => {
      if (cb(v)) resolve(v);
      else return filter(promise, cb);
    });
  });
}

async function setup(
  mgr: Manager,
  _subDevice?: models.Device,
  onDevice?: (device: models.Device) => void
): Promise<{
  pub: models.Publication;
  sub: models.Subscription;
  pubDevice: models.Device;
  subDevice: models.Device;
}> {
  let subDevice =
    _subDevice ||
    (await mgr.createMobileDevice(
      sampleDevice.name,
      sampleDevice.platform,
      sampleDevice.deviceToken
    ));

  let sub = await mgr.createSubscription(
    sampleSubscription.topic,
    sampleSubscription.range,
    sampleSubscription.duration,
    sampleSubscription.selector,
    subDevice.id
  );

  await mgr.updateLocation(sampleLocation, sub.deviceId);

  let pubDevice = await mgr.createMobileDevice(
    sampleDevice.name,
    sampleDevice.platform,
    sampleDevice.deviceToken
  );

  let pub = await mgr.createPublication(
    samplePublication.topic,
    samplePublication.range,
    samplePublication.duration,
    samplePublication.properties
  );

  await mgr.updateLocation(sampleLocation, pub.deviceId);
  return { pub, sub, pubDevice, subDevice };
}

describe("Matches", function() {
  it("should provide matches via single call", async () => {
    let mgr = new Manager(apiKey, apiLocation);
    let { pub, sub } = await setup(mgr);
    let matches = await mgr.getAllMatches(sub.deviceId);

    matches.should.be.instanceof(Array);
    matches.should.not.be.empty;
    let match = matches.filter(
      m => m.publication.id == pub.id && m.subscription.id == sub.id
    )[0];
    chai.assert.equal(match.publication.id, pub.id);
    chai.assert.equal(match.subscription.id, sub.id);
  });

  it("should provide matches via polling", async () => {
    let mgr = new Manager(apiKey, apiLocation);

    let subDevice = await mgr.createMobileDevice(
      sampleDevice.name,
      sampleDevice.platform,
      sampleDevice.deviceToken
    );
    mgr.startMonitoringMatches(MatchMonitorMode.polling);

    let p = new Promise<models.Match>(resolve => {
      mgr.onMatch = resolve;
    });

    let { pub, sub } = await setup(mgr, subDevice);
    let match = await p;
    chai.assert.equal(match.publication.id, pub.id);
    chai.assert.equal(match.subscription.id, sub.id);
  }).timeout(20000);

  it("should provide matches via websocket", async () => {
    let mgr = new Manager(apiKey, apiLocation);

    let subDevice = await mgr.createMobileDevice(
      sampleDevice.name,
      sampleDevice.platform,
      sampleDevice.deviceToken
    );
    mgr.startMonitoringMatches(MatchMonitorMode.websocket);

    let p = new Promise<models.Match>(resolve => {
      mgr.onMatch = resolve;
    });

    let { pub, sub } = await setup(mgr, subDevice);
    let match = await p;
    chai.assert.equal(match.publication.id, pub.id);
    chai.assert.equal(match.subscription.id, sub.id);
  }).timeout(20000);
});
