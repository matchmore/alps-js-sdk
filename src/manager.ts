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

    createUser(userName: String) {
        var api = new ScalpsCoreRestApi.UsersApi();

        var callback = function(error, data, response) {
            if (error) {
                console.error(error);
            } else {
                console.log('API called successfully. Returned data: ' + data);
            }
        };
        api.createUser(userName, callback);
    }
}
