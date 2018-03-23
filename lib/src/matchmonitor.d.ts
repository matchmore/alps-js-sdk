import { Manager } from "./manager";
import * as models from "./model/models";
export declare enum MatchMonitorMode {
    polling = 0,
    websocket = 1,
}
export declare class MatchMonitor {
    manager: Manager;
    timerId: number;
    _deliveredMatches: models.Match[];
    readonly deliveredMatches: models.Match[];
    onMatch: (match: models.Match) => void;
    constructor(manager: Manager);
    private init(manager);
    startMonitoringMatches(mode: MatchMonitorMode): void;
    stopMonitoringMatches(): void;
    private checkMatch(matchId);
    private checkMatches();
    private hasNotBeenDelivered(match);
}
