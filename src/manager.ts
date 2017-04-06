import ScalpsCoreRestApi = require('scalps_core_rest_api');
import { MatchMonitor } from './matchmonitor';
import { LocationManager } from './locationmanager';

export class Manager {
    defaultClient: ScalpsCoreRestApi.ApiClient;

    // Store all the objects created by the manager:
    public users: ScalpsCoreRestApi.User[] = [];
    public devices: ScalpsCoreRestApi.Device[] = [];
    public publications: ScalpsCoreRestApi.Publication[] = [];
    public subscriptions: ScalpsCoreRestApi.Subscription[] = [];
    public locations: ScalpsCoreRestApi.Location[] = [];
    public defaultUser: ScalpsCoreRestApi.User;
    public defaultDevice: ScalpsCoreRestApi.Device;

    private matchMonitor: MatchMonitor;
    private locationManager: LocationManager;

    constructor(public apiKey: string, apiUrlOverride?: string) {
        this.init(apiUrlOverride);
    }

    init(apiUrlOverride?: string) {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.defaultClient.authentications['api-key'].apiKey = this.apiKey;
        // Hack the api location (to use an overidden value if needed)
        if (apiUrlOverride) this.defaultClient.basePath = apiUrlOverride;
        this.matchMonitor = new MatchMonitor(this);
        this.locationManager = new LocationManager(this);
    }

