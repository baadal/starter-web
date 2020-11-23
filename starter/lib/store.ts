class Store {
  constructor() {
    this.assetList = [];

    if (!Store.instance) {
      Store.instance = this;
    }
    return Store.instance;
  }

  static instance: any;

  assetList: string[];

  addAsset(item: string) {
    this.assetList.push(item);
  }

  cleanup() {
    if (this.assetList.length > 0) {
      this.assetList.splice(0, this.assetList.length);
    }
  }
}

const singleton = new Store();

Object.freeze(singleton);

export default singleton;
