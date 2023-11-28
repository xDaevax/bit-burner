import * as allTypes from 'modules/ui/augments/registry';
/**
 * Base class for UI augmentations to be dynamically loaded by the system.
 */
export class Augment {
    /**
     * @type {Augment[]}
     */
    #augmentations;

    constructor() {
        this.#augmentations = {};
    }

    static async factory() {
        let instance = new Augment();

        Object.keys(allTypes).forEach(type => {
            instance.#augmentations[type] = new allTypes[type]().constructor;
        });

        return instance;
    }

    getAll() {
        return this.#augmentations;
    }
}