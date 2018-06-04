var persistence_1 = require("../persistence");
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
        if (persistence_1.MatchmoreEntityDiscriminator.isDevice(entity)) {
            var device = entity;
            this._devices.push(device);
            return;
        }
        if (persistence_1.MatchmoreEntityDiscriminator.isPublication(entity)) {
            var pub = entity;
            this._publications.push(pub);
            return;
        }
        if (persistence_1.MatchmoreEntityDiscriminator.isSubscription(entity)) {
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
    InMemoryPersistenceManager.prototype.load = function () {
        // do nothing
        return true;
    };
    InMemoryPersistenceManager.prototype.save = function () {
        // do nothing
        return true;
    };
    return InMemoryPersistenceManager;
})();
exports.default = InMemoryPersistenceManager;
