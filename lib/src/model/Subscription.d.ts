export interface Subscription {
    id?: string;
    createdAt?: number;
    worldId: string;
    deviceId: string;
    topic: string;
    selector: string;
    range: number;
    duration: number;
    pushers?: Array<string>;
}
