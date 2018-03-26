import { Manager } from "./manager";
import * as models from "./model/models";
export interface GPSConfig {
    enableHighAccuracy: boolean;
    timeout: number;
    maximumAge: number;
}
export declare class LocationManager {
    manager: Manager;
    private _onLocationUpdate;
    private _geoId;
    private _gpsConfig;
    constructor(manager: Manager, config?: GPSConfig);
    startUpdatingLocation(): void;
    stopUpdatingLocation(): void;
    onLocationUpdate: (location: models.Location) => void;
    private onLocationReceived(loc);
    private onError(error);
}
