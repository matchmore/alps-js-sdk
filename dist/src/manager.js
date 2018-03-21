"use strict";
var ScalpsCoreRestApi = require("matchmore_alps_core_rest_api");
var matchmonitor_1 = require("./matchmonitor");
var locationmanager_1 = require("./locationmanager");
var models = require("./model/models");
var Manager = (function () {
    function Manager(apiKey, apiUrlOverride) {
        this.apiKey = apiKey;
        // Store all the objects created by the manager:
        this.devices = [];
        this.publications = [];
        this.subscriptions = [];
        this.locations = [];
        this.init(apiUrlOverride);
    }
    Manager.prototype.init = function (apiUrlOverride) {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
        // Hack the api location (to use an overidden value if needed)
        if (apiUrlOverride)
            this.defaultClient.basePath = apiUrlOverride;
        this.matchMonitor = new matchmonitor_1.MatchMonitor(this);
        this.locationManager = new locationmanager_1.LocationManager(this);
    };
    Manager.prototype.createMobileDevice = function (name, platform, deviceToken, location, completion) {
        return this.createAnyDevice({
            deviceType: models.DeviceType.MobileDevice,
            name: name,
            platform: platform,
            deviceToken: deviceToken,
            location: location
        }, completion);
    };
    Manager.prototype.createPinDevice = function (location, completion) {
        return this.createAnyDevice({
            deviceType: models.DeviceType.PinDevice,
            name: name,
            location: location
        }, completion);
    };
    Manager.prototype.createIBeaconDevice = function (proximityUUID, major, minor, location, completion) {
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
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.createDevice(device, callback);
        });
        return p.then(function (device) {
            _this.devices.push(device);
            _this.defaultDevice = _this.devices[0];
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
    Manager.prototype.createPublication = function (topic, range, duration, properties, completion) {
        if (this.defaultDevice) {
            return this.createAnyPublication(this.defaultDevice.id, topic, range, duration, properties, completion);
        }
        else {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
    };
    Manager.prototype.createAnyPublication = function (deviceId, topic, range, duration, properties, completion) {
        var _this = this;
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
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.createPublication(deviceId, topic, range, duration, properties, callback);
        });
        return p.then(function (publication) {
            _this.publications.push(publication);
            if (completion)
                completion(publication);
            return publication;
        });
    };
    Manager.prototype.createSubscription = function (topic, selector, range, duration, completion) {
        if (this.defaultDevice) {
            return this.createAnySubscription(this.defaultDevice.id, topic, selector, range, duration, completion);
        }
        else {
            throw new Error("There is no default device available, please call createDevice before createSubscription");
        }
    };
    Manager.prototype.createAnySubscription = function (deviceId, topic, selector, range, duration, completion) {
        var _this = this;
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
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.createSubscription(deviceId, topic, selector, range, duration, callback);
        });
        return p.then(function (subscription) {
            _this.subscriptions.push(subscription);
            if (completion)
                completion(subscription);
            return subscription;
        });
    };
    Manager.prototype.updateLocation = function (latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion) {
        if (this.defaultDevice) {
            return this.updateAnyLocation(this.defaultDevice.id, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion);
        }
        else {
            throw new Error("There is no default device available, please call createDevice before updateLocation");
        }
    };
    Manager.prototype.updateAnyLocation = function (deviceId, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.LocationApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while creating location ['" +
                        latitude +
                        "','" +
                        longitude +
                        "']  :" +
                        error);
                }
                else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            var opts = {
                horizontalAccuracy: horizontalAccuracy,
                verticalAccuracy: verticalAccuracy
            };
            api.createLocation(deviceId, latitude, longitude, altitude, opts, callback);
        });
        return p.then(function (location) {
            _this.locations.push(location);
            if (completion)
                completion(location);
            return location;
        });
    };
    Manager.prototype.getAllMatches = function (completion) {
        if (this.defaultDevice) {
            return this.getAllMatchesForAny(this.defaultDevice.id);
        }
        else {
            throw new Error("There is no default device available, please call createDevice before getAllMatches");
        }
    };
    Manager.prototype.getAllMatchesForAny = function (deviceId, completion) {
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching matches: " + error);
                }
                else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.getMatches(deviceId, callback);
        });
        p.then(function (matches) {
            if (completion)
                completion(matches);
        });
        return p;
    };
    Manager.prototype.getAllPublicationsForDevice = function (deviceId, completion) {
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching publications: " + error);
                }
                else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.getPublications(deviceId, callback);
        });
        return p;
    };
    Manager.prototype.getAllSubscriptionsForDevice = function (deviceId, completion) {
        var p = new Promise(function (resolve, reject) {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while fetching subscriptions: " + error);
                }
                else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.getSubscriptions(deviceId, callback);
        });
        return p;
    };
    Manager.prototype.onMatch = function (completion) {
        this.matchMonitor.onMatch = completion;
    };
    Manager.prototype.onLocationUpdate = function (completion) {
        this.locationManager.onLocationUpdate = completion;
    };
    Manager.prototype.startMonitoringMatches = function () {
        this.matchMonitor.startMonitoringMatches();
    };
    Manager.prototype.stopMonitoringMatches = function () {
        this.matchMonitor.stopMonitoringMatches();
    };
    Manager.prototype.startUpdatingLocation = function () {
        this.locationManager.startUpdatingLocation();
    };
    Manager.prototype.stopUpdatingLocation = function () {
        this.locationManager.stopUpdatingLocation();
    };
    return Manager;
}());
exports.Manager = Manager;
