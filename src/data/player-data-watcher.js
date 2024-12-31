import { SystemStorageEngine, StorageKeys } from "sys/system-storage-engine";
import { PlayerData } from "data/player-data";
import { BehaviorSubject } from "sys/behavior-subject";
import { Subscription } from "sys/subscription";

export class PlayerDataWatcher {
    #ns = {};
    #storageEngine = {};
    /**
     * @type {BehaviorSubject}
     */
    #playerState;

    /**
     * 
     * @param {*} ns 
     * @param {SystemStorageEngine} storageEngine 
     */
    constructor(ns, storageEngine) {
        this.#ns = ns;
        this.#storageEngine = storageEngine;
        this.#playerState = new BehaviorSubject(null);
    }

    currentPlayerData() {
        return this.readStorage()?.data;
    }

    /**
     * Adds an observer for when player state changes.
     * @param {{ next: function, complete?: function }} observer 
     * @returns {Subscription}
     */
    onStateChange(observer) {
        return this.#playerState.subscribe(observer);
    }

    async startWatcher(token) {
        while (!token.isCancellationRequested) {
            let currentData = this.readStorage();

            let skills = this.#ns.getPlayer().skills;
            let hp = this.#ns.getPlayer().hp;
            let base = this.#ns.getPlayer();

            if (!(currentData.data instanceof PlayerData)) {
                currentData.data = new PlayerData();
            }
            
            let skillFields = Object.keys(skills);
            let hpFields = Object.keys(hp);
            let baseFields = Object.keys(base);

            for (let i = 0; i < skillFields.length; i++) {
                if (currentData.data[skillFields[i]] != undefined) {
                    currentData.data[skillFields[i]] = skills[skillFields[i]];
                }
            }

            for (let i = 0; i < hpFields.length; i++) {
                if (currentData.data[hpFields[i]] != undefined) {
                    currentData.data[hpFields[i]] = hp[hpFields[i]];
                }
            }

            for (let i = 0; i < baseFields.length; i++) {
                if (currentData.data[baseFields[i]] != undefined) {
                    currentData.data[baseFields[i]] = base[baseFields[i]];
                }
            }

            this.#storageEngine.save(currentData);
            this.#playerState.next(currentData.data);

            await this.#ns.asleep(1000);
        }

        if (token.isCancellationRequested) {
            this.#playerState.complete();
        }
    }

    readStorage() {
        let existingData = this.#storageEngine.load(StorageKeys.PlayerKey);

        if (!existingData || existingData.storageName == '') {
            existingData = this.#storageEngine.createStorageItem(StorageKeys.PlayerKey, new PlayerData());
        }

        existingData.data = new PlayerData(existingData.data);

        return existingData;
    }
}