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
			let purchaseAmount = currentHashCount * .01;

			if (currentHashCount > (this.#ns.hacknet.hashCapacity() *.01)) {
				this.#ns.hacknet.spendHashes('Sell for Money', '', purchaseAmount);
			}

			await this.#ns.sleep(1000);
		}
	}

	finalize() {
		this.cancel = true;
	}

}