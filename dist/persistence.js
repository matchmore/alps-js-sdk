"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InMemoryPersistenceManager_1 = require("./persistences/InMemoryPersistenceManager");
exports.InMemoryPersistenceManager = InMemoryPersistenceManager_1.default;
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
