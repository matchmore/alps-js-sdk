"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const Base64 = require("Base64");
const matchmonitor_1 = require("./matchmonitor");
const locationmanager_1 = require("./locationmanager");
const index_1 = require("./index");
class Manager {
    constructor(apiKey, apiUrlOverride, persistenceManager, gpsConfig) {
        this.apiKey = apiKey;
        this.apiUrlOverride = apiUrlOverride;
        if (!apiKey)
            throw new Error("Api key required");
        this._persistenceManager =
            persistenceManager || new index_1.InMemoryPersistenceManager();
        this.token = JSON.parse(Base64.atob(this.apiKey.split(".")[1])); // as Token;
        // this.defaultClient.authentications["api-key"].apiKey = this.apiKey;
        // Hack the api location (to use an overidden value if needed)
        var basePath = "https://api.matchmore.io/v5";
        if (this.apiUrlOverride)
            basePath = this.apiUrlOverride;
        else
            this.apiUrlOverride = basePath;
        this.defaultClient = new client_1.Client(basePath, options => {
            options.headers["Authorization"] = this.apiKey;
            return options;
        });
        this._matchMonitor = new matchmonitor_1.MatchMonitor(this);
        this._locationManager = new locationmanager_1.LocationManager(this, gpsConfig);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistenceManager.load();
        });
    }
    get apiUrl() {
        return this.apiUrlOverride;
    }
    get defaultDevice() {
        return this._persistenceManager.defaultDevice();
    }
    get devices() {
        return this._persistenceManager.devices();
    }
    get publications() {
        return this._persistenceManager.publications();
    }
    get subscriptions() {
        return this._persistenceManager.subscriptions();
    }
    /**
     * Creates a mobile device
     * @param name
     * @param platform
     * @param deviceToken platform token for push notifications for example apns://apns-token or fcm://fcm-token
     * @param completion optional callback
     */
    createMobileDevice(name, platform, deviceToken, completion) {
        return this.createAnyDevice({
            name: name,
            platform: platform,
            deviceToken: deviceToken
        }, completion);
    }
    /**
     * Create a pin device
     * @param name
     * @param location
     * @param completion optional callback
     */
    createPinDevice(name, location, completion) {
        return this.createAnyDevice(new client_1.PinDevice({
            name: name,
            location: location
        }), completion);
    }
    /**
     * Creates an ibeacon device
     * @param name
     * @param proximityUUID
     * @param major
     * @param minor
     * @param location
     * @param completion optional callback
     */
    createIBeaconDevice(name, proximityUUID, major, minor, location, completion) {
        return this.createAnyDevice(new client_1.IBeaconDevice({
            name: name,
            proximityUUID: proximityUUID,
            major: major,
            minor: minor
        }), completion);
    }
    /**
     * Create a device
     * @param device whole device object
     * @param completion optional callback
     */
    createAnyDevice(device, completion) {
        let p = new Promise((resolve, reject) => {
            let api = this.defaultClient;
            let callback = function (error, data, response) {
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
            api.createDevice(device);
        });
        return p.then((device) => {
            let ddevice = this._persistenceManager.defaultDevice();
            let isDefault = !ddevice;
            this._persistenceManager.addDevice(device, isDefault);
            if (completion)
                completion(device);
            return device;
        });
    }
    deleteDevice(deviceId, completion) {
        let p = new Promise((resolve, reject) => {
            let api = this.defaultClient;
            let callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while deleting device '" +
                        deviceId +
                        "' :" +
                        error);
                }
                else {
                    resolve();
                }
            };
            api.deleteDevice(deviceId);
        });
        return p.then(() => {
            let d = this._persistenceManager.devices().find(d => d.id == deviceId);
            if (d)
                this._persistenceManager.remove(d);
            if (completion)
                completion();
        });
    }
    // private setDeviceType(device: Device): Device {
    //   if (this.isMobileDevice(device)) {
    //     device.deviceType = DeviceType.MobileDevice;
    //     return device;
    //   }
    //   if (this.isBeaconDevice(device)) {
    //     device.deviceType = DeviceType.IBeaconDevice;
    //     return device;
    //   }
    //   if (this.isPinDevice(device)) {
    //     device.deviceType = DeviceType.PinDevice;
    //     return device;
    //   }
    //   throw new Error("Cannot determine device type");
    // }
    isMobileDevice(device) {
        return device.platform !== undefined;
    }
    isPinDevice(device) {
        return device.location !== undefined;
    }
    isBeaconDevice(device) {
        return device.major !== undefined;
    }
    /**
     * Create a publication for a device
     * @param topic topic of the publication
     * @param range range in meters
     * @param duration time in seconds
     * @param properties properties on which the sub selector can filter on
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    createPublication(topic, range, duration, properties, deviceId, completion) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
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
                let publication = new client_1.Publication({
                    worldId: this.token.sub,
                    topic: topic,
                    deviceId: deviceId,
                    range: range,
                    duration: duration,
                    properties: properties
                });
                api.createPublication(deviceId, publication);
            });
            return p.then((publication) => {
                this._persistenceManager.add(publication);
                if (completion)
                    completion(publication);
                return publication;
            });
        });
    }
    deletePublication(deviceId, pubId, completion) {
        let p = new Promise((resolve, reject) => {
            let api = this.defaultClient;
            let callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while deleting publication '" +
                        pubId +
                        "' :" +
                        error);
                }
                else {
                    resolve();
                }
            };
            api.deletePublication(deviceId, pubId);
        });
        return p.then(() => {
            let d = this._persistenceManager.publications().find(d => d.id == pubId);
            if (d)
                this._persistenceManager.remove(d);
            if (completion)
                completion();
        });
    }
    /**
     * Create a subscription for a device
     * @param topic topic of the subscription
     * @param range range in meters
     * @param duration time in seconds
     * @param selector selector which is used for filtering publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    createSubscription(topic, range, duration, selector, deviceId, completion) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
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
                let subscription = new client_1.Subscription({
                    worldId: this.token.sub,
                    topic: topic,
                    deviceId: deviceId,
                    range: range,
                    duration: duration,
                    selector: selector || ""
                });
                api.createSubscription(deviceId, subscription);
            });
            return p.then((subscription) => {
                this._persistenceManager.add(subscription);
                if (completion)
                    completion(subscription);
                return subscription;
            });
        });
    }
    deleteSubscription(deviceId, subId, completion) {
        let p = new Promise((resolve, reject) => {
            let api = this.defaultClient;
            let callback = function (error, data, response) {
                if (error) {
                    reject("An error has occured while deleting Ssbscription '" +
                        subId +
                        "' :" +
                        error);
                }
                else {
                    resolve();
                }
            };
            api.deleteSubscription(deviceId, subId);
        });
        return p.then(() => {
            let d = this._persistenceManager.publications().find(d => d.id == subId);
            if (d)
                this._persistenceManager.remove(d);
            if (completion)
                completion();
        });
    }
    /**
     * Updates the device location
     * @param location
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    updateLocation(location, deviceId) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
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
                api.createLocation(deviceId, location);
            });
            return p.then(_ => {
            });
        });
    }
    /**
     * Returns all current matches
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllMatches(deviceId, completion) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while fetching matches: " + error);
                    }
                    else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.getMatches(deviceId);
            });
            return p.then((matches) => {
                if (completion)
                    completion(matches);
                return matches;
            });
        });
    }
    /**
     * Returns a specific match for device
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getMatch(matchId, string, deviceId, completion) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while fetching matches: " + error);
                    }
                    else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.getMatch(deviceId, matchId);
            });
            return p.then((matches) => {
                if (completion)
                    completion(matches);
                return matches;
            });
        });
    }
    /**
     * Gets publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllPublications(deviceId, completion) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while fetching publications: " + error);
                    }
                    else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.getPublications(deviceId);
            });
            return p;
        });
    }
    withDevice(deviceId) {
        if (!!deviceId) {
            return (p) => p(deviceId);
        }
        ;
        if (!!this.defaultDevice && !!this.defaultDevice.id) {
            return (p) => p(this.defaultDevice.id);
        }
        ;
        throw new Error("There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id");
    }
    /**
     * Gets subscriptions
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllSubscriptions(deviceId, completion) {
        return this.withDevice(deviceId)(deviceId => {
            let p = new Promise((resolve, reject) => {
                let api = this.defaultClient;
                let callback = function (error, data, response) {
                    if (error) {
                        reject("An error has occured while fetching subscriptions: " + error);
                    }
                    else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.getSubscriptions(deviceId);
            });
            return p;
        });
    }
    /**
     * Registers a callback for matches
     * @param completion
     */
    set onMatch(completion) {
        this._matchMonitor.onMatch = completion;
    }
    /**
     * Register a callback for location updates
     * @param completion
     */
    set onLocationUpdate(completion) {
        this._locationManager.onLocationUpdate = completion;
    }
    startMonitoringMatches(mode) {
        this._matchMonitor.startMonitoringMatches(mode);
    }
    stopMonitoringMatches() {
        this._matchMonitor.stopMonitoringMatches();
    }
    startUpdatingLocation() {
        this._locationManager.startUpdatingLocation();
    }
    stopUpdatingLocation() {
        this._locationManager.stopUpdatingLocation();
    }
}
exports.Manager = Manager;
