"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
require("mocha");
var manager_1 = require("../src/manager");
var matchmonitor_1 = require("../src/matchmonitor");
var common_1 = require("./common");
chai.should();
chai.use(chaiAsPromised);
var apiKey = config_1.environment.apiKey;
var apiLocation = config_1.environment.apiLocation;
function filter(promise, cb) {
    return promise.then(function (v) {
        return new Promise(function (resolve) {
            if (cb(v))
                resolve(v);
            else
                return filter(promise, cb);
        });
    });
}
function setup(mgr, onDevice) {
    var deviceWithSub = mgr
        .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
        .then(function (device) {
        if (onDevice)
            onDevice(device);
        return mgr.createSubscription(common_1.sampleSubscription.topic, common_1.sampleSubscription.range, common_1.sampleSubscription.duration, common_1.sampleSubscription.selector);
    })
        .then(function (sub) {
        return mgr.updateLocation(common_1.sampleLocation, sub.deviceId).then(function (_) { return sub; });
    });
    var deviceWithPub = mgr
        .createMobileDevice(common_1.sampleDevice.name, common_1.sampleDevice.platform, common_1.sampleDevice.deviceToken)
        .then(function (device) {
        return mgr.createPublication(common_1.samplePublication.topic, common_1.samplePublication.range, common_1.samplePublication.duration, common_1.samplePublication.properties);
    })
        .then(function (pub) {
        return mgr.updateLocation(common_1.sampleLocation, pub.deviceId).then(function (_) { return pub; });
    });
    return Promise.all([deviceWithPub, deviceWithSub]).then(function (f) {
        return { pub: f[0], sub: f[1] };
    });
}
describe("Matches", function () {
    it("should provide matches via single call", function () {
        var mgr = new manager_1.Manager(apiKey, apiLocation);
        setup(mgr)
            .then(function (f) {
            return mgr.getAllMatches(f.sub.deviceId).then(function (matches) {
                return { matches: matches, pubsub: f };
            });
        })
            .then(function (m) {
            var matches = m.matches;
            matches.should.be.instanceof(Array);
            matches.should.not.be.empty;
            var pub = m.pubsub.pub;
            var sub = m.pubsub.sub;
            var match = matches.filter(function (m) { return m.publication.id == pub.id && m.subscription.id == sub.id; })[0];
            chai.assert.equal(match.publication.id, pub.id);
            chai.assert.equal(match.subscription.id, sub.id);
        });
    });
    it("should provide matches via polling", function () {
        var mgr = new manager_1.Manager(apiKey, apiLocation);
        var p;
        var onDevice = function (device) {
            mgr.startMonitoringMatches(matchmonitor_1.MatchMonitorMode.polling);
            p = new Promise(function (resolve) {
                mgr.onMatch = resolve;
            });
        };
        setup(mgr, onDevice).then(function (m) {
            var pub = m.pub;
            var sub = m.sub;
            return filter(p, function (f) { return f.publication.id == pub.id || f.subscription.id == sub.id; }).then(function (match) {
                chai.assert.equal(match.publication.id, pub.id);
                chai.assert.equal(match.subscription.id, sub.id);
            });
        });
    });
    it("should provide matches via websocket", function () {
        this.timeout(20000);
        var mgr = new manager_1.Manager(apiKey, apiLocation);
        var p;
        var onDevice = function (device) {
            mgr.startMonitoringMatches(matchmonitor_1.MatchMonitorMode.websocket);
            p = new Promise(function (resolve) {
                mgr.onMatch = resolve;
            });
        };
        setup(mgr, onDevice).then(function (m) {
            var pub = m.pub;
            var sub = m.sub;
            return filter(p, function (f) { return f.publication.id == pub.id || f.subscription.id == sub.id; }).then(function (match) {
                chai.assert.equal(match.publication.id, pub.id);
                chai.assert.equal(match.subscription.id, sub.id);
            });
        });
    });
});
//# sourceMappingURL=match.test.js.map