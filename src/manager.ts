import ScalpsCoreRestApi = require('scalps_core_rest_api');

export class Manager {
    defaultClient: ScalpsCoreRestApi.ApiClient;

    constructor(public apiKey: string) {
        this.init();
    }

    init() {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.defaultClient.authentications['api-key'].apiKey = this.apiKey;
        // Hack the api location (to use localhost)
        this.defaultClient.basePath = "http://localhost:9000";
    }

    createUser(userName: String, completion?: (user: ScalpsCoreRestApi.User) => void): Promise<ScalpsCoreRestApi.User> {
        let p = new Promise((resolve, reject) => {
            var api = new ScalpsCoreRestApi.UsersApi();
            var callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating user '" + userName + "' :" + error)
                } else {
                    if (completion) completion(data);
                    resolve(data);
                }
            };
            api.createUser(userName, callback);
        });
        return p;
    }
}
