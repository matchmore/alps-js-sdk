"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LocationManager {
    constructor(manager, config) {
        this.manager = manager;
        this.onLocationReceived = (loc) => {
            loc.coords.horizontalAccuracy = 1.0;
            loc.coords.verticalAccuracy = 1.0;
            if (this._onLocationUpdate) {
                this._onLocationUpdate(loc);
            }
            const { latitude, longitude, altitude } = loc.coords;
            const coords = {
                latitude,
                longitude,
                altitude: altitude || 0,
            };
            this.manager.updateLocation(coords);
        };
        this._gpsConfig = config || {
            enableHighAccuracy: false,
            timeout: 60000,
            maximumAge: 60000
        };
        this._onLocationUpdate = loc => { };
    }
    startUpdatingLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.onLocationReceived, this.onError, this._gpsConfig);
            this._geoId = navigator.geolocation.watchPosition(this.onLocationReceived, this.onError, this._gpsConfig);
        }
        else {
            throw new Error("Geolocation is not supported in this browser/app");
        }
    }
    stopUpdatingLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this._geoId);
        }
        else {
            throw new Error("Geolocation is not supported in this browser/app");
        }
    }
    set onLocationUpdate(onLocationUpdate) {
        this._onLocationUpdate = onLocationUpdate;
    }
    onError(error) {
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
exports.LocationManager = LocationManager;
