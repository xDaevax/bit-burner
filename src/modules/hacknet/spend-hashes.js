/** @param {NS} ns */
export async function main(ns) {
	let nodeManager = new SpendManager(ns);
	await nodeManager.spendMoney();
	ns.atExit(() => spendManager.finalize());
}

export class SpendManager {
	#ns = {};
	
	constructor(ns) {
		this.#ns = ns;
	}

	async spendMoney() {
		while (!this.cancel) {
			let currentHashCount = this.#ns.hacknet.numHashes();

			if (currentHashCount > this.#ns.hacknet.hashCapacity() / 50) {
				this.#ns.hacknet.spendHashes('Sell for Money', '', 50);
			}

			await this.#ns.sleep(1000);
		}
	}

	finalize() {
		this.cancel = true;
	}

}