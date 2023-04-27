import { NetworkNode } from 'models/network-node.js';
import { NetworkMap } from 'models/network-map.js';
import { HackCapabilities } from 'models/hack-capabilities';

/** @param {NS} ns */
export async function main(ns) {
	let manager = new HackManager(ns);
}

export class HackManager {
    #ns = {};
    #capabilities = {};

    constructor(ns) {
        this.#ns = ns;
        this.#capabilities = new HackCapabilities(ns);
    }
}