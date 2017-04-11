import ScalpsCoreRestApi = require('scalps_core_rest_api');
import { Manager } from './manager';

export class MatchMonitor {
    manager: Manager;
    timerId: Number;
    deliveredMatches: ScalpsCoreRestApi.Match[] = [];
    public onMatch: (match: ScalpsCoreRestApi.Match) => void;

    constructor(manager: Manager) {
        this.init(manager);
    }

    private init(manager) {
        this.manager = manager;
        this.onMatch = (match: ScalpsCoreRestApi.Match) => { };
    }

    public startMonitoringMatches() {
        this.stopMonitoringMatches();
        this.timerId = setInterval(() => { this.checkMatches(); }, 1000);
    }

    public stopMonitoringMatches() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }

    private checkMatches() {
        this.manager.getAllMatches().then((matches) => {
            for (let idx in matches) {
                let match = matches[idx];
                if (this.hasNotBeenDelivered(match)) {
                    this.deliveredMatches.push(match);
                    this.onMatch(match);
                }
            }
        });
    }

    private hasNotBeenDelivered(match: ScalpsCoreRestApi.Match): boolean {
        for (let idx in this.deliveredMatches) {
            let deliveredMatch = this.deliveredMatches[idx];
            if (deliveredMatch.matchId == match.matchId)
                return false;
        }
        return true;
    }
}

