import { NetworkManager } from 'managers/network-manager.js';

/** @param {NS} ns */
export async function main(ns) {
	let manager = new NetworkManager(ns);
	manager.build();

	const networkMap = manager.getMap();

	for (let i = 0; i < networkMap.children.length; i++) {
		tryHack(ns, networkMap.children[i]);
	}

}

function tryHack(ns, host) {
	let shouldSkip = host.current.name().startsWith('weaken') || host.current.name().startsWith('hack');

	if (shouldSkip) {
		return;
	}
	
	if (host.current.hasRoot()) {
		console.log(`${host.current.name()} is already hacked.`);

		if (host.current.hasBackdoor() && host.hasChildren()) {
			for (let i = 0; i < host.children.length; i++) {
				let currentChild = host.children[i];

				if (currentChild.current.hasRoot() && !currentChild.current.hasBackdoor()) {
					const terminalInput = eval('document').getElementById("terminal-input");
					terminalInput.value = `home; connect ${host.current.name()}; connect ${currentChild.current.name()}; backdoor`;
					// Get a reference to the React event handler.
					const handler = Object.keys(terminalInput)[1];

					// Perform an onChange event to set some internal values.
					terminalInput[handler].onChange({ target: terminalInput });

					// Simulate an enter press
					terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
				}
			}
		}

		if (!host.current.hasBackdoor()) {
			const terminalInput = eval('document').getElementById("terminal-input");
			terminalInput.value = `home; connect ${host.current.name()}; backdoor`;
			// Get a reference to the React event handler.
			const handler = Object.keys(terminalInput)[1];

			// Perform an onChange event to set some internal values.
			terminalInput[handler].onChange({ target: terminalInput });

			// Simulate an enter press
			terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
		}
	} else {

		if (host.current.minHackLevel() <= ns.getPlayer().skills.hacking) {
			let portCount = host.current.numPortsRequired();

			let availableFiles = [];

			if (ns.fileExists('BruteSSH.exe')) {
				availableFiles.push((name) => ns.brutessh(name));
			}

			if (ns.fileExists('FTPCrack.exe')) {
				availableFiles.push((name) => ns.ftpcrack(name));
			}

			if (ns.fileExists('relaySMTP.exe')) {
				availableFiles.push((name) => ns.relaysmtp(name));
			}

			if (ns.fileExists('HTTPWorm.exe')) {
				availableFiles.push((name) => ns.httpworm(name));
			}

			if (ns.fileExists('SQLInject.exe')) {
				availableFiles.push((name) => ns.sqlinject(name));
			}

			if (availableFiles.length >= portCount) {
				for (let i = 0; i < portCount; i++) {
					availableFiles[i](host.current.name());
				}

				ns.nuke(host.current.name());

				ns.toast(`${host.current.name()} ready for backdoor.`);
			} else {
				ns.toast(`Not enough tools to hack ${host.current.name()}.`);
			}
		}
	}

	if (host.hasChildren()) {
		for (let i = 0; i < host.children.length; i++) {
			tryHack(ns, host.children[i]);
		}
	}
}