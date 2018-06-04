import { GPSConfig } from "./locationmanager";
import { IPersistenceManager } from "./persistence";
export { PlatformConfig, MatchMonitorMode };
export interface Token {
    sub: string;
}
export declare class Manager {
    apiKey: string;
    apiUrlOverride: string;
    private defaultClient;
    private _matchMonitor;
    private _locationManager;
    private _persistenceManager;
    token: Token;
    constructor(apiKey: string, apiUrlOverride?: string, persistenceManager?: IPersistenceManager, gpsConfig?: GPSConfig);
    async: any;
}
