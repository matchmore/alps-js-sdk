"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("websocket");
var MatchMonitorMode;
(function (MatchMonitorMode) {
    MatchMonitorMode[MatchMonitorMode["polling"] = 0] = "polling";
    MatchMonitorMode[MatchMonitorMode["websocket"] = 1] = "websocket";
})(MatchMonitorMode = exports.MatchMonitorMode || (exports.MatchMonitorMode = {}));
var MatchMonitor = (function () {
    function MatchMonitor(manager) {
        this.manager = manager;
        this._deliveredMatches = [];
        this._onMatch = function (match) { };
    }
    Object.defineProperty(MatchMonitor.prototype, "onMatch", {
        set: function (onMatch) {
            this._onMatch = onMatch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatchMonitor.prototype, "deliveredMatches", {
        get: function () {
            return this._deliveredMatches;
        },
        enumerable: true,
        configurable: true
    });
    MatchMonitor.prototype.startMonitoringMatches = function (mode) {
        var _this = this;
        if (!this.manager.defaultDevice)
            throw new Error("Default device not yet set!");
        if (mode == MatchMonitorMode.polling) {
            this.stopMonitoringMatches();
            var timer = setInterval(function () {
                _this.checkMatches();
            }, 1000);
            return;
        }
        if (mode == MatchMonitorMode.websocket) {
            var socketUrl = this.manager.apiUrl
                .replace("https://", "wss://")
                .replace("http://", "ws://")
                .replace("v5", "") +
                "pusher/v5/ws/" +
                this.manager.defaultDevice.id;
            var ws = new WebSocket(socketUrl, ["api-key", this.manager.token.sub]);
            ws.onopen = function (msg) { return console.log("opened"); };
            ws.onerror = function (msg) { return console.log(msg); };
            ws.onmessage = function (msg) { return _this.checkMatch(msg.data); };
        }
    };
    MatchMonitor.prototype.stopMonitoringMatches = function () {
        if (this._timerId) {
            clearInterval(this._timerId);
        }
    };
    MatchMonitor.prototype.checkMatch = function (matchId) {
        var _this = this;
        if (!this.manager.defaultDevice)
            return;
        if (this.hasNotBeenDelivered({ id: matchId })) {
            this.manager
                .getMatch(matchId, this.manager.defaultDevice.id)
                .then(function (match) {
                _this._deliveredMatches.push(match);
                _this.onMatch(match);
            });
        }
    };
    MatchMonitor.prototype.checkMatches = function () {
        var _this = this;
        this.manager.getAllMatches().then(function (matches) {
            for (var idx in matches) {
                var match = matches[idx];
                if (_this.hasNotBeenDelivered(match)) {
                    _this._deliveredMatches.push(match);
                    _this.onMatch(match);
                }
            }
        });
    };
    MatchMonitor.prototype.hasNotBeenDelivered = function (match) {
        for (var idx in this._deliveredMatches) {
            var deliveredMatch = this._deliveredMatches[idx];
            if (deliveredMatch.id == match.id)
                return false;
        }
        return true;
    };
    return MatchMonitor;
}());
exports.MatchMonitor = MatchMonitor;
//# sourceMappingURL=matchmonitor.js.map