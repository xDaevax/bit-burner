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
import { NetworkManager } from "managers/network-manager";
import { HackManager } from "managers/hack-manager";
import { SystemStorageEngine } from "sys/system-storage-engine";
import { PlayerDataWatcher } from "data/player-data-watcher";
import { BaseStyles } from "modules/ui/widgets/base-styles";
import { Augment } from "modules/ui/augments/augment";

/**
 * Composition root that boot-straps all other scripts.
 * @param {import("..").NS} ns The NetScript instance injected from context.
 */
export async function setup(ns) {
    const win = window();
    const doc = dom();

    const startupScripts = [
      //'managers/stock-manager-v2.js',
      'modules/hacknet/main.js'  
    ];
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

    /** Load UI Augmentations */
    let augmentations = (await Augment.factory()).getAll();

    let interruptToken = {isCancellationRequested: false};
    
    win[DomNames.DependencyInjection] = Injector();
    win[DomNames.DependencyInjection].setup('port-service', new PortService());
    win[DomNames.DependencyInjection].setup('capability-loader', new CapabilityLoader(ns));
    win[DomNames.DependencyInjection].setup('stock-manager', new StockManagerV2(ns, stockConfig));
    win[DomNames.DependencyInjection].setup('stock-service', new StockService(getService('stock-manager', win)));
    win[DomNames.DependencyInjection].setup('style-service', new StyleService(ns, doc, getService('port-service', win)));
    win[DomNames.DependencyInjection].setup('ui-manager', new UIManager(doc, getService('style-service', win), getService('capability-loader', win), augmentations));
    win[DomNames.DependencyInjection].setup('ui-service', new UIService(doc, async (value) => { await ns.asleep(value); }, getService('ui-manager', win)));
    win[DomNames.DependencyInjection].setup('network-manager', new NetworkManager(ns));
    win[DomNames.DependencyInjection].setup('hack-manager', new HackManager(ns, {exclusions: ['home'], prefixExclusions: ['hack-', 'weaken-']}, getService('network-manager', win)));
    win[DomNames.DependencyInjection].setup('storage-engine', new SystemStorageEngine());
    win[DomNames.DependencyInjection].setup('player-watcher', new PlayerDataWatcher(ns, getService('storage-engine', win)));

    /** Root Styles */
    var rootStyles = new BaseStyles(getService('style-service', win));
    rootStyles.initStyles();

    /** Base Game automation */
    getService('hack-manager', win).startHack();
    ns.atExit(() => {interruptToken.isCancellationRequested = true});
    getService('player-watcher', win).startWatcher(interruptToken);

    startupScripts.forEach(script => {
        ns.run(script);
    });

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