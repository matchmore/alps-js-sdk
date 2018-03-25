import { Manager } from "./manager";
import * as models from "./model/models";
export declare class LocationManager {
    manager: Manager;
    private _onLocationUpdate;
    private geoId;
    constructor(manager: Manager);
    startUpdatingLocation(): void;
    stopUpdatingLocation(): void;
    onLocationUpdate: (location: models.Location) => void;
    private onLocationReceived(loc);
    private onError(error);
}
