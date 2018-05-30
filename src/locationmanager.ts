import { Manager } from "./manager";
import * as models from "./model/models";

export interface GPSConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export class LocationManager {
  private _onLocationUpdate: (location: models.Location) => void;
  private _geoId;
  private _gpsConfig: GPSConfig;

  constructor(public manager: Manager, config?: GPSConfig) {
    this._gpsConfig = config || {
      enableHighAccuracy: false,
      timeout: 60000,
      maximumAge: 60000
    };
    this._onLocationUpdate = loc => {};
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

  set onLocationUpdate(onLocationUpdate: (location: models.Location) => void) {
    this._onLocationUpdate = onLocationUpdate;
  }

  private onLocationReceived = (loc) => {
    loc.coords.horizontalAccuracy = 1.0;
    loc.coords.verticalAccuracy = 1.0;

    if (this._onLocationUpdate) {
      this._onLocationUpdate(loc);
    }
    this.manager.updateLocation(loc.coords);
  }

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
