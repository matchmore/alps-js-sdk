"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
class LocationManager {
    constructor(manager, config) {
        this.manager = manager;
        this._defaultConfig = {
            enableHighAccuracy: false,
            timeout: 60000,
            maximumAge: 60000
        };
        this.onLocationReceived = (loc) => __awaiter(this, void 0, void 0, function* () {
            const location = new client_1.Location({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                altitude: loc.coords.altitude || 0,
                horizontalAccuracy: loc.coords.accuracy,
                verticalAccuracy: loc.coords.accuracy
            });
            yield this.manager.updateLocation(location);
            if (this._onLocationUpdate) {
                this._onLocationUpdate(location);
            }
        });
        this._gpsConfig = config || this._defaultConfig;
        this._onLocationUpdate = _ => { };
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
