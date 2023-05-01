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

    #hasExe(exeName) {
        return this.#ns.fileExists(exeName);
    }

    #hacknet() {
        return eval('this.#ns.hacknet');
    }

    loadCapabilities() {
        return [
            new Capability(Capabilities.BitNode.description, this.#player().bitNodeN),
            new Capability(Capabilities.HackNetServer.description, this.#hacknet().getNodeStats(0).hasOwnProperty('cache')),
            new Capability(Capabilities.SingularityAPI.description, this.#hasSingularity()),
            new Capability(Capabilities.Executables.BruteSsh.description, this.#hasExe(Capabilities.Executables.BruteSsh.description)),
            new Capability(Capabilities.Executables.FtpCrack.description, this.#hasExe(Capabilities.Executables.FtpCrack.description)),
            new Capability(Capabilities.Executables.RelaySmtp.description, this.#hasExe(Capabilities.Executables.RelaySmtp.description)),
            new Capability(Capabilities.Executables.HttpWorm.description, this.#hasExe(Capabilities.Executables.HttpWorm.description)),
            new Capability(Capabilities.Executables.SqlInject.description, this.#hasExe(Capabilities.Executables.SqlInject.description))
        ];
    }
}

export const Capabilities = {
    BitNode: Symbol('BitNode'),
    SingularityAPI: Symbol('Singularity.Api'),
    HackNetServer: Symbol('HackNet.Server'),
    Executables: {
        BruteSsh: Symbol('bruteSSH.exe'),
        FtpCrack: Symbol('FTPCrack.exe'),
        RelaySmtp: Symbol('relaySMTP.exe'),
        HttpWorm: Symbol('HTTPWorm.exe'),
        SqlInject: Symbol('SQLInject.exe')
    }
};