import { Injector } from "models/injector.js";
import { PortService } from "services/port-service";
import { StyleService } from "services/style-service";
import { UIManager } from "managers/ui-manager";
import { UIService } from "services/ui-service";
import { window, dom } from 'sys/dom';
import { StockService } from "services/stock-service";
import { StockManagerV2 } from "managers/stock-manager-v2";
import { Capability } from "models/capability";
import { CapabilityLoader } from "sys/capability-loader";

/**
 * Composition root that boot-straps all other scripts.
 * @param {import("..").NS} ns The NetScript instance injected from context.
 */
export async function setup(ns) {
    const win = window();
    const doc = dom();
    /*const stockConfig = {
        reserveFunds: 10000000000, // 10 Billion
        minimumStocksPerPurchase: 5,
        minimumStockVolumePercentage: 0.05,
        forecastThresholdPercentage: 0.60,
        maxPercentageOfAvailableShares: 1.00
    };*/

    const stockConfig = {
        reserveFundRatio: 0.2,
        commission: 100000,
        cycleCount: 2,
        expectedReturnLossSaleThresholdRatio: -0.4
    };
    
    win[DomNames.DependencyInjection] = Injector();
    win[DomNames.DependencyInjection].setup('port-service', new PortService());
    win[DomNames.DependencyInjection].setup('capability-loader', new CapabilityLoader(ns));
    win[DomNames.DependencyInjection].setup('stock-manager', new StockManagerV2(ns, stockConfig));
    win[DomNames.DependencyInjection].setup('stock-service', new StockService(getService('stock-manager', win)));
    win[DomNames.DependencyInjection].setup('style-service', new StyleService(ns, doc, getService('port-service', win)));
    win[DomNames.DependencyInjection].setup('ui-manager', new UIManager(doc, getService('style-service', win), getService('capability-loader', win)));
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