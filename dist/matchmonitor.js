"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import WebSocket = require("websocket");
var MatchMonitorMode;
(function (MatchMonitorMode) {
    MatchMonitorMode[MatchMonitorMode["polling"] = 0] = "polling";
    MatchMonitorMode[MatchMonitorMode["websocket"] = 1] = "websocket";
})(MatchMonitorMode = exports.MatchMonitorMode || (exports.MatchMonitorMode = {}));
class MatchMonitor {
    constructor(manager) {
        this.manager = manager;
        this._deliveredMatches = [];
        this._onMatch = (match) => { };
    }
    set onMatch(onMatch) {
        this._onMatch = onMatch;
    }
    get deliveredMatches() {
        return this._deliveredMatches;
    }
    startMonitoringMatches(mode) {
        if (!this.manager.defaultDevice)
            throw new Error("Default device not yet set!");
        if (mode === undefined || mode == MatchMonitorMode.polling) {
            this.stopMonitoringMatches();
            const timer = setInterval(() => {
                this.checkMatches();
            }, 1000);
            return;
        }
        if (mode == MatchMonitorMode.websocket) {
            const socketUrl = this.manager.apiUrl
                .replace("https://", "wss://")
                .replace("http://", "ws://")
                .replace("v5", "") +
                "pusher/v5/ws/" +
                this.manager.defaultDevice.id;
            const ws = new WebSocket(socketUrl, ["api-key", this.manager.token.sub]);
            ws.onopen = msg => console.log("opened");
            ws.onerror = msg => console.log(msg);
            ws.onmessage = msg => this.checkMatch(msg.data);
        }
    }
    stopMonitoringMatches() {
        if (this._timerId) {
            clearInterval(this._timerId);
        }
    }
    checkMatch(matchId) {
        if (!this.manager.defaultDevice)
            return;
        if (this.hasNotBeenDelivered({ id: matchId })) {
            this.manager
                .getMatch(matchId, this.manager.defaultDevice.id)
                .then(match => {
                this._deliveredMatches.push(match);
                this._onMatch(match);
            });
        }
    }
    checkMatches() {
        this.manager.getAllMatches().then(matches => {
            for (const idx in matches) {
                const match = matches[idx];
                if (this.hasNotBeenDelivered(match)) {
                    this._deliveredMatches.push(match);
                    this._onMatch(match);
                }
            }
        });
    }
    hasNotBeenDelivered(match) {
        for (const idx in this._deliveredMatches) {
            const deliveredMatch = this._deliveredMatches[idx];
            if (deliveredMatch.id == match.id)
                return false;
        }
        return true;
    }
}
exports.MatchMonitor = MatchMonitor;
