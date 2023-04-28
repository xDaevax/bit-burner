import { StockOperation } from 'models/stock-operation.js';

/** @param {NS} ns **/
export async function main(ns) {
    const manager = new StockManager(ns, {
        reserveFunds: 10000000000, // 10 Billion
        minimumStocksPerPurchase: 5,
        minimumStockVolumePercentage: 0.05,
        forecastThresholdPercentage: 0.60,
        maxPercentageOfAvailableShares: 1.00
    });

    let stocks = ns.stock.getSymbols();

    while (true) {
        ns.disableLog('disableLog');
        ns.disableLog('sleep');
        ns.disableLog('getServerMoneyAvailable');
        
        manager.checkStocks(stocks);

        ns.print('Cycle Complete');
        await ns.sleep(6000);
    }
}

/**
 * A manager type used to handle stock market automation.
 */
export class StockManager {
    #ns = {};
    #settings = {};

    /**
     * A set of configuration properties for the manager.
     * @typedef {Object} StockManagerConfiguration
     * @property {Number} reserveFunds The amount of funds to reserve for non-stock market operations.
     * @property {Number} minimumStocksPerPurchase The smallest number of stocks that will be purchased in a single buy operation.  Used to reduce waste from transaction fees.
     * @property {Number} minimumStockVolumePercentage The volume percentage.  A stock whose volume is larger than this may be purchased, while one smaller will be sold.
     * @property {Number} forecastThresholdPercentage The minimum forecast to be considered a "worthwhile" investment.
     * @property {Number} maxPercentageOfAvailableShares Used to reduce the overall volume of stocks purchased.  A value of 1 means that up to the maximum available stocks for the symbol that the user can afford will be purchased.
     */

    /**
     * Initializes a new instance of the StockManager class.

     * @param {NS} ns The NetScript instance used to perform stock operations.
     * @param {StockManagerConfiguration} settings The configuration for the manager.
     */
    constructor(ns, settings) {
        this.#ns = ns;
        this.#settings = settings;
    }

    /**
     * Checks over all of the stock names and performs appropriate buy / sell operations based on user preferences.
     * @param {Array<string>} stockNames The names of the stock symbols to check.
     */
    checkStocks(stockNames) {
        for (const name of stockNames) {
            let position = this.#ns.stock.getPosition(name);

            if (position[0]) {
                this.#ns.print(`Position: ${name}, `);
                this.sellPositions(this.createOperation(name, position));
            }

            this.buyPositions(this.createOperation(name, position));
        }
    }

    /**
     * Purchases a set of positions from a symbol.
     * @param {StockOperation} stock The stock symbol name and position information used to buy.
     */
    buyPositions(stock) {
        let maxShares = (this.#ns.stock.getMaxShares(stock.name) * this.#settings.maxPercentageOfAvailableShares ) - stock.position[0];
        let askPrice = this.#ns.stock.getAskPrice(stock.name);
        let forecast = this.#ns.stock.getForecast(stock.name);
        let volPer = this.#ns.stock.getVolatility(stock.name);
        let playerMoney = this.#ns.getServerMoneyAvailable('home');

        if (forecast >= this.#settings.forecastThresholdPercentage && volPer <= this.#settings.minimumStockVolumePercentage) {
            if (playerMoney - this.#settings.reserveFunds > this.#ns.stock.getPurchaseCost(stock.name, this.#settings.minimumStocksPerPurchase, 'Long')) {
                let shares = Math.min((playerMoney - this.#settings.reserveFunds - 100000) / askPrice, maxShares);
                this.#ns.stock.buyStock(stock.name, shares);
                this.#ns.print(`Bought: ${shares} of ${stock.name} `);
            }
        }
    }

    /**
     * Sells a set of positions from a symbol.
     * @param {StockOperation} stock The stock symbol name and position information used to sell.
     */
    sellPositions(stock) {
        let forecast = this.#ns.stock.getForecast(stock.name);

        if (forecast < this.#settings.minimumStockVolumePercentage) {
            this.#ns.stock.sellStock(stock.name, stock.position[0]);
            this.#ns.print(`Sold: ${stock.name}`);
        }
    }

    /**
     * Factory method used to create a new stock operation.
     * @param {string} stockName The name of the stock involved in the operation.
     * @param {[Number,Number,Number,Number]} position The position array for the stock.
     * @returns {StockOperation} A new stock operation used to buy or sell stocks.
     */
    createOperation(stockName, position) {
        const operation = new StockOperation();

        operation.name = stockName;
        operation.position = position;

        return operation;
    }
}