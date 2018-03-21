"use strict";
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
            this.geoId = navigator.geolocation.watchPosition(function (loc) { _this.onLocationReceived(loc); }, this.onError);
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
            return; // Guard for bad values
        var latitude, longitude, altitude;
        if (loc.coords.latitude)
            latitude = parseFloat(loc.coords.latitude);
        else
            return;
        //throw new Error("Location did not contain any latitude: " + JSON.stringify(loc));
        if (loc.coords.longitude)
            longitude = parseFloat(loc.coords.longitude);
        else
            return;
        //throw new Error("Location did not contain any longitude: " + JSON.stringify(loc));
        if (loc.coords.altitude)
            altitude = parseFloat(loc.coords.altitude);
        else
            altitude = 0; // Default value, TODO: use an altitude API?
        this.onLocationUpdate(loc);
        this.manager.updateLocation(latitude, longitude, altitude, 1.0, 1.0);
    };
    LocationManager.prototype.onError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                throw new Error("User denied the request for Geolocation.");
            case error.POSITION_UNAVAILABLE:
                throw new Error("Location information is unavailable.");
            case error.TIMEOUT:
                throw new Error("The request to get user location timed out.");
            case error.UNKNOWN_ERROR:
                throw new Error("An unknown error occurred.");
        }
    };
    return LocationManager;
}());
exports.LocationManager = LocationManager;
