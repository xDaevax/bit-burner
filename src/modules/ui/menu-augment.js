import { Container } from 'modules/ui/container.js';
import { NetworkManager } from 'managers/network-manager.js';
import { NetworkNode } from 'models/network-node.js';
import { NetworkMap } from 'models/network-map.js';
import { NetworkVisualizer } from 'modules/ui/network-visualizer.js';

let ns_ = null;
/** @param {NS} ns */
export async function main(ns) {
	ns_ = ns;
	let cancel = false;
	await ns.sleep(4000);
	ns.atExit(() => { cancel = true; });
	console.debug(ns);
	let doc = eval('document');
	while (!cancel) {
		let menuEnabled = doc.getElementsByClassName('MuiDrawer-root MuiDrawer-docked css-v3syqg')[0];

		if (menuEnabled) { // Some screens remove the menu, make sure it is there before augmenting.
			let menuItemExists = doc.getElementById('summary-menu');

			if (!menuItemExists) {
				const menu = doc.getElementsByClassName('MuiPaper-root MuiPaper-elevation MuiPaper-elevation0 MuiDrawer-paper MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft css-191sosw');
				const menuItems = menu[0].getElementsByTagName('ul')[0].getElementsByTagName('div');
				const copiedItems = Array.from(menuItems);

				for (let i = 0; i < copiedItems.length; i++) {
					if (copiedItems[i].className == 'MuiCollapse-root MuiCollapse-vertical MuiCollapse-entered css-c4sutr' && copiedItems[i].innerHTML.includes('City')) {
						let newItem = copiedItems[i].firstElementChild.firstElementChild.firstElementChild.cloneNode(true);
						newItem.id = 'test-menu-item';
						newItem.getElementsByTagName('p')[0].textContent = 'Summary';

						newItem.onclick = () => {
							const manager = new NetworkManager(ns_);
							manager.build('home');
							let visualizer = new NetworkVisualizer(doc, ns_);
							let netMap = visualizer.create(manager.getMap());
							let c = new Container('test-ui', doc, netMap);
							c.render('Summary');
						}

						if (!doc.getElementById('test-menu-item')) {
							copiedItems[i].firstElementChild.firstElementChild.append(newItem);
						} else {
							doc.getElementById('test-menu-item').remove();
							copiedItems[i].firstElementChild.firstElementChild.append(newItem);
						}

						break;
					}
				}
			}
		}

		await ns.asleep(5000);
	}
}