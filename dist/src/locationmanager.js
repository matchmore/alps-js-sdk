var LocationManager = (function () {
    function LocationManager(manager, config) {
        var _this = this;
        this.manager = manager;
        this.onLocationReceived = function (loc) {
            loc.coords.horizontalAccuracy = 1.0;
            loc.coords.verticalAccuracy = 1.0;
            if (_this._onLocationUpdate) {
                _this._onLocationUpdate(loc);
            }
            var _a = loc.coords, latitude = _a.latitude, longitude = _a.longitude, altitude = _a.altitude;
            var coords = {
                latitude: latitude,
                longitude: longitude,
                altitude: altitude || 0,
            };
            _this.manager.updateLocation(coords);
        };
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
    LocationManager.prototype.onError = function (error) {
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
    };
    return LocationManager;
})();
exports.LocationManager = LocationManager;
