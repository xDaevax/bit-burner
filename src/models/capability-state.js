import { Capability } from "./capability";

/**
 * Type used to store the capability state, allows for real-time updates as capabilities change.
 */
export class CapabilityState {
    #capabilityLocked;
    #ns;
    #capabilities;
    #observers;

    /**
     * Initializes a new instance of the Capability State class.
     * @param {NS} ns The Net Script instance, used primarily for asleep. 
     */
    constructor(ns) {
        this.#capabilityLocked = false;
        this.#capabilities = {};
        this.#ns = ns;
        this.#observers = {};
    } // end constructor

    /**
     * Adds a subscriber to changes in capabilities.
     * @param {Function<any>} observer The operation to perform when a capability is updated. 
     * @param {string} capability The capability to monitor.
     */
    subscribe(observer, capability) {
        let existing = Object.keys(this.#observers).filter(match => match == capability)[0];

        if (existing) {
            this.#observers[capability].push(observer);
        } else {
            this.#observers[capability] = [];
            this.#observers[capability].push(observer);
        }
    } // end function subscribe

    /**
     * Updates the value of the given capability
     * @param {Capability} capability The capability instance to update.
     */
    async updateCapability(capability) {
        if (this.#capabilityLocked) {
            while (this.#capabilityLocked) {
                await this.#ns.asleep(250);
            }

            this.#capabilityLocked = true;
            this.#capabilities[capability.name] = capability.value;
            this.#observers[capability]?.forEach(observer => observer(capability.value));
            this.#capabilityLocked = false;
        } else {
            this.#capabilityLocked = true;
            this.#capabilities[capability.name] = capability.value;
            this.#observers[capability]?.forEach(observer => observer(capability.value));
            this.#capabilityLocked = false;
        }
    } // end function updateCapability
} // end class CapabilityState