"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatchmoreEntityDiscriminator {
    static isDevice(x) {
        return (x.deviceToken !== undefined ||
            x.location !== undefined ||
            x.proximityUUID !== undefined);
    }
    static isSubscription(x) {
        return x.selector !== undefined;
    }
    static isPublication(x) {
        return x.properties !== undefined;
    }
}
exports.MatchmoreEntityDiscriminator = MatchmoreEntityDiscriminator;
