export interface StorageInterface {
  save: (key: string, value: string) => boolean;
  load: (key: string) => any;
  remove: (key: string) => boolean;
}

export class PlatformConfig {
  private static instance: PlatformConfig;
  storage: StorageInterface
  webSocket: object

  constructor () {
    this.storage = null;
    this.webSocket = null;
  }
  
  static getInstance() {
    if (!PlatformConfig.instance) {
      PlatformConfig.instance = new PlatformConfig();
    }
    return PlatformConfig.instance;
  }
}

const instance = PlatformConfig.getInstance()
export default instance