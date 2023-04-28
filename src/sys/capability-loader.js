import { Capability } from "models/capability.js";

export class CapabilityLoader {
    #ns;

    constructor(ns) {
        this.#ns = ns;
    }

    #player() {
        return this.#ns.getPlayer();
    }

    #hasSingularity() {
        try {
            return this.#ns.singularity.getCurrentServer() != '';
        } catch {
            return false;
        }
    }

    #hacknet() {
        return eval('this.#ns.hacknet');
    }

    loadCapabilities() {
        return [
            new Capability(Capabilities.BitNode.description, this.#player().bitNodeN),
            new Capability(Capabilities.HackNetServer.description, this.#hacknet().getNodeStats(0).hasOwnProperty('cache')),
            new Capability(Capabilities.SingularityAPI.description, this.#hasSingularity())
        ];
    }
}

export const Capabilities = {
    BitNode: Symbol('BitNode'),
    SingularityAPI: Symbol('Singularity.Api'),
    HackNetServer: Symbol('HackNet.Server')
};