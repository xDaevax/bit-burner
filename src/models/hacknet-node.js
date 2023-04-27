/**
 * Exposes common attributes of a hacknet node.
*/
export class HacknetNode {
    #name = '';
    #level = 0;
    #ram = 0;
    #cache = 0;
    #cores = 0;
    #currentOutput = 0;
    #ns = null;
    nodeIndex = 0;

    /**
     * Initializes a new instance of the HacknetNode class.
     * @param {NS} ns The NetScript instance used to access functions. 
     * @param {number} nodeIndex The index of the hacknet node in the array. 
     */
    constructor(ns, nodeIndex) {
        this.#ns = ns;
        this.nodeIndex = nodeIndex;
        this.refresh();
    }

    #hacknet() {
        return eval("this.#ns.hacknet");
    }

    refresh() {
        let node = this.#hacknet().getNodeStats(this.nodeIndex);
        if (node.hasOwnProperty('cache')) {
            this.#cache = node.cache;
        }

        this.#name = node.name;
        this.#ram = node.ram;
        this.#level = node.level;
        this.#currentOutput = node.production;
    }

    getCheapestUpgrade() {
        let allCosts = [
            { name: 'ram', cost: this.getRamUpgradeCost() },
            { name: 'cores', cost: this.getCoreUpgradeCost() },
            { name: 'level', cost: this.getLevelUpgradeCost() },
            { name: 'cache', cost: this.getCacheUpgradeCost() }
        ];

        return allCosts.sort((item, next) => {
            return item.cost < next.cost ? -1 : item.cost > next.cost ? 1 : 0;
         })[0];
    }

    getLevelUpgradeCost() {
        if (this.canIncreaseLevel()) {
            return this.#hacknet().getLevelUpgradeCost(this.nodeIndex);
        }

        return Number.MAX_VALUE;
    }

    getCacheUpgradeCost() {
        if (this.canIncreaseCache()) {
            return this.#hacknet().getCacheUpgradeCost(this.nodeIndex);
        }

        return Number.MAX_VALUE;
    }

    getCoreUpgradeCost() {
        if (this.canIncreaseCores()) {
            return this.#hacknet().getCoreUpgradeCost(this.nodeIndex);
        }

        return Number.MAX_VALUE;
    }

    getRamUpgradeCost() {
        if (this.canIncreaseRAM()) {
            return this.#hacknet().getRamUpgradeCost(this.nodeIndex);
        }

        return Number.MAX_VALUE;
    }

    cores() {
        return this.#cores;
    }

    cache() {
        return this.#cache;
    }

    currentOutput() {
        return this.#currentOutput;
    }

    ram() {
        return this.#ram;
    }

    level() {
        return this.#level;
    }

    name() {
        return this.#name;
    }

    canIncreaseLevel() {
        return this.level() < 200;
    }

    canIncreaseCores() {
        return this.cores() < 16;
    }

    canIncreaseRAM() {
        if (this.#hacknet().getNodeStats(0).hasOwnProperty('cache')) {
            return this.ram() < 8096;
        } else {
            return this.ram() < 64;
        }
    }

    canIncreaseCache() {
        return this.cache() < 30;
    }
}