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

        let stocks = ns.stock.getSymbols();

        ns.disableLog('disableLog');
        ns.disableLog('sleep');
        ns.disableLog('getServerMoneyAvailable');

        while (this.#enabled) {           
            this.#stockManager.checkStocks(stocks);
    
            ns.print('Cycle Complete');
            await ns.sleep(6000);
        }
    } // end function enableBroker

    /**
     * Stops the broker from trading.
     */
    disableBroker() {
        this.#enabled = false;
    } // end function disableBroker
}