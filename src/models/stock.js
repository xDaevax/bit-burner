export class Stock {
    expectedReturn;
    initialExpectedReturn;
    price;
    probability;
    purchasePrice;
    shares;
    symbol;
    volatility;

    constructor() {
        this.expectedReturn = 0;
        this.initialExpectedReturn = null;
        this.price = 0;
        this.probability = 0;
        this.purchasePrice = 0;
        this.shares = 0;
        this.symbol = '';
        this.volatility = 0;
    }
}