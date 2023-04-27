/** @param {NS} ns */
export async function main(ns) {
	systems.push(new SystemState('n00dles'));
	systems.push(new SystemState('foodnstuff'));

	while (true) {
		for(let i = 0; i < systems.length; i++) {
			await performHack(ns, systems[i]);
		}
	}
}

export async function performHack(ns, state) {
	state.update(ns);
	ns.print(state.getHost(), state.getCurrentState());
	let moneyEarned = await ns.hack(state.getHost());

	if (moneyEarned <= 0) {
		await ns.weaken(state.getHost());
	} else {
		//await ns.grow(state.getHost());
	}
}

const systems = [];

export class SystemState {
	#hostName = '';
	#currentSecurity = {};
	#minSecurity = {};

	constructor(host) {
		this.#hostName = host;
	}

	update(ns) {
		this.#currentSecurity = ns.getServerSecurityLevel(this.getHost());
		this.#minSecurity = ns.getServerMinSecurityLevel(this.getHost());
	}

	getCurrentState() {
		return {
			currentSecurity: this.#currentSecurity,
			minSecurity: this.#minSecurity
		};
	}

	getHost() {
		return this.#hostName;
	}
}