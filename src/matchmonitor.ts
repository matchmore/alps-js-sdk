import { Manager } from "./manager";
import * as models from "./client";
import WebSocket = require("universal-websocket-client");

export enum MatchMonitorMode {
  polling = 0,
  websocket = 1
}

export class MatchMonitor {
  private _timerId?: number;
  private _deliveredMatches: models.Match[] = [];

  private _onMatch: (match: models.Match) => void;

  constructor(public manager: Manager) {
    this._onMatch = (match: models.Match) => {};
  }

  set onMatch(onMatch: (match: models.Match) => void) {
    this._onMatch = onMatch;
  }

  get deliveredMatches(): models.Match[] {
    return this._deliveredMatches;
  }

  public startMonitoringMatches(mode?: MatchMonitorMode) {
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
      const socketUrl =
        this.manager.apiUrl
          .replace("https://", "wss://")
          .replace("http://", "ws://")
          .replace("v5", "") +
        "pusher/v5/ws/" +
        this.manager.defaultDevice.id;
      const ws = new WebSocket(socketUrl, ["api-key", this.manager.token.sub]);

      ws.onmessage = async msg => await this.checkMatch(msg.data);
    }
  }

  public stopMonitoringMatches() {
    if (this._timerId) {
      clearInterval(this._timerId);
    }
  }

  private async checkMatch(matchId: string) {
    if (matchId == "ping" || matchId == "pong") return;
    if (!this.manager.defaultDevice) return;
    if (this.hasNotBeenDelivered({ id: matchId })) {
      try {
        const match = await this.manager.getMatch(
          matchId,
          this.manager.defaultDevice.id
        );
        this._deliveredMatches.push(match);
        this._onMatch(match);
      } catch (error) {
        console.log(error);
      }
    }
  }

  private checkMatches() {
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

  private hasNotBeenDelivered(match: { id?: string }): boolean {
    for (const idx in this._deliveredMatches) {
      const deliveredMatch = this._deliveredMatches[idx];
      if (deliveredMatch.id == match.id) return false;
    }
    return true;
  }
}
