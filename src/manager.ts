import ScalpsCoreRestApi = require('scalps_core_rest_api');

export class Manager {
    defaultClient: ScalpsCoreRestApi.ApiClient;

    // Store all the objects created by the manager:
    public users: ScalpsCoreRestApi.User[];
    public devices: ScalpsCoreRestApi.Device[];
    public defaultUser: ScalpsCoreRestApi.User;
    public defaultDevice: ScalpsCoreRestApi.Device;

    constructor(public apiKey: string) {
        this.init();
    }

    init() {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.defaultClient.authentications['api-key'].apiKey = this.apiKey;
        // Hack the api location (to use localhost)
        this.defaultClient.basePath = "http://localhost:9000";
        this.users = [];
        this.devices = [];
        this.defaultUser = {};
        this.defaultDevice = {};
    }

    public createUser(userName: String, completion?: (user: ScalpsCoreRestApi.User) => void): Promise<ScalpsCoreRestApi.User> {
        let p = new Promise((resolve, reject) => {
            var api = new ScalpsCoreRestApi.UsersApi();
            var callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating user '" + userName + "' :" + error)
                } else {
                    resolve(data);
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
        completion?: (user: ScalpsCoreRestApi.Device) => void): Promise<ScalpsCoreRestApi.Device> {

        let p = new Promise((resolve, reject) => {
            var api = new ScalpsCoreRestApi.DeviceApi();
            var callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating device '" + deviceName + "' :" + error)
                } else {
                    resolve(data);
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
    }
}
