import { Manager } from "./manager";
import * as models from "./model/models";
export declare enum MatchMonitorMode {
    polling = 0,
    websocket = 1,
}
export declare class MatchMonitor {
    manager: Manager;
    private _timerId?;
    private _deliveredMatches;
    private _onMatch;
    constructor(manager: Manager);
    onMatch: (match: models.Match) => void;
    readonly deliveredMatches: models.Match[];
    startMonitoringMatches(mode: MatchMonitorMode): void;
    stopMonitoringMatches(): void;
    private checkMatch(matchId);
    private checkMatches();
    private hasNotBeenDelivered(match);
}
