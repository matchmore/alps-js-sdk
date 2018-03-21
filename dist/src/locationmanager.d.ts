import ScalpsCoreRestApi = require('matchmore_alps_core_rest_api');
import { Manager } from './manager';
export declare class LocationManager {
    manager: Manager;
    private geoId;
    onLocationUpdate: (location: ScalpsCoreRestApi.Location) => void;
    constructor(manager: Manager);
    private init(manager);
    startUpdatingLocation(): void;
    stopUpdatingLocation(): void;
    private onLocationReceived(loc);
    private onError(error);
}
