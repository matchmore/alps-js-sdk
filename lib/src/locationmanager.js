"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocationManager = (function () {
    function LocationManager(manager) {
        this.init(manager);
    }
    LocationManager.prototype.init = function (manager) {
        this.manager = manager;
    };
    LocationManager.prototype.startUpdatingLocation = function () {
        var _this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (loc) {
                _this.onLocationReceived(loc.coords);
            }, this.onError, {
                enableHighAccuracy: false,
                timeout: 60000,
                maximumAge: Infinity
            });
            this.geoId = navigator.geolocation.watchPosition(function (loc) {
                _this.onLocationReceived(loc.coords);
            }, this.onError);
        }
        else {
            throw new Error("Geolocation is not supported in this browser/app");
        }
    };
    LocationManager.prototype.stopUpdatingLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this.geoId);
        }
        else {
            throw new Error("Geolocation is not supported in this browser/app");
        }
    };
    LocationManager.prototype.onLocationReceived = function (loc) {
        if (!loc.coords)
            return;
        var latitude, longitude, altitude;
        if (loc.coords.latitude)
            latitude = parseFloat(loc.coords.latitude);
        else
            return;
        if (loc.coords.longitude)
            longitude = parseFloat(loc.coords.longitude);
        else
            return;
        if (loc.coords.altitude)
            altitude = parseFloat(loc.coords.altitude);
        else
            altitude = 0;
        this.onLocationUpdate(loc);
        this.manager.updateLocation({
            latitude: latitude,
            longitude: longitude,
            altitude: altitude,
            horizontalAccuracy: 1.0,
            verticalAccuracy: 1.0
        });
    };
    LocationManager.prototype.onError = function (error) {
        throw new Error(error.message);
    };
    return LocationManager;
}());
exports.LocationManager = LocationManager;
//# sourceMappingURL=locationmanager.js.map