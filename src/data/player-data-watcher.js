import { SystemStorageEngine, StorageKeys } from "sys/system-storage-engine.js";
import { PlayerData } from "data/player-data.js";

export class PlayerDataWatcher {
    #ns = {};
    #storageEngine = {};

    /**
     * 
     * @param {*} ns 
     * @param {SystemStorageEngine} storageEngine 
     */
    constructor(ns, storageEngine) {
        this.#ns = ns;
        this.#storageEngine = storageEngine;
    }

    currentPlayerData() {
        return this.readStorage()?.data;
    }

    async startWatcher(token) {
        while (!token.isCancellationRequested) {
            let currentData = this.readStorage();

            let skills = this.#ns.getPlayer().skills;

            if (!(currentData.data instanceof PlayerData)) {
                currentData.data = new PlayerData();
            }
            
            let fields = Object.keys(currentData.data);

            for(let i = 0; i < fields.length; i++) {
                currentData.data[fields[i]] = skills[fields[i]];
            }

            this.#storageEngine.save(currentData);

            await this.#ns.asleep(2000);
        }
    }

    readStorage() {
        let existingData = this.#storageEngine.load(StorageKeys.PlayerKey);

        if (!existingData || existingData.storageName == '') {
            existingData = this.#storageEngine.createStorageItem(StorageKeys.PlayerKey, new PlayerData());
        }

        return existingData;
    }
}