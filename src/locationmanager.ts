import ScalpsCoreRestApi = require('scalps_core_rest_api');
import { Manager } from './manager';

export class MatchMonitor {
    manager: Manager;

    constructor(manager: Manager) {
        this.init(manager);
    }

    private init(manager) {
        this.manager = manager;
    }

    public startUpdatingLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(this.onLocationReceived, this.onError);
        } else {
            throw new Error("Geolocation is not supported in this browser/app")
        }
    }

    public stopUpdatingLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.clearPosition();
        } else {
            throw new Error("Geolocation is not supported in this browser/app")
        }
    }

    private onLocationReceived(loc) {
        console.log(JSON.stringify(loc));
    }

    private onError(err) { }

}

