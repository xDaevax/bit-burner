import { HacknetNode } from "models/hacknet-node.js";

export class NodeManager {
	#ns = {};
	#prevNodeCount = 0;
	#curNodeCount = 0;
	cancel = false;
	#nodes = [];

	constructor(ns) {
		this.#ns = ns;
	}

	finalize() {
		this.cancel = true;
	}

	#hacknet() {
		return eval("this.#ns.hacknet");
	}

	async processNewNodes() {
		while (!this.cancel) {
			if (this.#prevNodeCount < this.#curNodeCount) {
				let diff = this.#curNodeCount - this.#prevNodeCount;

				for (let i = 0; i < diff; i++) {
					let newNode = new HacknetNode(this.#ns, (i + this.#prevNodeCount));
					this.#nodes.push(newNode);
				}

				this.#prevNodeCount = this.#curNodeCount;
			}

			this.#nodes.sort((first, next) => {
				return first.getCheapestUpgrade().cost < next.getCheapestUpgrade() ? -1 : first.getCheapestUpgrade() > next.getCheapestUpgrade() ? 1 : 0;
			}).forEach(node => {
				node.refresh();
				let currentFunds = this.#ns.getPlayer().money;

				if (node.canIncreaseLevel() || node.canIncreaseCores() || node.canIncreaseRAM() || node.canIncreaseCache()) {
					let upgradeItem = node.getCheapestUpgrade().name;

					switch (upgradeItem) {
						case 'ram':
							if (node.getRamUpgradeCost(node.nodeIndex) < (currentFunds / 4)) {
								this.#hacknet().upgradeRam(node.nodeIndex);
							}

							break;
						case 'cores':
							if (node.getCoreUpgradeCost(node.nodeIndex) < (currentFunds / 2)) {
								this.#hacknet().upgradeCore(node.nodeIndex);
							}

							break;
						case 'level':
							if (node.getLevelUpgradeCost(node.nodeIndex) < (currentFunds / 4)) {
								this.#hacknet().upgradeLevel(node.nodeIndex);
							}

							break;
						case 'cache':
							if (node.getCacheUpgradeCost(node.nodeIndex) < (currentFunds / 2)) {
								this.#hacknet().upgradeCache(node.nodeIndex);
							}

							break;
					}
				}
			});

			this.#curNodeCount = this.#hacknet().numNodes();
			await this.#ns.sleep(1000);
		}
	}
}