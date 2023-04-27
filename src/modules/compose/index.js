import { Injector } from "models/injector";
import { PortService } from "services/port-service";
import { StyleService } from "services/style-service";
import { UIManager } from "managers/ui-manager";
import { UIService } from "services/ui-service";

/**
 * Composition root that boot-straps all other scripts.
 * @param {NS} ns The NetScript instance injected from context.
 */
export async function main(ns) {
    let win = eval('window');

    win['di-container'] = Injector();

    win['di-container'].setup('port-service', new PortService());
    win['di-container'].setup('style-service', new StyleService(ns, eval('document'), win['di-container'].getService('port-service')));
    win['di-container'].setup('ui-manager', new UIManager(eval('document'), win['di-container'].getService('style-service')));
    win['di-container'].setup('ui-service', new UIService(eval('document'), async (value) => { await ns.asleep(value); }, win['di-container'].getService('ui-manager')))

    while(!win['di-container'].getService('style-service').disposed) {
        await ns.asleep(5000);
    }
}