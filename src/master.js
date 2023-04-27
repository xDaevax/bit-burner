import { CapabilityLoader } from "sys/capability-loader.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.weaken;
    let loader = new CapabilityLoader(ns);
    console.log('here');
    let capabilities = loader.loadCapabilities();

    console.log(capabilities);
}