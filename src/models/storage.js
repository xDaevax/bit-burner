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
    } // end constructor
  
    /**
     * Attempts to create a new instance of the Storage model from the given value.
     * @param {string} value The value to convert to the object (usually a JSON string that comes from browser storage).
     * @returns {object}
     */
    buildFromStorage(value) {
      if (`${value}`.trim() === "") {
        this.data = {};
      } else {
        this.data = JSON.parse(value);
      }
    } // end function buildFromStorage
  
    /**
     * Returns a JSON string of the data to be stored in browser storage.
     * @returns {string}
     */
    getDataForStorage() {
      if (!!!this.data) {
        return "";
      } else {
        return JSON.stringify(this.data);
      }
    } // end function getDataForStorage
  } // end class Storage
  