import { NetworkManager } from 'managers/network-manager.js';

/** @param {NS} ns */
export async function main(ns) {
	let manager = new NetworkManager(ns);
	manager.build('home');
	let map = manager.getMap();

	runWeakens(ns, map.children);	
}

function runWeakens(ns, nodes) {
	let exclusions = ['home'];
    let excludedPrefixes = [
        'weaken',
        'hack'
    ];

	if (nodes && nodes.length > 0) {
		for(let i = 0; i < nodes.length; i++) {
			let currentNode = nodes[i];

			if (currentNode && currentNode.hasChildren()) {
				runWeakens(ns, currentNode.children);
			}

			if (currentNode.current.hasRoot() && currentNode.canHack(ns.getPlayer().skills.hacking) && !exclusions.some(item => item == currentNode.current.name()) && !excludedPrefixes.find(item => currentNode.current.name().startsWith(item))) {
				ns.run('hack-n-grow.js', 200, currentNode.current.name());
			}
		}
	}
}