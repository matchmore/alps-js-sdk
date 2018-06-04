var PlatformConfig = (function () {
    function PlatformConfig() {
        this.storage = null;
        this.webSocket = null;
    }
    Object.defineProperty(PlatformConfig.prototype, "storage", {
        set: function (s) {
            this.storage = s;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlatformConfig.prototype, "webSocket", {
        set: function (s) {
            this.webSocket = s;
        },
        enumerable: true,
        configurable: true
    });
    return PlatformConfig;
})();
var instance = new PlatformConfig();
exports.default = instance;
