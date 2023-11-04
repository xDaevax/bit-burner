/**
 * A model used as a wrapper for other models that can be stored in browser storage.
 */
export class Storage {
    /**
     * Initializes a new instance of the Storage class.
     */
    constructor() {
      this.storageName = "";
      this.data = {};
    }
  
    /**
     * Attempts to create a new instance of the Storage model from the given value.
     * @param value The value to convert to the object (usually comes from browser storage).
     */
    buildFromStorage(value) {
      if (`${value}`.trim() === "") {
        this.data = {};
      } else {
        this.data = JSON.parse(value);
      }
    }
  
    /**
     * Returns a JSON string of the data to be stored in browser storage.
     */
    getDataForStorage() {
      if (!!!this.data) {
        return "";
      } else {
        return JSON.stringify(this.data);
      }
    }
  }
  