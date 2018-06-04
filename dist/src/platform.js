var PlatformConfig = (function () {
    function PlatformConfig() {
        this.storage = null;
        this.webSocket = null;
    }
    return PlatformConfig;
})();
var instance = new PlatformConfig();
exports.default = instance;
