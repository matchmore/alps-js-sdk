var _this = this;
var ScalpsCoreRestApi = require("matchmore_alps_core_rest_api");
var Base64 = require("Base64");
var matchmonitor_1 = require("./matchmonitor");
exports.MatchMonitorMode = matchmonitor_1.MatchMonitorMode;
var locationmanager_1 = require("./locationmanager");
var models = require("./model/models");
var persistence_1 = require("./persistence");
var platform_1 = require('./platform');
exports.PlatformConfig = platform_1.default;
var Manager = (function () {
    function Manager(apiKey, apiUrlOverride, persistenceManager, gpsConfig) {
        this.apiKey = apiKey;
        this.apiUrlOverride = apiUrlOverride;
        this.async = load();
        if (!apiKey)
            throw new Error("Api key required");
        this._persistenceManager =
            persistenceManager || new persistence_1.InMemoryPersistenceManager();
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1])); // as Token;
        this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
        // Hack the api location (to use an overidden value if needed)
        if (this.apiUrlOverride)
            this.defaultClient.basePath = this.apiUrlOverride;
        else
            this.apiUrlOverride = this.defaultClient.basePath;
        this._matchMonitor = new matchmonitor_1.MatchMonitor(this);
        this._locationManager = new locationmanager_1.LocationManager(this, gpsConfig);
    }
    return Manager;
})();
exports.Manager = Manager;
boolean;
{
    await;
    this._persistenceManager.load();
}
get;
apiUrl();
{
    return this.defaultClient.basePath;
}
get;
defaultDevice();
models.Device | undefined;
{
    return this._persistenceManager.defaultDevice();
}
get;
devices();
models.Device[];
{
    return this._persistenceManager.devices();
}
get;
publications();
models.Publication[];
{
    return this._persistenceManager.publications();
}
get;
subscriptions();
models.Subscription[];
{
    return this._persistenceManager.subscriptions();
}
createMobileDevice(name, string, platform, string, deviceToken, string, completion ?  : function (device) { return void ; });
Promise < models.MobileDevice > {
    return: this.createAnyDevice({
        deviceType: models.DeviceType.MobileDevice,
        name: name,
        platform: platform,
        deviceToken: deviceToken
    }, completion)
};
createPinDevice(name, string, location, models.Location, completion ?  : function (device) { return void ; });
Promise < models.PinDevice > {
    return: this.createAnyDevice({
        deviceType: models.DeviceType.PinDevice,
        name: name,
        location: location
    }, completion)
};
createIBeaconDevice(name, string, proximityUUID, string, major, number, minor, number, location, models.Location, completion ?  : function (device) { return void ; });
Promise < models.IBeaconDevice > {
    return: this.createAnyDevice({
        deviceType: models.DeviceType.IBeaconDevice,
        name: name,
        proximityUUID: proximityUUID,
        major: major,
        minor: minor,
        location: location
    }, completion)
};
createAnyDevice(device, models.Device, completion ?  : function (device) { return void ; });
Promise < T > {
    device:  = this.setDeviceType(device),
    let: p = new Promise(function (resolve, reject) {
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
    }),
    return: p.then(function (device) {
        var ddevice = _this._persistenceManager.defaultDevice();
        var isDefault = !ddevice;
        _this._persistenceManager.addDevice(device, isDefault);
        if (completion)
            completion(device);
        return device;
    })
};
setDeviceType(device, models.Device);
models.Device;
{
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
}
isMobileDevice(device, models.Device);
device;
is;
models.MobileDevice;
{
    return device.platform !== undefined;
}
isPinDevice(device, models.Device);
device;
is;
models.PinDevice;
{
    return device.location !== undefined;
}
isBeaconDevice(device, models.Device);
device;
is;
models.IBeaconDevice;
{
    return device.major !== undefined;
}
createPublication(topic, string, range, number, duration, number, properties, Object, deviceId ?  : string, completion ?  : function (publication) { return void ; });
Promise < models.Publication > {
    return: this.withDevice(deviceId)(function (deviceId) {
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
            var publication = {
                worldId: _this.token.sub,
                topic: topic,
                deviceId: deviceId,
                range: range,
                duration: duration,
                properties: properties
            };
            api.createPublication(deviceId, publication, callback);
        });
        return p.then(function (publication) {
            _this._persistenceManager.add(publication);
            if (completion)
                completion(publication);
            return publication;
        });
    })
};
createSubscription(topic, string, range, number, duration, number, selector ?  : string, deviceId ?  : string, completion ?  : function (subscription) { return void ; });
Promise < models.Subscription > {
    return: this.withDevice(deviceId)(function (deviceId) {
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
            var subscription = {
                worldId: _this.token.sub,
                topic: topic,
                deviceId: deviceId,
                range: range,
                duration: duration,
                selector: selector || ""
            };
            api.createSubscription(deviceId, subscription, callback);
        });
        return p.then(function (subscription) {
            _this._persistenceManager.add(subscription);
            if (completion)
                completion(subscription);
            return subscription;
        });
    })
};
updateLocation(location, models.Location, deviceId ?  : string);
Promise < void  > {
    return: this.withDevice(deviceId)(function (deviceId) {
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
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve();
                }
            };
            api.createLocation(deviceId, location, callback);
        });
        return p.then(function (_) {
        });
    })
};
getAllMatches(deviceId ?  : string, completion ?  : function (matches) { return void ; });
Promise < models.Match[] > {
    return: this.withDevice(deviceId)(function (deviceId) {
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
        return p.then(function (matches) {
            if (completion)
                completion(matches);
            return matches;
        });
    })
};
getMatch(matchId, string, deviceId ?  : string, completion ?  : function (matches) { return void ; });
Promise < models.Match > {
    return: this.withDevice(deviceId)(function (deviceId) {
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
            api.getMatch(deviceId, matchId, callback);
        });
        return p.then(function (matches) {
            if (completion)
                completion(matches);
            return matches;
        });
    })
};
getAllPublications(deviceId ?  : string, completion ?  : function (publications) { return void ; });
{
    return this.withDevice(deviceId)(function (deviceId) {
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
    });
}
withDevice(deviceId ?  : string);
(function (p) { return T; });
{
    if (!!deviceId) {
        return function (p) { return p(deviceId); };
    }
    ;
    if (!!this.defaultDevice && !!this.defaultDevice.id) {
        return function (p) { return p(_this.defaultDevice.id); };
    }
    ;
    throw new Error("There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id");
}
getAllSubscriptions(deviceId ?  : string, completion ?  : function (subscriptions) { return void ; });
{
    return this.withDevice(deviceId)(function (deviceId) {
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
    });
}
/**
 * Registers a callback for matches
 * @param completion
 */
set;
onMatch(completion, function (match) { return void ; });
{
    this._matchMonitor.onMatch = completion;
}
/**
 * Register a callback for location updates
 * @param completion
 */
set;
onLocationUpdate(completion, function (location) { return void ; });
{
    this._locationManager.onLocationUpdate = completion;
}
startMonitoringMatches(mode, matchmonitor_1.MatchMonitorMode);
{
    this._matchMonitor.startMonitoringMatches(mode);
}
stopMonitoringMatches();
{
    this._matchMonitor.stopMonitoringMatches();
}
startUpdatingLocation();
{
    this._locationManager.startUpdatingLocation();
}
stopUpdatingLocation();
{
    this._locationManager.stopUpdatingLocation();
}
