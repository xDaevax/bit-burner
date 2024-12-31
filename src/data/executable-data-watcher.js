import { SystemStorageEngine, StorageKeys } from "sys/system-storage-engine";
import { ExecutableData } from "data/executable-data";
import { BehaviorSubject } from "sys/behavior-subject";
import { Subscription } from "sys/subscription";
import { Capabilities } from "sys/capabilities";

export class ExecutableDataWatcher {
    #ns = {};

    /**
     * @type {SystemStorageEngine}
     */
    #storageEngine;

    /**
     * @type {BehaviorSubject}
     */
    #executableState;

    /**
     * 
     * @param {*} ns 
     * @param {SystemStorageEngine} storageEngine 
     */
    constructor(ns, storageEngine) {
        this.#ns = ns;
        this.#storageEngine = storageEngine;
        this.#executableState = new BehaviorSubject(null);
    }

    currentExecutableData() {
        return this.readStorage()?.data;
    }

    /**
     * Adds an observer for when executable state changes.
     * @param {{ next: function, complete?: function }} observer 
     * @returns {Subscription}
     */
    onStateChange(observer) {
        return this.#executableState.subscribe(observer);
    }

    /**
     * 
     * @returns {string[]}
     */
    readHomeExecutables() {
        return this.#ns.ls('home', '.exe');
    }

    async startWatcher(token) {
        while (!token.isCancellationRequested) {
            let currentData = this.readStorage();
            let executables = this.readHomeExecutables();
            let capabilities = Object.keys(Capabilities.Executables);
            let supportedExecutables = capabilities.filter(match => executables.includes(match + ".exe"));

            if (!(currentData.data instanceof ExecutableData)) {
                currentData.data = new ExecutableData();
            }

            let anyChanged = false;

            supportedExecutables.forEach(exe => {
                let exeName = exe.replace('.exe', '');

                if (!currentData.data[exeName]) {
                    anyChanged = true;
                    console.log('changed');
                }

                currentData.data[exeName] = true;                
            });

            this.#storageEngine.save(currentData);

            if (anyChanged) {
                this.#executableState.next(currentData.data);
            }

            await this.#ns.asleep(1000);
        }

        if (token.isCancellationRequested) {
            this.#executableState.complete();
        }
    }

    readStorage() {
        let existingData = this.#storageEngine.load(StorageKeys.HackingKey);

        if (!existingData || existingData.storageName == '') {
            existingData = this.#storageEngine.createStorageItem(StorageKeys.HackingKey, new ExecutableData());
        } else {
            existingData.data = new ExecutableData(existingData.data);
        }

        return existingData;
    }
}