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
        this.api = new client_1.Client(basePath, options => {
            options.headers["api-key"] = this.apiKey;
            return Promise.resolve(options);
        }, {
            fetch
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
    createMobileDevice(name, platform, deviceToken) {
        return this.createAnyDevice(new client_1.MobileDevice({
            name: name,
            platform: platform,
            deviceToken: deviceToken,
            location: new client_1.Location({ latitude: 0, longitude: 0, altitude: 0 })
        }));
    }
    /**
     * Create a pin device
     * @param name
     * @param location
     * @param completion optional callback
     */
    createPinDevice(name, location) {
        return this.createAnyDevice(new client_1.PinDevice({
            name: name,
            location: location
        }));
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
    createIBeaconDevice(name, proximityUUID, major, minor, location) {
        return this.createAnyDevice(new client_1.IBeaconDevice({
            name: name,
            proximityUUID: proximityUUID,
            major: major,
            minor: minor
        }));
    }
    /**
     * Create a device
     * @param device whole device object
     * @param completion optional callback
     */
    createAnyDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.api.createDevice(device);
                const ddevice = this._persistenceManager.defaultDevice();
                const isDefault = !ddevice;
                this._persistenceManager.addDevice(result, isDefault);
                return result;
            }
            catch (error) {
                this.handleError(error, `create device '${device.name}'`);
            }
        });
    }
    handleError(error, operation) {
        if (error instanceof client_1.SwaggerException) {
            throw new Error(`An error has occurred during '${operation}': ${error} ${error.status}, ${error.response}`);
        }
        throw error;
    }
    deleteDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.api.deleteDevice(deviceId);
                const d = this._persistenceManager.devices().find(d => d.id == deviceId);
                if (d)
                    this._persistenceManager.remove(d);
                return;
            }
            catch (error) {
                this.handleError(error, `delete device '${deviceId}'`);
            }
        });
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
    createPublication(topic, range, duration, properties, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                const publication = new client_1.Publication({
                    worldId: this.token.sub,
                    topic: topic,
                    deviceId: deviceWithId,
                    range: range,
                    duration: duration,
                    properties: properties
                });
                const result = yield this.api.createPublication(deviceWithId, publication);
                this._persistenceManager.add(result);
                return result;
            }
            catch (error) {
                this.handleError(error, `create publication for topic ${topic}`);
            }
        });
    }
    deletePublication(deviceId, pubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.api.deletePublication(deviceId, pubId);
                const d = this._persistenceManager.publications().find(d => d.id == pubId);
                if (d)
                    this._persistenceManager.remove(d);
            }
            catch (error) {
                this.handleError(error, `delete publication for device ${deviceId}, publication ${pubId}`);
            }
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
    createSubscription(topic, range, duration, selector, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                const subscription = new client_1.Subscription({
                    worldId: this.token.sub,
                    topic: topic,
                    deviceId: deviceWithId,
                    range: range,
                    duration: duration,
                    selector: selector || ""
                });
                const result = yield this.api.createSubscription(deviceWithId, subscription);
                this._persistenceManager.add(result);
                return result;
            }
            catch (error) {
                this.handleError(error, `create subscription for topic ${topic}`);
            }
        });
    }
    deleteSubscription(deviceId, subId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.api.deleteSubscription(deviceId, subId);
                const d = this._persistenceManager.publications().find(d => d.id == subId);
                if (d)
                    this._persistenceManager.remove(d);
                return result;
            }
            catch (error) {
                this.handleError(error, `delete subscription for device ${deviceId}, subscription ${subId}`);
            }
        });
    }
    /**
     * Updates the device location
     * @param location
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    updateLocation(location, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                yield this.api.createLocation(deviceWithId, location);
            }
            catch (error) {
                this.handleError(error, `creating location ['${location.latitude}'`);
            }
        });
    }
    /**
     * Returns all current matches
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllMatches(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                const result = yield this.api.getMatches(deviceWithId);
                return result;
            }
            catch (error) {
                this.handleError(error, `fetch matches`);
            }
        });
    }
    /**
     * Returns a specific match for device
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getMatch(matchId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                const result = yield this.api.getMatch(deviceWithId, matchId);
                return result;
            }
            catch (error) {
                this.handleError(error, `fetch match ${matchId}`);
            }
        });
    }
    /**
     * Gets publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllPublications(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                const result = yield this.api.getPublications(deviceWithId);
                return result;
            }
            catch (error) {
                this.handleError(error, `fetch publications`);
            }
        });
    }
    deviceWithId(deviceId) {
        if (!!deviceId) {
            return deviceId;
        }
        if (!!this.defaultDevice && !!this.defaultDevice.id) {
            return this.defaultDevice.id;
        }
        throw new Error("There is no default device available and no other device id was supplied,  please call createDevice before thi call or provide a device id");
    }
    /**
     * Gets subscriptions
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllSubscriptions(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                const result = yield this.api.getSubscriptions(deviceWithId);
                return result;
            }
            catch (error) {
                this.handleError(error, `fetch subscriptions`);
            }
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
