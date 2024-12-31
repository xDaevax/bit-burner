import { StockManagerV2 } from "managers/stock-manager-v2";

/**
 * Exposes business logic and behaviors for dealing with stocks.
 */
export class StockService {
    #enabled;
    /**
     * @type {StockManagerV2}
     */
    #stockManager;
    /**
     * @type {NS}
     */
    #ns;

    /**
     * Initializes a new instance of the StockService class.
     * @param {StockManagerV2} stockManager The manager that provides low-level access to stock management.
     */
    constructor(stockManager, ns) {
        this.#enabled = false;
        this.#stockManager = stockManager;
        this.#ns = ns;
    } // end constructor

    /**
     * Starts the broker trading stocks.
     */
    async enableBroker() {
        if (this.#enabled) { // only allow invocation one time
            return;
        }

        this.#enabled = true;

        this.#ns.disableLog('disableLog');
        this.#ns.disableLog('sleep');
        this.#ns.disableLog('getServerMoneyAvailable');

        await this.#stockManager.run(() => !this.#enabled);
    } // end function enableBroker

    /**
     * Stops the broker from trading.
     */
    disableBroker() {
        this.#enabled = false;
    } // end function disableBroker
}