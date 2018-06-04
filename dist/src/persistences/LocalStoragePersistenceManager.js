var persistence_1 = require("../persistence");
var platform_1 = require('../platform');
var Storage = platform_1.default.storage;
var storageKey = '@matchmoreSdk:data';
var LocalStoragePersistenceManager = (function () {
    function LocalStoragePersistenceManager() {
        this._devices = [];
        this._publications = [];
        this._subscriptions = [];
        this.async = load();
    }
    LocalStoragePersistenceManager.prototype.devices = function () {
        return this._devices;
    };
    LocalStoragePersistenceManager.prototype.publications = function () {
        return this._publications;
    };
    LocalStoragePersistenceManager.prototype.subscriptions = function () {
        return this._subscriptions;
    };
    LocalStoragePersistenceManager.prototype.add = function (entity) {
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
    LocalStoragePersistenceManager.prototype.defaultDevice = function () {
        return this._defaultDevice;
    };
    LocalStoragePersistenceManager.prototype.addDevice = function (device, isDefault) {
        this.add(device);
        if (isDefault)
            this._defaultDevice = device;
    };
    LocalStoragePersistenceManager.prototype.onLoad = function (onLoad) {
        this._onLoad = onLoad;
    };
    return LocalStoragePersistenceManager;
})();
exports.default = LocalStoragePersistenceManager;
{
    var dataString = await, Storage_1, load = (storageKey);
    var data = JSON.parse(dataString);
    if (data) {
        this._devices = data.devices.map(function (deviceObject) { return deviceObject; });
        this._subscriptions = data.subscriptions.map(function (subscriptionObject) { return subscriptionObject; });
        this._publications = data.publications.map(function (publicationObject) { return publicationObject; });
        this._defaultDevice = data.defaultDevice;
    }
}
async;
save();
boolean;
{
    var saveData = {
        devices: this._devices,
        subscriptions: this._subscriptions,
        publications: this._publications,
        defaultDevice: this._defaultDevice,
    };
    return await;
    Storage.save(storageKey, JSON.stringify(saveData));
}
