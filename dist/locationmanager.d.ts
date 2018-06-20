import { Manager } from "./manager";
import { Location } from "./client";
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
    onLocationUpdate: (location: Location) => void;
    private onLocationReceived;
    private onError(error);
}
