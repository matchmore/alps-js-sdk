var InMemoryPersistenceManager_1 = require('./persistences/InMemoryPersistenceManager');
exports.InMemoryPersistenceManager = InMemoryPersistenceManager_1.default;
var MatchmoreEntityDiscriminator = (function () {
    function MatchmoreEntityDiscriminator() {
    }
    MatchmoreEntityDiscriminator.isDevice = function (x) {
        return (x.deviceToken !== undefined ||
            x.location !== undefined ||
            x.proximityUUID !== undefined);
    };
    MatchmoreEntityDiscriminator.isSubscription = function (x) {
        return x.selector !== undefined;
    };
    MatchmoreEntityDiscriminator.isPublication = function (x) {
        return x.properties !== undefined;
    };
    return MatchmoreEntityDiscriminator;
})();
exports.MatchmoreEntityDiscriminator = MatchmoreEntityDiscriminator;
