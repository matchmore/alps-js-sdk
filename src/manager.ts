import ScalpsCoreRestApi = require('scalps_core_rest_api');

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

    constructor(public apiKey: string, apiUrlOverride?: string) {
        this.init(apiUrlOverride);
    }

    init(apiUrlOverride?: string) {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.defaultClient.authentications['api-key'].apiKey = this.apiKey;
        // Hack the api location (to use localhost)
        if (apiUrlOverride) this.defaultClient.basePath = apiUrlOverride;
    }

    public createUser(userName: String, completion?: (user: ScalpsCoreRestApi.User) => void): Promise<ScalpsCoreRestApi.User> {
        let p = new Promise((resolve, reject) => {
            var api = new ScalpsCoreRestApi.UsersApi();
            var callback = function(error, data, response) {
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
            let p = new Promise((resolve, reject) => {
                var api = new ScalpsCoreRestApi.DeviceApi();
                var callback = function(error, data, response) {
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
                api.createDevice(this.defaultUser.userId, deviceName, platform, deviceToken, latitude, longitude, altitude, opts, callback);
            });
            p.then((device) => {
                this.devices.push(device);
                this.defaultDevice = this.devices[0];
                if (completion) completion(device);
            });
            return p;
        } else {
            throw Error("There is no default user available, please call createUser before createDevice");
        }
    }

    public createPublication(topic: String, range: Number, duration: Number, properties: Object, completion?: (publication: ScalpsCoreRestApi.Publication) => void): Promise<ScalpsCoreRestApi.Publication> {

        if (this.defaultUser && this.defaultDevice) {
            let p = new Promise((resolve, reject) => {
                var api = new ScalpsCoreRestApi.PublicationApi();
                var callback = function(error, data, response) {
                    if (error) {
                        reject("An error has occured while creating publication '" + topic + "' :" + error)
                    } else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.createPublication(this.defaultUser.userId, this.defaultDevice.deviceId, topic, range, duration, properties, callback);
            });
            p.then((publication) => {
                this.publications.push(publication);
                if (completion) completion(publication);
            });
            return p;
        } else {
            throw Error("There is no default user or device available, please call createUser and createDevice before createPublication");
        }
    }

    public createSubscription(topic: String, selector: String, range: Number, duration: Number, completion?: (subscription: ScalpsCoreRestApi.Subscription) => void): Promise<ScalpsCoreRestApi.Subscription> {

        if (this.defaultUser && this.defaultDevice) {
            let p = new Promise((resolve, reject) => {
                var api = new ScalpsCoreRestApi.SubscriptionApi();
                var callback = function(error, data, response) {
                    if (error) {
                        reject("An error has occured while creating subscription '" + topic + "' :" + error)
                    } else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.createSubscription(this.defaultUser.userId, this.defaultDevice.deviceId, topic, selector, range, duration, callback);
            });
            p.then((subscription) => {
                this.subscriptions.push(subscription);
                if (completion) completion(subscription);
            });
            return p;
        } else {
            throw Error("There is no default user or device available, please call createUser and createDevice before createSubscription");
        }
    }

    public updateLocation(latitude: Number, longitude: Number, altitude: Number, horizontalAccuracy: Number, verticalAccuracy: Number, completion?: (location: ScalpsCoreRestApi.DeviceLocation) => void): Promise<ScalpsCoreRestApi.DeviceLocation> {

        if (this.defaultUser && this.defaultDevice) {
            let p = new Promise((resolve, reject) => {
                var api = new ScalpsCoreRestApi.LocationApi();
                var callback = function(error, data, response) {
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
                api.createLocation(this.defaultUser.userId, this.defaultDevice.deviceId, latitude, longitude, altitude, opts, callback);
            });
            p.then((location) => {
                this.locations.push(location);
                if (completion) completion(location);
            });
            return p;
        } else {
            throw Error("There is no default user or device available, please call createUser and createDevice before updateLocation");
        }
    }

    public getAllMatches(completion?: (matches: ScalpsCoreRestApi.Match[]) => void) {
        if (this.defaultUser && this.defaultDevice) {
            let p = new Promise((resolve, reject) => {
                var api = new ScalpsCoreRestApi.DeviceApi();
                var callback = function(error, data, response) {
                    if (error) {
                        reject("An error has occured while fetching matches: " + error)
                    } else {
                        // Ensure that the json response is sent as pure as possible, sometimes data != response.text. Swagger issue?
                        resolve(JSON.parse(response.text));
                    }
                };
                api.getMatches(this.defaultUser.userId, this.defaultDevice.deviceId, callback);
            });
            p.then((location) => {
				/*
                this.locations.push(location);
                if (completion) completion(location);*/
            });
            return p;
        } else {
            throw Error("There is no default user or device available, please call createUser and createDevice before getAllMatches");
        }
    }

    public getAllPublicationsForDevice(userId: String, deviceId: String, completion?: (publications: ScalpsCoreRestApi.Publication[]) => void) {
        let p = new Promise((resolve, reject) => {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function(error, data, response) {
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
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function(error, data, response) {
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
}
