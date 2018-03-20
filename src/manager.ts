import ScalpsCoreRestApi = require('matchmore_alps_core_rest_api');
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

    public createDevice(deviceName: String, platform: String, deviceToken: String,
        latitude: number, longitude: number, altitude: number,
        horizontalAccuracy: number, verticalAccuracy: number,
        completion?: (device: ScalpsCoreRestApi.Device) => void): Promise<ScalpsCoreRestApi.Device> {
        return this.createAnyDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion);
    }

    public createAnyDevice(deviceName: String, platform: String, deviceToken: String,
        latitude: number, longitude: number, altitude: number,
        horizontalAccuracy: number, verticalAccuracy: number,
        completion?: (device: ScalpsCoreRestApi.Device) => void): Promise<ScalpsCoreRestApi.Device> {
        
        console.log(completion);

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
            api.createDevice(deviceName, platform, deviceToken, latitude, longitude, altitude, opts, callback);
        });
        p.then((device) => {
            this.devices.push(device);
            this.defaultDevice = this.devices[0];
            if (completion) completion(device);
        });
        return p;
    }

    public createPublication(topic: String, range: number, duration: number, properties: Object, completion?: (publication: ScalpsCoreRestApi.Publication) => void): Promise<ScalpsCoreRestApi.Publication> {
        if (this.defaultDevice) {
            return this.createAnyPublication(this.defaultDevice.deviceId, topic, range, duration, properties, completion);
        } else {
            throw new Error("There is no default device available, please call createDevice before createPublication");
        }
    }

    public createAnyPublication( deviceId: String, topic: String, range: number, duration: number, properties: Object, completion?: (publication: ScalpsCoreRestApi.Publication) => void): Promise<ScalpsCoreRestApi.Publication> {

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
            api.createPublication( deviceId, topic, range, duration, properties, callback);
        });
        p.then((publication) => {
            this.publications.push(publication);
            if (completion) completion(publication);
        });
        return p;
    }

    public createSubscription(topic: String, selector: String, range: number, duration: number, completion?: (subscription: ScalpsCoreRestApi.Subscription) => void): Promise<ScalpsCoreRestApi.Subscription> {
        if (this.defaultDevice) {
            return this.createAnySubscription(this.defaultDevice.deviceId, topic, selector, range, duration, completion);
        } else {
            throw new Error("There is no default device available, please call createDevice before createSubscription");
        }
    }

    public createAnySubscription(deviceId: String, topic: String, selector: String, range: number, duration: number, completion?: (subscription: ScalpsCoreRestApi.Subscription) => void): Promise<ScalpsCoreRestApi.Subscription> {

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
            api.createSubscription(deviceId, topic, selector, range, duration, callback);
        });
        p.then((subscription) => {
            this.subscriptions.push(subscription);
            if (completion) completion(subscription);
        });
        return p;
    }

    public updateLocation(latitude: number, longitude: number, altitude: number, horizontalAccuracy: number, verticalAccuracy: number, completion?: (location: ScalpsCoreRestApi.DeviceLocation) => void): Promise<ScalpsCoreRestApi.DeviceLocation> {
        if (this.defaultDevice) {
            return this.updateAnyLocation(this.defaultDevice.deviceId, latitude, longitude, altitude, horizontalAccuracy, verticalAccuracy, completion);
        } else {
            throw new Error("There is no default device available, please call createDevice before updateLocation");
        }
    }

    public updateAnyLocation( deviceId: String, latitude: number, longitude: number, altitude: number, horizontalAccuracy: number, verticalAccuracy: number, completion?: (location: ScalpsCoreRestApi.DeviceLocation) => void): Promise<ScalpsCoreRestApi.DeviceLocation> {

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
            api.createLocation( deviceId, latitude, longitude, altitude, opts, callback);
        });
        p.then((location) => {
            this.locations.push(location);
            if (completion) completion(location);
        });
        return p;
    }

    public getAllMatches(completion?: (matches: ScalpsCoreRestApi.Match[]) => void) {
        if (this.defaultDevice) {
            return this.getAllMatchesForAny(this.defaultDevice.deviceId);
        } else {
            throw new Error("There is no default device available, please call createDevice before getAllMatches");
        }
    }

    public getAllMatchesForAny(deviceId: String, completion?: (matches: ScalpsCoreRestApi.Match[]) => void) {
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
            api.getMatches(deviceId, callback);
        });
        p.then((matches: ScalpsCoreRestApi.Match[]) => {
            if (completion) completion(matches);
        });
        return p;
    }

    public getAllPublicationsForDevice( deviceId: String, completion?: (publications: ScalpsCoreRestApi.Publication[]) => void) {
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
            api.getPublications( deviceId, callback);
        });
        return p;
    }

    public getAllSubscriptionsForDevice( deviceId: String, completion?: (subscriptions: ScalpsCoreRestApi.Subscription[]) => void) {
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
            api.getSubscriptions( deviceId, callback);
        });
        return p;
    }

    public onMatch(completion: (match: ScalpsCoreRestApi.Match) => void) {
        this.matchMonitor.onMatch = completion;
    }

    public onLocationUpdate(completion: (location: ScalpsCoreRestApi.Location) => void) {
        this.locationManager.onLocationUpdate = completion;
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
