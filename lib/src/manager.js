"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScalpsCoreRestApi = require("matchmore_alps_core_rest_api");
var Base64 = require("Base64");
var matchmonitor_1 = require("./matchmonitor");
var locationmanager_1 = require("./locationmanager");
var models = require("./model/models");
var persistence_1 = require("./persistence");
var Manager = (function () {
    function Manager(apiKey, apiUrlOverride, persistenceManager) {
        this.apiKey = apiKey;
        this.apiUrlOverride = apiUrlOverride;
        this._persistenceManager =
            persistenceManager || new persistence_1.InMemoryPersistenceManager();
        this.init();
    }
    Manager.prototype.init = function () {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1]));
        this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
        if (this.apiUrlOverride)
            this.defaultClient.basePath = this.apiUrlOverride;
        else
            this.apiUrlOverride = this.defaultClient.basePath;
        this._matchMonitor = new matchmonitor_1.MatchMonitor(this);
        this._locationManager = new locationmanager_1.LocationManager(this);
    };
    Object.defineProperty(Manager.prototype, "defaultDevice", {
        get: function () {
            return this._persistenceManager.defaultDevice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Manager.prototype, "devices", {
        get: function () {
            return this._persistenceManager.devices();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Manager.prototype, "publications", {
        get: function () {
            return this._persistenceManager.publications();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Manager.prototype, "subscriptions", {
        get: function () {
            return this._persistenceManager.subscriptions();
        },
        enumerable: true,
        configurable: true
    });
    Manager.prototype.createMobileDevice = function (name, platform, deviceToken, completion) {
        return this.createAnyDevice({
            deviceType: models.DeviceType.MobileDevice,
            name: name,
            platform: platform,
            deviceToken: deviceToken
        }, completion);
    };
    Manager.prototype.createPinDevice = function (name, location, completion) {
        return this.createAnyDevice({
            deviceType: models.DeviceType.PinDevice,
            name: name,
            location: location
        }, completion);
    };
    Manager.prototype.createIBeaconDevice = function (name, proximityUUID, major, minor, location, completion) {
        return this.createAnyDevice({
            deviceType: models.DeviceType.IBeaconDevice,
            name: name,
            proximityUUID: proximityUUID,
            major: major,
            minor: minor,
            location: location
        }, completion);
    };
    Manager.prototype.createAnyDevice = function (device, completion) {
        var _this = this;
        device = this.setDeviceType(device);
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while creating device '" +
                        device.name +
                        "' :" +
                        error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            api.createDevice(device, callback);
        });
        return p.then(function (device) {
            var ddevice = _this._persistenceManager.defaultDevice();
            var isDefault = !ddevice;
            _this._persistenceManager.addDevice(device, isDefault);
            if (completion)
                completion(device);
            return device;
        });
    };
    Manager.prototype.setDeviceType = function (device) {
        if (this.isMobileDevice(device)) {
            device.deviceType = models.DeviceType.MobileDevice;
            return device;
        }
        if (this.isBeaconDevice(device)) {
            device.deviceType = models.DeviceType.IBeaconDevice;
            return device;
        }
        if (this.isPinDevice(device)) {
            device.deviceType = models.DeviceType.PinDevice;
            return device;
        }
        throw new Error("Cannot determine device type");
    };
    Manager.prototype.isMobileDevice = function (device) {
        return device.platform !== undefined;
    };
    Manager.prototype.isPinDevice = function (device) {
        return device.location !== undefined;
    };
    Manager.prototype.isBeaconDevice = function (device) {
        return device.major !== undefined;
    };
    Manager.prototype.createPublication = function (topic, range, duration, properties, deviceId, completion) {
        var _this = this;
        if (!this.defaultDevice) {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.PublicationApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while creating publication '" +
                        topic +
                        "' :" +
                        error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            var publication = {
                worldId: _this.token.sub,
                topic: topic,
                deviceId: _deviceId,
                range: range,
                duration: duration,
                properties: properties
            };
            api.createPublication(_deviceId, publication, callback);
        });
        return p.then(function (publication) {
            _this._persistenceManager.add(publication);
            if (completion)
                completion(publication);
            return publication;
        });
    };
    Manager.prototype.createSubscription = function (topic, range, duration, selector, deviceId, completion) {
        var _this = this;
        if (!this.defaultDevice) {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.SubscriptionApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while creating subscription '" +
                        topic +
                        "' :" +
                        error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            var subscription = {
                worldId: _this.token.sub,
                topic: topic,
                deviceId: _deviceId,
                range: range,
                duration: duration,
                selector: selector
            };
            api.createSubscription(_deviceId, subscription, callback);
        });
        return p.then(function (subscription) {
            _this._persistenceManager.add(subscription);
            if (completion)
                completion(subscription);
            return subscription;
        });
    };
    Manager.prototype.updateLocation = function (location, deviceId, completion) {
        var _this = this;
        if (!this.defaultDevice) {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.LocationApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while creating location ['" +
                        location.latitude +
                        "','" +
                        location.longitude +
                        "']  :" +
                        error);
                }
                else {
                    resolve();
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            api.createLocation(_deviceId, location, callback);
        });
        return p.then(function (location) {
            if (completion)
                completion;
        });
    };
    Manager.prototype.getAllMatches = function (deviceId, completion) {
        var _this = this;
        if (!this.defaultDevice) {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching matches: " + error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            api.getMatches(_deviceId, callback);
        });
        return p.then(function (matches) {
            if (completion)
                completion(matches);
            return matches;
        });
    };
    Manager.prototype.getMatch = function (matchId, string, deviceId, completion) {
        var _this = this;
        if (!this.defaultDevice) {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching matches: " + error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            api.getMatch(_deviceId, matchId, callback);
        });
        return p.then(function (matches) {
            if (completion)
                completion(matches);
            return matches;
        });
    };
    Manager.prototype.getAllPublications = function (deviceId, completion) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching publications: " + error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            api.getPublications(_deviceId, callback);
        });
        return p;
    };
    Manager.prototype.getAllSubscriptions = function (deviceId, completion) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching subscriptions: " + error);
                }
                else {
                    resolve(JSON.parse(response.text));
                }
            };
            var _deviceId = deviceId ? deviceId : _this.defaultDevice.id;
            api.getSubscriptions(_deviceId, callback);
        });
        return p;
    };
    Manager.prototype.onMatch = function (completion) {
        this._matchMonitor.onMatch = completion;
    };
    Manager.prototype.onLocationUpdate = function (completion) {
        this._locationManager.onLocationUpdate = completion;
    };
    Manager.prototype.startMonitoringMatches = function (mode) {
        this._matchMonitor.startMonitoringMatches(mode);
    };
    Manager.prototype.stopMonitoringMatches = function () {
        this._matchMonitor.stopMonitoringMatches();
    };
    Manager.prototype.startUpdatingLocation = function () {
        this._locationManager.startUpdatingLocation();
    };
    Manager.prototype.stopUpdatingLocation = function () {
        this._locationManager.stopUpdatingLocation();
    };
    return Manager;
}());
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map