"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlatformConfig {
    constructor() {
        this.storage = null;
        this.webSocket = null;
    }
    static getInstance() {
        if (!PlatformConfig.instance) {
            PlatformConfig.instance = new PlatformConfig();
        }
        return PlatformConfig.instance;
    }
}
exports.PlatformConfig = PlatformConfig;
const instance = PlatformConfig.getInstance();
exports.default = instance;
