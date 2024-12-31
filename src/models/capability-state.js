import { BehaviorSubject } from "sys/behavior-subject";
import { Capability } from "models/capability";
import { Subscription } from "sys/subscription";

/**
 * Type used to store the capability state, allows for real-time updates as capabilities change.
 */
export class CapabilityState extends Capability {
    #capabilityLocked;
    #ns;
    /**
     * @type {BehaviorSubject}
     */
    #state;

    /**
     * @type {Subscription[]}
     */
    #observers;

    /**
     * @typedef {Object} ObserverFunction
     * @property {function} next The function to invoke when a value changes.
     * @property {function?} complete The function to invoke when the subscription is completed.
     */

    /**
     * Initializes a new instance of the Capability State class.
     * @param {string} name The name of the capability.
     * @param {*} value The value of the capability (can also be a function to retrieve data). 
     * @param {NS} ns The Net Script instance, used primarily for asleep. 
     */
    constructor(name, value, ns) {
        super(name, value);
        this.#capabilityLocked = false;
        this.#ns = ns;
        this.#observers = [];
    } // end constructor

    /**
     * Adds a subscriber to changes in capabilities.
     * @param {ObserverFunction} observer The operation to perform when a capability is updated. 
     */
    subscribe(observer) {
        this.#observers.push(this.#state.subscribe(observer))
    } // end function subscribe

    /**
     * Encapsulation to load the set of observers for a given capability.
     * @param {string} capability The capability to load.
     * @returns {Subscription[]} An array of subscription instances.
     */
    loadCapabilityObservers(capability) {
        return this.#observers[capability];
    } // end function loadCapabilityObservers

    /**
     * Updates the value of the given capability
     */
    async updateCapability() {
        if (this.#capabilityLocked) {
            while (this.#capabilityLocked) {
                await this.#ns.asleep(150);
            }

            this.#capabilityLocked = true;
            this.#state.next(this.value);
            this.#capabilityLocked = false;
        } else {
            this.#capabilityLocked = true;
            this.#state.next(this.value);
            this.#capabilityLocked = false;
        }
    } // end function updateCapability
} // end class CapabilityState