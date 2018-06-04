var PlatformConfig = (function () {
    function PlatformConfig() {
        this.storage = null;
        this.webSocket = null;
    }
    Object.defineProperty(PlatformConfig.prototype, "storage", {
        set: function (s) {
        },
        enumerable: true,
        configurable: true
    });
    return PlatformConfig;
})();
var instance = new PlatformConfig();
exports.default = instance;
