import { NodeManager } from "managers/node-manager.js";

/** @param {NS} ns */
export async function main(ns) {
	let nodeManager = new NodeManager(ns);
	await nodeManager.processNewNodes();
	ns.atExit(() => nodeManager.finalize());
}