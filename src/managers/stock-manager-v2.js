import { Stock } from "models/stock";

/**
 * A manager type used to handle stock market automation.
 */
export class StockManagerV2 {
    #ns = {};
    #settings = {};

    /**
     * A set of configuration properties for the manager.
     * @typedef {Object} StockManagerConfiguration
     * @property {Number} reserveFundRatio The ratio of funds to reserve for non-stock market operations.
     * @property {Number} expectedReturnLossSaleThresholdRatio As a percent, the amount of change between the initial forecasted return and the current return of the stock. I.e. -40% less forecasted return now than when we purchased the stock.
     * @property {Number} commission Buy or sell commission.
     * @property {Number} cycleCount Each cycle is 5 seconds.
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

    #log(message) {
        this.#ns.print(message);
    } // end function log

    #mapStock(sym) {
        let newStock = new Stock();
        newStock.symbol = sym;
        newStock.price = this.#ns.stock.getPrice(sym);
        const position = this.#ns.stock.getPosition(sym);
        newStock.shares = position[0];
        newStock.buyPrice = position[1];
        newStock.volatility = this.#ns.stock.getVolatility(sym);
        newStock.probability = 2 * (this.#ns.stock.getForecast(sym) - 0.5);
        newStock.expectedReturn = newStock.volatility * newStock.probability / 2;

        if (newStock.shares > 0) {
            newStock.initialExpectedReturn ||= newStock.expectedReturn;
        } else {
            newStock.initialExpectedReturn = null;
        }

        return newStock;
    }

    loadAllStocks() {
        return [...this.#ns.stock.getSymbols().map((sym) => this.#mapStock(sym))];
    }

    #getCurrentMoney() {
        return this.#ns.getServerMoneyAvailable("home");
    }

    #calculateCashToSpend(corpus) {
        return this.#getCurrentMoney() - (this.#settings.reserveFundRatio * corpus);
    }

    #refresh(stocks, myStocks) {
        let corpus = this.#getCurrentMoney();
        myStocks.length = 0;

        for (let i = 0; i < stocks.length; i++) {
            stocks[i] = this.#mapStock(stocks[i].symbol);

            corpus += stocks[i].price * stocks[i].shares;

            if (stocks[i].shares > 0) {
                myStocks.push(stocks[i]);
            }
            // ns.print(JSON.stringify(stocks[i]))
        }

        stocks.sort((a, b) => { return b.expectedReturn - a.expectedReturn });
        return corpus;
    }

    #format(num) {
        let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
        let i = 0;
        for (; (num >= 1000) && (i < symbols.length); i++) num /= 1000;
    
        return ((Math.sign(num) < 0) ? "-$" : "$") + num.toFixed(3) + symbols[i];
    }

    #pChange(sym, oldNum, newNum) {
        const diff = newNum < oldNum ? -(oldNum - newNum) : newNum - oldNum;
        let pdiff = diff / oldNum;
        this.#log(`${sym}:\t${oldNum.toFixed(5)} -> ${newNum.toFixed(5)} | ${(pdiff * 100).toFixed(3)}%`);
        return pdiff;
    }

    async #sell(stock, numShares) {
        let profit = numShares * ((stock.price - stock.purchasePrice) - (2 * this.#settings.commission));
        await this.#ns.stock.sellStock(stock.symbol, numShares);
        this.#log(`Sold ${stock.symbol} for profit of ${this.#format(profit)}`);
    }

    async #buy(stock, numShares) {
        const max = this.#ns.stock.getMaxShares(stock.symbol)
        numShares = max < numShares ? max : numShares;
    
        await this.#ns.stock.buyStock(stock.symbol, numShares);
        this.#log(`Bought ${stock.symbol} for ${this.#format(numShares * stock.price)}`);
    }

    async run(shouldCancel) {
        let stocks = this.loadAllStocks();
        let myStocks = [];

        while (!shouldCancel()) {
            let corpus = this.#refresh(stocks, myStocks);
            // Symbol, Initial Return, Current Return, The % change between
            // the Initial Return and the Current Return.
            this.#log("Currently Owned Stocks:");
            this.#log("SYM | InitReturn -> CurReturn | % change");
            // Sell underperforming shares
            for (let i = 0; i < myStocks.length; i++) {
                if (this.#pChange(myStocks[i].symbol, myStocks[i].initialExpectedReturn, myStocks[i].expectedReturn) <= this.#settings.expectedReturnLossSaleThresholdRatio) {
                    await this.#sell(myStocks[i], myStocks[i].shares);
                }

                if (myStocks[i].expectedReturn <= 0) {
                    await this.#sell(myStocks[i], myStocks[i].shares);
                }

                corpus -= this.#settings.commission;
            }

            this.#log("----------------------------------------");

            // Buy shares with cash remaining in hand
            for (let stock of stocks) {
                if (stock.shares > 0) {
                    continue;
                }

                if (stock.expectedReturn <= 0) {
                    continue;
                }

                let cashToSpend = this.#calculateCashToSpend(corpus);
                let numShares = Math.floor((cashToSpend - this.#settings.commission) / stock.price);

                if ((numShares * stock.expectedReturn * stock.price * this.#settings.cycleCount) > this.#settings.commission) {
                    await this.#buy(stock, numShares);
                }

                break;
            }

            await this.#ns.sleep(5 * 1000 * this.#settings.cycleCount + 200);
        }
    } // end function run
} // end class StockManagerV2

export async function main(ns) {
    //Initialise
    ns.disableLog("ALL");
    const manager = new StockManagerV2(ns, {
        reserveFundRatio: 0.2,
        commission: 100000,
        cycleCount: 2,
        expectedReturnLossSaleThresholdRatio: -0.4
    });

    await manager.run(() => false);
}