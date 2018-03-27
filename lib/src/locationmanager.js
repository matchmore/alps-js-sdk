"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocationManager = (function () {
    function LocationManager(manager, config) {
        this.manager = manager;
        this._gpsConfig = config || {
            enableHighAccuracy: false,
            timeout: 60000,
            maximumAge: 60000
        };
        this._onLocationUpdate = function (loc) { };
    }
    LocationManager.prototype.startUpdatingLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.onLocationReceived, this.onError, this._gpsConfig);
            this._geoId = navigator.geolocation.watchPosition(this.onLocationReceived, this.onError, this._gpsConfig);
        }
        else {
            throw new Error("Geolocation is not supported in this browser/app");
        }
    };
    LocationManager.prototype.stopUpdatingLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this._geoId);
        }
        else {
            throw new Error("Geolocation is not supported in this browser/app");
        }
    };
    Object.defineProperty(LocationManager.prototype, "onLocationUpdate", {
        set: function (onLocationUpdate) {
            this._onLocationUpdate = onLocationUpdate;
        },
        enumerable: true,
        configurable: true
    });
    LocationManager.prototype.onLocationReceived = function (loc) {
        loc.coords.horizontalAccuracy = 1.0;
        loc.coords.verticalAccuracy = 1.0;
        if (this._onLocationUpdate) {
            this._onLocationUpdate(loc);
        }
        this.manager.updateLocation(loc.coords);
    };
    LocationManager.prototype.onError = function (error) {
        throw new Error(error.message);
    };
    return LocationManager;
}());
exports.LocationManager = LocationManager;
//# sourceMappingURL=locationmanager.js.map