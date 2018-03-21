"use strict";
var MatchMonitor = (function () {
    function MatchMonitor(manager) {
        this.deliveredMatches = [];
        this.init(manager);
    }
    MatchMonitor.prototype.init = function (manager) {
        this.manager = manager;
        this.onMatch = function (match) { };
    };
    MatchMonitor.prototype.startMonitoringMatches = function () {
        var _this = this;
        this.stopMonitoringMatches();
        var timer = setInterval(function () { _this.checkMatches(); }, 1000);
    };
    MatchMonitor.prototype.stopMonitoringMatches = function () {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    };
    MatchMonitor.prototype.checkMatches = function () {
        var _this = this;
        this.manager.getAllMatches().then(function (matches) {
            for (var idx in matches) {
                var match = matches[idx];
                if (_this.hasNotBeenDelivered(match)) {
                    _this.deliveredMatches.push(match);
                    _this.onMatch(match);
                }
            }
        });
    };
    MatchMonitor.prototype.hasNotBeenDelivered = function (match) {
        for (var idx in this.deliveredMatches) {
            var deliveredMatch = this.deliveredMatches[idx];
            if (deliveredMatch.matchId == match.matchId)
                return false;
        }
        return true;
    };
    return MatchMonitor;
}());
exports.MatchMonitor = MatchMonitor;
