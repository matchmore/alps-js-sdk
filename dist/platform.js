"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlatformConfig {
    constructor() {
        this.storage = null;
        this.webSocket = null;
    }
}
const instance = new PlatformConfig();
exports.default = instance;
