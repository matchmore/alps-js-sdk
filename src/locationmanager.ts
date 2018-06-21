import { Manager } from "./manager";
import { Location } from "./client";

export interface GPSConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export class LocationManager {
  private _onLocationUpdate: (location: Location) => void;
  private _geoId;
  private _gpsConfig: GPSConfig;
  private _defaultConfig: GPSConfig = {
    enableHighAccuracy: false,
    timeout: 60000,
    maximumAge: 60000
  }
  
  constructor(public manager: Manager, config?: GPSConfig) {
    this._gpsConfig = config || this._defaultConfig;
    this._onLocationUpdate = _ => {};
  }

  public startUpdatingLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.onLocationReceived,
        this.onError,
        this._gpsConfig
      );
      this._geoId = navigator.geolocation.watchPosition(
        this.onLocationReceived,
        this.onError,
        this._gpsConfig
      );
    } else {
      throw new Error("Geolocation is not supported in this browser/app");
    }
  }

  public stopUpdatingLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(this._geoId);
    } else {
      throw new Error("Geolocation is not supported in this browser/app");
    }
  }

  set onLocationUpdate(onLocationUpdate: (location: Location) => void) {
    this._onLocationUpdate = onLocationUpdate;
  }

  private onLocationReceived = async (loc: Position) => {
    const location = new Location({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      altitude: loc.coords.altitude || 0,
      horizontalAccuracy: loc.coords.accuracy,
      verticalAccuracy: loc.coords.accuracy
    });

    await this.manager.updateLocation(location);
    if (this._onLocationUpdate) {
      this._onLocationUpdate(location);
    }
  };

  private onError(error) {
    throw new Error(error.message);
    // switch (error.code) {
    //   case error.PERMISSION_DENIED:
    //     throw new Error("User denied the request for Geolocation.");
    //   case error.POSITION_UNAVAILABLE:
    //     throw new Error("Location information is unavailable.");
    //   case error.TIMEOUT:
    //     throw new Error("The request to get user location timed out. " );
    //   case error.UNKNOWN_ERROR:
    //     throw new Error("An unknown error occurred.");
    // }
  }
}
