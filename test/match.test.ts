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
import { sampleDevice, sampleSubscription, sampleLocation, samplePublication } from "./common";

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

function setup(
  mgr: Manager,
  onDevice?: (device: models.Device) => void
): Promise<{ pub: models.Publication; sub: models.Subscription }> {
  let deviceWithSub = mgr
    .createMobileDevice(
      sampleDevice.name,
      sampleDevice.platform,
      sampleDevice.deviceToken
    )
    .then(device => {
      if (onDevice) onDevice(device);
      return mgr.createSubscription(
        sampleSubscription.topic,
        sampleSubscription.range,
        sampleSubscription.duration,
        sampleSubscription.selector
      );
    })
    .then(sub => {
      return mgr.updateLocation(sampleLocation, sub.deviceId).then(_ => sub);
    });

  let deviceWithPub = mgr
    .createMobileDevice(
      sampleDevice.name,
      sampleDevice.platform,
      sampleDevice.deviceToken
    )
    .then(device => {
      return mgr.createPublication(
        samplePublication.topic,
        samplePublication.range,
        samplePublication.duration,
        samplePublication.properties
      );
    })
    .then(pub => {
      return mgr.updateLocation(sampleLocation, pub.deviceId).then(_ => pub);
    });
  return Promise.all([deviceWithPub, deviceWithSub]).then(f => {
    return { pub: f[0], sub: f[1] };
  });
}

describe("Matches", function() {
  it("should provide matches via single call", function() {
    let mgr = new Manager(apiKey, apiLocation);

    setup(mgr)
      .then(f => {
        return mgr.getAllMatches(f.sub.deviceId).then(matches => {
          return { matches: matches, pubsub: f };
        });
      })
      .then(m => {
        let matches = m.matches;

        matches.should.be.instanceof(Array);
        matches.should.not.be.empty;
        let pub = m.pubsub.pub;
        let sub = m.pubsub.sub;
        let match = matches.filter(
          m => m.publication.id == pub.id && m.subscription.id == sub.id
        )[0];
        chai.assert.equal(match.publication.id, pub.id);
        chai.assert.equal(match.subscription.id,sub.id);
      });
  });

  it("should provide matches via polling", function() {
    let mgr = new Manager(apiKey, apiLocation);

    var p: Promise<models.Match>;

    let onDevice = (device: models.Device) => {
      mgr.startMonitoringMatches(MatchMonitorMode.polling);
      p = new Promise<models.Match>(resolve => {
        mgr.onMatch = resolve;
      });
    };

    setup(mgr, onDevice).then(m => {
      let pub = m.pub;
      let sub = m.sub;
      return filter(
        p,
        f => f.publication.id == pub.id || f.subscription.id == sub.id
      ).then(match => {
        chai.assert.equal(match.publication.id, pub.id);
        chai.assert.equal(match.subscription.id,sub.id);
      });
    });
  });

  it("should provide matches via websocket", function() {
    this.timeout(20000);
    let mgr = new Manager(apiKey, apiLocation);

    var p: Promise<models.Match>;

    let onDevice = (device: models.Device) => {
      mgr.startMonitoringMatches(MatchMonitorMode.websocket);
      p = new Promise<models.Match>(resolve => {
        mgr.onMatch = resolve;
      });
    };

    setup(mgr, onDevice).then(m => {
      let pub = m.pub;
      let sub = m.sub;
      return filter(
        p,
        f => f.publication.id == pub.id || f.subscription.id == sub.id
      ).then(match => {
        chai.assert.equal(match.publication.id, pub.id);
        chai.assert.equal(match.subscription.id,sub.id);
      });
    });
  });
});
