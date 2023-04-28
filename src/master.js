import { setup } from 'modules/compose/index';

/** @param {NS} ns */
export async function main(ns) {
    ns.weaken; // RAM trick to reduce consumption.
    await setup(ns);
}