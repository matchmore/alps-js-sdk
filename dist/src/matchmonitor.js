"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("universal-websocket-client");
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
            ws.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () { return yield this.checkMatch(msg.data); });
        }
    }
    stopMonitoringMatches() {
        if (this._timerId) {
            clearInterval(this._timerId);
        }
    }
    checkMatch(matchId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (matchId == "ping" || matchId == "pong")
                return;
            if (!this.manager.defaultDevice)
                return;
            if (this.hasNotBeenDelivered({ id: matchId })) {
                try {
                    const match = yield this.manager.getMatch(matchId, this.manager.defaultDevice.id);
                    this._deliveredMatches.push(match);
                    this._onMatch(match);
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
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
