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
const ScalpsCoreRestApi = require("./api");
const Base64 = require("Base64");
const matchmonitor_1 = require("./matchmonitor");
const locationmanager_1 = require("./locationmanager");
const models = require("./model/models");
const index_1 = require("./index");
class Manager {
    constructor(apiKey, apiUrlOverride, persistenceManager, gpsConfig) {
        this.apiKey = apiKey;
        this.apiUrlOverride = apiUrlOverride;
        if (!apiKey)
            throw new Error("Api key required");
        this._persistenceManager =
            persistenceManager || new index_1.InMemoryPersistenceManager();
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
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistenceManager.load();
        });
    }
    get apiUrl() {
        return this.defaultClient.basePath;
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
            deviceType: models.DeviceType.MobileDevice,
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
        return this.createAnyDevice({
            deviceType: models.DeviceType.PinDevice,
            name: name,
            location: location
        }, completion);
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
        return this.createAnyDevice({
            deviceType: models.DeviceType.IBeaconDevice,
            name: name,
            proximityUUID: proximityUUID,
            major: major,
            minor: minor,
            location: location
        }, completion);
    }
    /**
     * Create a device
     * @param device whole device object
     * @param completion optional callback
     */
    createAnyDevice(device, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _device = this.setDeviceType(device);
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.createDevice(_device);
                const result = JSON.parse(response.text);
                let ddevice = this._persistenceManager.defaultDevice();
                let isDefault = !ddevice;
                this._persistenceManager.addDevice(result, isDefault);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error(`An error has occured while creating device '${device.name}': ${error}`);
            }
        });
    }
    deleteDevice(deviceId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let api = new ScalpsCoreRestApi.DeviceApi();
                yield api.deleteDevice(deviceId);
                let d = this._persistenceManager.devices().find(d => d.id == deviceId);
                if (d)
                    this._persistenceManager.remove(d);
                if (completion)
                    completion();
                return;
            }
            catch (error) {
                throw new Error(`An error has occured while deleting device '${deviceId}': ${error}`);
            }
        });
    }
    setDeviceType(device) {
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                let publication = {
                    worldId: this.token.sub,
                    topic: topic,
                    deviceId: deviceWithId,
                    range: range,
                    duration: duration,
                    properties: properties
                };
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.createPublication(deviceWithId, publication);
                const result = JSON.parse(response.text);
                this._persistenceManager.add(result);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error(`An error has occured while creating publication '${topic}': ${error}`);
            }
        });
    }
    deletePublication(deviceId, pubId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.deletePublication(deviceId, pubId);
                const result = JSON.parse(response.text);
                let d = this._persistenceManager.publications().find(d => d.id == pubId);
                if (d)
                    this._persistenceManager.remove(d);
                if (completion)
                    completion();
                return result;
            }
            catch (error) {
                throw new Error(`An error has occured while deleting publication '${pubId}' : ${error}`);
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
    createSubscription(topic, range, duration, selector, deviceId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                let subscription = {
                    worldId: this.token.sub,
                    topic: topic,
                    deviceId: deviceWithId,
                    range: range,
                    duration: duration,
                    selector: selector || ""
                };
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.createSubscription(deviceWithId, subscription);
                const result = JSON.parse(response.text);
                this._persistenceManager.add(result);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error(`An error has occurred while creating subscription '${topic}': ${error}`);
            }
        });
    }
    deleteSubscription(deviceId, subId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.deleteSubscription(deviceId, subId);
                const result = JSON.parse(response.text);
                let d = this._persistenceManager.publications().find(d => d.id == subId);
                if (d)
                    this._persistenceManager.remove(d);
                if (completion)
                    completion();
                return result;
            }
            catch (error) {
                throw new Error(`An error has occurred while deleting Subscription '${subId}': ${error}`);
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
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.createLocation(deviceWithId, location);
                const result = JSON.parse(response.text);
                return result;
            }
            catch (error) {
                throw new Error(`An error has occurred while creating location ['${location.latitude}', '${location.longitude}'] ${error}`);
            }
        });
    }
    /**
     * Returns all current matches
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllMatches(deviceId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.getMatches(deviceWithId);
                const result = JSON.parse(response.text);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error(`An error has occurred while fetching matches: ${error}`);
            }
        });
    }
    /**
     * Returns a specific match for device
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getMatch(matchId, string, deviceId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.getMatch(deviceWithId, matchId);
                const result = JSON.parse(response.text);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error(`An error has occurred while fetching matches: ${error}`);
            }
        });
    }
    /**
     * Gets publications
     * @param deviceId optional, if not provided the default device will be used
     * @param completion optional callback
     */
    getAllPublications(deviceId, completion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.getPublications(deviceWithId);
                const result = JSON.parse(response.text);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error("An error has occurred while fetching publications: " + error);
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deviceWithId = this.deviceWithId(deviceId);
                let api = new ScalpsCoreRestApi.DeviceApi();
                const { response } = yield api.getSubscriptions(deviceWithId);
                const result = JSON.parse(response.text);
                if (completion)
                    completion(result);
                return result;
            }
            catch (error) {
                throw new Error("An error has occurred while fetching subscriptions: " + error);
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