    public createUser(userName: String, completion?: (user: ScalpsCoreRestApi.User) => void): Promise<ScalpsCoreRestApi.User> {
        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.UsersApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating user '" + userName + "' :" + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.createUser(userName, callback);
        });
        p.then((user) => {
            this.users.push(user);
            this.defaultUser = this.users[0];
            if (completion) completion(user);
        });
        return p;
    }

    public createDevice(deviceName: String, platform: String, deviceToken: String,
        latitude: Number, longitude: Number, altitude: Number,
        horizontalAccuracy: Number, verticalAccuracy: Number,
        completion?: (device: ScalpsCoreRestApi.Device) => void): Promise<ScalpsCoreRestApi.Device> {
        if (this.defaultUser) {
            return this.createAnyDevice(this.defaultUser.userId, deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion);
        } else {
            throw new Error("There is no default user available, please call createUser before createDevice");
        }
    }

    public createAnyDevice(userId: String, deviceName: String, platform: String, deviceToken: String,
        latitude: Number, longitude: Number, altitude: Number,
        horizontalAccuracy: Number, verticalAccuracy: Number,
        completion?: (device: ScalpsCoreRestApi.Device) => void): Promise<ScalpsCoreRestApi.Device> {

        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.DeviceApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating device '" + deviceName + "' :" + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            var opts = {
                'horizontalAccuracy': horizontalAccuracy,
                'verticalAccuracy': verticalAccuracy
            };
            api.createDevice(userId, deviceName, platform, deviceToken, latitude, longitude, altitude, opts, callback);
        });
        p.then((device) => {
            this.devices.push(device);
            this.defaultDevice = this.devices[0];
            if (completion) completion(device);
        });
        return p;
    }

    public createPublication(topic: String, range: Number, duration: Number, properties: Object, completion?: (publication: ScalpsCoreRestApi.Publication) => void): Promise<ScalpsCoreRestApi.Publication> {
        if (this.defaultUser && this.defaultDevice) {
            return this.createAnyPublication(this.defaultUser.userId, this.defaultDevice.deviceId, topic, range, duration, properties, completion);
        } else {
            throw new Error("There is no default user or device available, please call createUser and createDevice before createPublication");
        }
    }

    public createAnyPublication(userId: String, deviceId: String, topic: String, range: Number, duration: Number, properties: Object, completion?: (publication: ScalpsCoreRestApi.Publication) => void): Promise<ScalpsCoreRestApi.Publication> {

        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.PublicationApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating publication '" + topic + "' :" + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.createPublication(userId, deviceId, topic, range, duration, properties, callback);
        });
        p.then((publication) => {
            this.publications.push(publication);
            if (completion) completion(publication);
        });
        return p;
    }

    public createSubscription(topic: String, selector: String, range: Number, duration: Number, completion?: (subscription: ScalpsCoreRestApi.Subscription) => void): Promise<ScalpsCoreRestApi.Subscription> {
        if (this.defaultUser && this.defaultDevice) {
            return this.createAnySubscription(this.defaultUser.userId, this.defaultDevice.deviceId, topic, selector, range, duration, completion);
        } else {
            throw new Error("There is no default user or device available, please call createUser and createDevice before createSubscription");
        }
    }

    public createAnySubscription(userId: String, deviceId: String, topic: String, selector: String, range: Number, duration: Number, completion?: (subscription: ScalpsCoreRestApi.Subscription) => void): Promise<ScalpsCoreRestApi.Subscription> {

        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.SubscriptionApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating subscription '" + topic + "' :" + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.createSubscription(userId, deviceId, topic, selector, range, duration, callback);
        });
        p.then((subscription) => {
            this.subscriptions.push(subscription);
            if (completion) completion(subscription);
        });
        return p;
    }

    public updateLocation(latitude: Number, longitude: Number, altitude: Number, horizontalAccuracy: Number, verticalAccuracy: Number, completion?: (location: ScalpsCoreRestApi.DeviceLocation) => void): Promise<ScalpsCoreRestApi.DeviceLocation> {
        if (this.defaultUser && this.defaultDevice) {
            return this.updateAnyLocation(this.defaultUser.userId, this.defaultDevice.deviceId, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion);
        } else {
            throw new Error("There is no default user or device available, please call createUser and createDevice before updateLocation");
        }
    }

    public updateAnyLocation(userId: String, deviceId: String, latitude: Number, longitude: Number, altitude: Number, horizontalAccuracy: Number, verticalAccuracy: Number, completion?: (location: ScalpsCoreRestApi.DeviceLocation) => void): Promise<ScalpsCoreRestApi.DeviceLocation> {

        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.LocationApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating location ['" + latitude + "','" + longitude + "']  :" + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            var opts = {
                'horizontalAccuracy': horizontalAccuracy,
                'verticalAccuracy': verticalAccuracy
            };
            api.createLocation(userId, deviceId, latitude, longitude, altitude, opts, callback);
        });
        p.then((location) => {
            this.locations.push(location);
            if (completion) completion(location);
        });
        return p;
    }

    public getAllMatches(completion?: (matches: ScalpsCoreRestApi.Match[]) => void) {
        if (this.defaultUser && this.defaultDevice) {
            return this.getAllMatchesForAny(this.defaultUser.userId, this.defaultDevice.deviceId);
        } else {
            throw new Error("There is no default user or device available, please call createUser and createDevice before getAllMatches");
        }
    }

    public getAllMatchesForAny(userId: String, deviceId: String, completion?: (matches: ScalpsCoreRestApi.Match[]) => void) {
        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.DeviceApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while fetching matches: " + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.getMatches(userId, deviceId, callback);
        });
        p.then((matches: ScalpsCoreRestApi.Match[]) => {
            if (completion) completion(matches);
        });
        return p;
    }

    public getAllPublicationsForDevice(userId: String, deviceId: String, completion?: (publications: ScalpsCoreRestApi.Publication[]) => void) {
        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.DeviceApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while fetching publications: " + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.getPublications(userId, deviceId, callback);
        });
        return p;
    }

    public getAllSubscriptionsForDevice(userId: String, deviceId: String, completion?: (subscriptions: ScalpsCoreRestApi.Subscription[]) => void) {
        let p = new Promise((resolve, reject) => {
            let api = new ScalpsCoreRestApi.DeviceApi();
            let callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while fetching subscriptions: " + error)
                } else {
                    // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                    resolve(JSON.parse(response.text));
                }
            };
            api.getSubscriptions(userId, deviceId, callback);
        });
        return p;
    }

    public onMatch(completion: (match: ScalpsCoreRestApi) => void) {
        this.matchMonitor.onMatch = completion;
    }

    public startMonitoringMatches() {
        this.matchMonitor.startMonitoringMatches();
    }

    public stopMonitoringMatches() {
        this.matchMonitor.stopMonitoringMatches();
    }

    public startUpdatingLocation() {
        this.locationManager.startUpdatingLocation();
    }

    public stopUpdatingLocation() {
        this.locationManager.stopUpdatingLocation();
    }
}
