import { NetworkNode } from '/models/network-node.js';
import { NetworkMap } from '/models/network-map.js';

/** @param {NS} ns */
export async function main(ns) {
	let manager = new NetworkManager(ns);
	manager.build('home');
	console.log(manager.checkVulnerability());
}

/**
 * Manager that simplifies management / interaction with the network.  Used by other utilities to make decisions and load data.
 */
export class NetworkManager {
	#ns = null;
	#map = null;

	/**
	 * Initializes a new instance of the NetworkManager class.
	 * @param {NS} ns The ns instance used to access NetScript functions.
	 */
	constructor(ns) {
		this.#ns = ns;
	} // end constructor

	createOptions(server) {
		return {
			ip: server.ip,
			name: server.hostname,
			cores: server.cpuCores,
			ram: server.maxRam,
			hasBackdoor: server.backdoorInstalled,
			hasRoot: server.hasAdminRights,
			hackLevel: server.requiredHackingSkill,
			availableMoney: server.moneyAvailable,
			securityLevel: server.hackDifficulty,
			numPortsRequired: server.numOpenPortsRequired,
			ramUsed: server.ramUsed
		};
	}

	checkVulnerability() {
		return this.#map.hasVulnerableNode(this.#ns.getPlayer().skills.hacking);
	}

	getMap() {
		return this.#map;
	}

	createNode(host, visited) {
		let nextMap = new NetworkMap();
		const currentNode = this.#ns.getServer(host);
		nextMap.current = new NetworkNode(this.createOptions(currentNode));
		nextMap.current.setPortState('HTTP', currentNode.httpPortOpen);
		nextMap.current.setPortState('FTP', currentNode.ftpPortOpen);
		nextMap.current.setPortState('SSH', currentNode.sshPortOpen);
		nextMap.current.setPortState('SMTP', currentNode.smtpPortOpen);
		nextMap.current.setPortState('SQL', currentNode.sqlPortOpen);
		let nodes = this.#ns.scan(host);

		visited.push(host);

		if (nodes.length > 0) {
			nodes.forEach(nextNode => {
				if (visited.indexOf(nextNode) < 0) {
					let mappedNode = this.createNode(nextNode, visited);
					nextMap.addNode(mappedNode);
				}
			});
		}

		return nextMap;
	}

	build(rootHost = 'home') {
		this.#map = new NetworkMap();
		const rootNode = this.#ns.getServer(rootHost);
		this.#map.current = new NetworkNode(this.createOptions(rootNode));
		this.#map.current.setPortState('HTTP', rootNode.httpPortOpen);
		this.#map.current.setPortState('FTP', rootNode.ftpPortOpen);
		this.#map.current.setPortState('SSH', rootNode.sshPortOpen);
		this.#map.current.setPortState('SMTP', rootNode.smtpPortOpen);
		this.#map.current.setPortState('SQL', rootNode.sqlPortOpen);
		let nodes = this.#ns.scan(rootHost);
		let visited = [];
		visited.push(rootHost);

		if (nodes.length > 0) {
			nodes.forEach(nextNode => {
				if (visited.indexOf(nextNode) < 0) {
					let mappedNode = this.createNode(nextNode, visited);
					this.#map.addNode(mappedNode);
				}
			});
		}
	} // end function build
} // end class NetworkManager