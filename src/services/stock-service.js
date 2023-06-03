import { StockManager } from "managers/stock-manager";

/**
 * Exposes business logic and behaviors for dealing with stocks.
 */
export class StockService {
    #enabled;
    #stockManager;

    /**
     * Initializes a new instance of the StockService class.
     * @param {StockManager} stockManager The manager that provides low-level access to stock management.
     */
    constructor(stockManager) {
        this.#enabled = false;
        this.#stockManager = stockManager;
    } // end constructor

    /**
     * Starts the broker trading stocks.
     */
    async enableBroker() {
        if (this.#enabled) { // only allow invocation one time
            return;
        }

        this.#enabled = true;

        ns.disableLog('disableLog');
        ns.disableLog('sleep');
        ns.disableLog('getServerMoneyAvailable');

        await this.#stockManager.run(() => this.#enabled);
    } // end function enableBroker

    /**
     * Stops the broker from trading.
     */
    disableBroker() {
        this.#enabled = false;
    } // end function disableBroker
}