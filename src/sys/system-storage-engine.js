import { Storage } from "models/storage.js"

export class StorageKeys {
  static PlayerKey = "xd_bb_pl";
}

/**
 * Service type that encapsulates saving and loading data from browser storage.
 */
export class SystemStorageEngine {
  /**
   * Initializes a new instance of the SystemStorageEngine class.
   */
  constructor() {
  }

  /**
   * Creates a new Storage instance that can be used to write data to browser storage.
   * @param name - The unique name of the data to store
   * @param data - The data to store.
   */
  createStorageItem(name, data) {
    let returnValue = new Storage();
    returnValue.data = data;
    returnValue.storageName = name;

    return returnValue;
  }

  /**
   * Writes the given storage data to the browser storage.  If the item already exists, it will be overwritten.
   * @param storage - The storage instance with the storage name and data to write.
   */
  save(storage) {
    if (localStorage?.length > 0) {
      let existingItem = localStorage.getItem(storage.storageName);
			
      if (!!!existingItem) {
        existingItem = storage.getDataForStorage();
        localStorage.setItem(storage.storageName, existingItem);
      } else {
        localStorage.setItem(
          storage.storageName,
          storage.getDataForStorage()
        );
      }
    } else {
      localStorage?.setItem(
        storage.storageName,
        storage.getDataForStorage()
      );
    }
  }

  /**
   * Attempts to load the data in browser storage with the given key.  If the key is not found in storage, this method returns null.
   * @param key - The key of the item to load from storage.
   */
  load(key) {
    if (localStorage?.length > 0) {
      let existingItem = localStorage.getItem(key);

      if (!!existingItem) {
        let newStorage = new Storage();
        newStorage.buildFromStorage(existingItem);
        newStorage.storageName = key;
        return newStorage;
      } else {
        return new Storage();
      }
    } else {
      return new Storage();
    }
  }

  /**
   * Attempts to remove the given key from session storage.  Does nothing if the item isn't found or no items exist.
   * @param key - The key of the item to remove.
   */
  remove(key) {
    if (localStorage.length > 0) {
      let keyExists = localStorage.getItem(key);

      if (!!keyExists) {
        localStorage.removeItem(key);
      }
    }
  }
}
