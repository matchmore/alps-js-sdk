"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MatchmoreEntityDiscriminator = (function () {
    function MatchmoreEntityDiscriminator() {
    }
    MatchmoreEntityDiscriminator.isDevice = function (x) {
        return (x.deviceToken !== undefined ||
            x.location !== undefined ||
            x.proximityUUID !== undefined);
    };
    MatchmoreEntityDiscriminator.isSubscription = function (x) {
        return x.selector !== undefined;
    };
    MatchmoreEntityDiscriminator.isPublication = function (x) {
        return x.properties !== undefined;
    };
    return MatchmoreEntityDiscriminator;
}());
exports.MatchmoreEntityDiscriminator = MatchmoreEntityDiscriminator;
var InMemoryPersistenceManager = (function () {
    function InMemoryPersistenceManager() {
        this._devices = [];
        this._publications = [];
        this._subscriptions = [];
    }
    InMemoryPersistenceManager.prototype.devices = function () {
        return this._devices;
    };
    InMemoryPersistenceManager.prototype.publications = function () {
        return this._publications;
    };
    InMemoryPersistenceManager.prototype.onLoad = function (onLoad) {
        this._onLoad = onLoad;
    };
    InMemoryPersistenceManager.prototype.subscriptions = function () {
        return this._subscriptions;
    };
    InMemoryPersistenceManager.prototype.add = function (entity) {
        if (MatchmoreEntityDiscriminator.isDevice(entity)) {
            var device = entity;
            this._devices.push(device);
            return;
        }
        if (MatchmoreEntityDiscriminator.isPublication(entity)) {
            var pub = entity;
            this._publications.push(pub);
            return;
        }
        if (MatchmoreEntityDiscriminator.isSubscription(entity)) {
            var sub = entity;
            this._subscriptions.push(sub);
            return;
        }
    };
    InMemoryPersistenceManager.prototype.defaultDevice = function () {
        return this._defaultDevice;
    };
    InMemoryPersistenceManager.prototype.addDevice = function (device, isDefault) {
        this.add(device);
        if (isDefault)
            this._defaultDevice = device;
    };
    return InMemoryPersistenceManager;
}());
exports.InMemoryPersistenceManager = InMemoryPersistenceManager;
//# sourceMappingURL=persistence.js.map