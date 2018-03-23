export interface Publication {
    id?: string;
    createdAt?: number;
    worldId: string;
    deviceId: string;
    topic: string;
    range: number;
    duration: number;
    properties: any;
}
