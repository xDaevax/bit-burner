import { Injector } from "models/injector.js";
import { PortService } from "services/port-service";
import { StyleService } from "services/style-service";
import { UIManager } from "managers/ui-manager";
import { UIService } from "services/ui-service";
import { window, dom } from 'sys/dom';
import { StockService } from "services/stock-service";
import { StockManager, StockManagerConfiguration } from "managers/stock-manager";

/**
 * Composition root that boot-straps all other scripts.
 * @param {import("..").NS} ns The NetScript instance injected from context.
 */
export async function main(ns) {
    const win = window();
    const doc = dom();
    const stockConfig = {
        reserveFunds: 10000000000, // 10 Billion
        minimumStocksPerPurchase: 5,
        minimumStockVolumePercentage: 0.05,
        forecastThresholdPercentage: 0.60,
        maxPercentageOfAvailableShares: 1.00
    };
    
    win[DomNames.DependencyInjection] = Injector();
    win[DomNames.DependencyInjection].setup('port-service', new PortService());
    win[DomNames.DependencyInjection].setup('stock-manager', new StockManager(ns, stockConfig));
    win[DomNames.DependencyInjection].setup('stock-service', new StockService(getService('stock-manager', win)));
    win[DomNames.DependencyInjection].setup('style-service', new StyleService(ns, doc, getService('port-service', win)));
    win[DomNames.DependencyInjection].setup('ui-manager', new UIManager(doc, getService('style-service', win)));
    win[DomNames.DependencyInjection].setup('ui-service', new UIService(doc, async (value) => { await ns.asleep(value); }, getService('ui-manager', win)))

    while(!getService('style-service', win).disposed) {
        await ns.asleep(5000);
    }
}

function getService(serviceName, win = null) {
    let localWin = null;

    if (win == null) {
        localWin = win;
    } else {
        localWin = window();
    }

    return win[DomNames.DependencyInjection].getService(serviceName);
} // end function getService

const DomNames = {
    DependencyInjection: 'di-container'
};