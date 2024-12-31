import { Storage } from "models/storage";

export class StorageKeys {
  static PlayerKey = "xd_bb_pl";
  static HackingKey = "xd_bb_hk";
}

/**
 * Service type that encapsulates saving and loading data from browser storage.
 */
export class SystemStorageEngine {
  /**
   * Initializes a new instance of the SystemStorageEngine class.
   */
  constructor() {
  } // end constructor

  /**
   * Creates a new Storage instance that can be used to write data to browser storage.
   * @param {string} name - The unique name of the data to store
   * @param {object} data - The data to store.
   * @returns {Storage}
   */
  createStorageItem(name, data) {
    let returnValue = new Storage();
    returnValue.data = data;
    returnValue.storageName = name;

    return returnValue;
  } // end function createStorageItem

  /**
   * Writes the given storage data to the browser storage.  If the item already exists, it will be overwritten.
   * @param {Storage} storage - The storage instance with the storage name and data to write.
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
  } // end function save

  /**
   * Attempts to load the data in browser storage with the given key.  If the key is not found in storage, this method returns null.
   * @param {string} key - The key of the item to load from storage.
   * @returns {Storage}
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
  } // end function load

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
  } // end function remove
} // end class SystemStorageEngine
