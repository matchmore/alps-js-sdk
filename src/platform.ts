export interface StorageInterface {
  save: (key: string, value: string) => boolean;
  load: (key: string) => any;
  remove: (key: string) => boolean;
}

class PlatformConfig {
  storage: StorageInterface
  webSocket: object

  constructor () {
    this.storage = null;
    this.webSocket = null;
  }
}

const instance = new PlatformConfig()
export default instance