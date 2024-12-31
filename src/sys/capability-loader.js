import { CapabilityState } from "models/capability-state";
import { Capabilities } from "sys/capabilities";

export class CapabilityLoader {
    #ns;

    constructor(ns) {
        this.#ns = ns;
    }

    #player() {
        return this.#ns.getPlayer();
    }

    #resetInfo() {
        return this.#ns.getResetInfo();
    }

    #hasSingularity() {
        try {
            return this.#ns.singularity.getCurrentServer() != '';
        } catch {
            return false;
        }
    }

    #has4SData() {
        return this.#ns.stock.has4SData();
    }

    #has4SDataTixApi() {
        return this.#ns.stock.has4SDataTIXAPI();
    }

    #hasTixApi() {
        return this.#ns.stock.hasTIXAPIAccess();
    }

    #hasWSEAccount() {
        return this.#ns.stock.hasWSEAccount();
    }

    #hasExe(exeName) {
        return this.#ns.fileExists(exeName);
    }

    #hacknet() {
        return eval('this.#ns.hacknet');
    }

    loadCapabilities() {
        return [
            new CapabilityState(Capabilities.BitNode.description, () => this.#resetInfo().currentNode, this.#ns),
            new CapabilityState(Capabilities.HackNetServer.description, () => this.hasHacknetServer(), this.#ns),
            new CapabilityState(Capabilities.SingularityAPI.description, () => this.#hasSingularity(), this.#ns),
            new CapabilityState(Capabilities.Executables.BruteSSH.description, () => this.#hasExe(Capabilities.Executables.BruteSSH.description), this.#ns),
            new CapabilityState(Capabilities.Executables.FTPCrack.description, () => this.#hasExe(Capabilities.Executables.FTPCrack.description), this.#ns),
            new CapabilityState(Capabilities.Executables.relaySMTP.description, () => this.#hasExe(Capabilities.Executables.relaySMTP.description), this.#ns),
            new CapabilityState(Capabilities.Executables.HTTPWorm.description, () => this.#hasExe(Capabilities.Executables.HTTPWorm.description), this.#ns),
            new CapabilityState(Capabilities.Executables.SQLInject.description, () => this.#hasExe(Capabilities.Executables.SQLInject.description), this.#ns),
            new CapabilityState(Capabilities.Executables.AutoLink.description, () => this.#hasExe(Capabilities.Executables.AutoLink.description), this.#ns),
            new CapabilityState(Capabilities.Executables.DeepscanV1.description, () => this.#hasExe(Capabilities.Executables.DeepscanV1.description), this.#ns),
            new CapabilityState(Capabilities.Executables.DeepscanV2.description, () => this.#hasExe(Capabilities.Executables.DeepscanV2.description), this.#ns),
            new CapabilityState(Capabilities.Executables.ServerProfiler.description, () => this.#hasExe(Capabilities.Executables.ServerProfiler.description), this.#ns),
            new CapabilityState(Capabilities.Executables.Formulas.description, () => this.#hasExe(Capabilities.Executables.Formulas.description), this.#ns),
            new CapabilityState(Capabilities.Stocks.Has4SData.description, () => this.#has4SData(), this.#ns),
            new CapabilityState(Capabilities.Stocks.Has4SDataTixApi.description, () => this.#has4SDataTixApi(), this.#ns),
            new CapabilityState(Capabilities.Stocks.HasTixApiAccess.description, () => this.#hasTixApi(), this.#ns),
            new CapabilityState(Capabilities.Stocks.HasWSEAccount.description, () => this.#hasWSEAccount(), this.#ns)
        ];
    }

    hasAnyHacknetNodes() {
        return this.#hacknet().numNodes > 0;
    }

    hasHacknetServer() {
        return this.hasAnyHacknetNodes() && this.#hacknet().getNodeStats(0).hasOwnProperty('cache');
    }
}