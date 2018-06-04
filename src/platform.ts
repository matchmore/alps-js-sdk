class PlatformConfig {
  storage: object
  webSocket: object

  constructor () {
    this.storage = null;
    this.webSocket = null;
  }

  set storage(s: object) {
    this.storage = s;
  }

  set webSocket(s: object) {
    this.webSocket = s;
  }
}

const instance = new PlatformConfig()
export default instance
