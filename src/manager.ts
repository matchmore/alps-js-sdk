import ScalpsCoreRestApi = require('scalps_core_rest_api');

export class Manager {
    defaultClient: ScalpsCoreRestApi.ApiClient;

    // Store all the objects created by the manager:
    public users: ScalpsCoreRestApi.User[];
    public defaultUser: ScalpsCoreRestApi.User;

    constructor(public apiKey: string) {
        this.init();
    }

    init() {
        this.defaultClient = ScalpsCoreRestApi.ApiClient.instance;
        this.defaultClient.authentications['api-key'].apiKey = this.apiKey;
        // Hack the api location (to use localhost)
        this.defaultClient.basePath = "http://localhost:9000";
        this.users = [];
        this.defaultUser = {};
    }

    createUser(userName: String, completion?: (user: ScalpsCoreRestApi.User) => void): Promise<ScalpsCoreRestApi.User> {
        let p = new Promise((resolve, reject) => {
            var api = new ScalpsCoreRestApi.UsersApi();
            var users = this.users;
            var callback = function(error, data, response) {
                if (error) {
                    reject("An error has occured while creating user '" + userName + "' :" + error)
                } else {
                    //users.push(data);
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
}
