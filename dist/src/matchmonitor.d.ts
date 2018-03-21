import ScalpsCoreRestApi = require('matchmore_alps_core_rest_api');
import { Manager } from './manager';
export declare class MatchMonitor {
    manager: Manager;
    timerId: number;
    deliveredMatches: ScalpsCoreRestApi.Match[];
    onMatch: (match: ScalpsCoreRestApi.Match) => void;
    constructor(manager: Manager);
    private init(manager);
    startMonitoringMatches(): void;
    stopMonitoringMatches(): void;
    private checkMatches();
    private hasNotBeenDelivered(match);
}
