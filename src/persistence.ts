import * as models from "./model/models";

export type MatchmoreEntity = models.Device | models.Publication | models.Subscription;
export interface IPersistenceManager {
  defaultDevice(): models.Device | undefined;
  devices(): models.Device[];
  publications(): models.Publication[];
  subscriptions(): models.Subscription[];
  onLoad(onLoad: (state: IPersistenceManager) => void)
  load(): Promise<Boolean>,
  save(): Promise<Boolean>,

  addDevice(device: models.Device, isDefault?: boolean);
  add(entity: MatchmoreEntity);
  remove(entity: MatchmoreEntity);
}

export class MatchmoreEntityDiscriminator {
  public static isDevice(x: any): x is models.Device {
    return (
      (<models.MobileDevice>x).deviceToken !== undefined ||
      (<models.PinDevice>x).location !== undefined ||
      (<models.IBeaconDevice>x).proximityUUID !== undefined
    );
  }

  public static isSubscription(x: any): x is models.Subscription {
    return (<models.Subscription>x).selector !== undefined;
  }

  public static isPublication(x: any): x is models.Publication {
    return (<models.Publication>x).properties !== undefined;
  }
}