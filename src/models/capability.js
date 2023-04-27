/**
 * Type used to represent a general capability of the game, system, or player.
 */
export class Capability {
    /**
     * The name of the capability.
     */
    name = '';

    /**
     * The current value of the capability.
     */
    value = {};

    /**
     * Initializes a new instance of the capability.
     * @param {string} name The name of the capability.
     * @param {any} value The value of the capability.
     */
    constructor(name, value) {
        this.name = name;
        this.value = value ?? {};
    } // end constructor
} // end class Capability