import { Capability } from "models/capability.js";

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
            new Capability(Capabilities.BitNode.description, this.#resetInfo().currentNode),
            new Capability(Capabilities.HackNetServer.description,this.hasHacknetServer()),
            new Capability(Capabilities.SingularityAPI.description, this.#hasSingularity()),
            new Capability(Capabilities.Executables.BruteSsh.description, this.#hasExe(Capabilities.Executables.BruteSsh.description)),
            new Capability(Capabilities.Executables.FtpCrack.description, this.#hasExe(Capabilities.Executables.FtpCrack.description)),
            new Capability(Capabilities.Executables.RelaySmtp.description, this.#hasExe(Capabilities.Executables.RelaySmtp.description)),
            new Capability(Capabilities.Executables.HttpWorm.description, this.#hasExe(Capabilities.Executables.HttpWorm.description)),
            new Capability(Capabilities.Executables.SqlInject.description, this.#hasExe(Capabilities.Executables.SqlInject.description)),
            new Capability(Capabilities.Executables.AutoLink.description, this.#hasExe(Capabilities.Executables.AutoLink.description)),
            new Capability(Capabilities.Executables.DeepScanV1.description, this.#hasExe(Capabilities.Executables.DeepScanV1.description)),
            new Capability(Capabilities.Executables.DeepScanV2.description, this.#hasExe(Capabilities.Executables.DeepScanV2.description)),
            new Capability(Capabilities.Executables.ServerProfiler.description, this.#hasExe(Capabilities.Executables.ServerProfiler.description)),
            new Capability(Capabilities.Executables.Formulas.description, this.#hasExe(Capabilities.Executables.Formulas.description)),
            new Capability(Capabilities.Stocks.Has4SData.description, this.#has4SData()),
            new Capability(Capabilities.Stocks.Has4SDataTixApi.description, this.#has4SDataTixApi()),
            new Capability(Capabilities.Stocks.HasTixApiAccess.description, this.#hasTixApi()),
            new Capability(Capabilities.Stocks.HasWSEAccount.description, this.#hasWSEAccount())
        ];
    }

    hasAnyHacknetNodes() {
        return this.#hacknet().numNodes > 0;
    }

    hasHacknetServer() {
        return this.hasAnyHacknetNodes() && this.#hacknet().getNodeStats(0).hasOwnProperty('cache');
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
        SqlInject: Symbol('SQLInject.exe'),
        AutoLink: Symbol('AutoLink.exe'),
        DeepScanV1: Symbol('DeepScanV1.exe'),
        DeepScanV2: Symbol('DeepScanV2.exe'),
        ServerProfiler: Symbol('ServerProfiler.exe'),
        Formulas: Symbol('Formulas.exe')
    },
    Stocks: {
        Has4SData: Symbol('Has4SData'),
        Has4SDataTixApi: Symbol('Has4SDataTixApi'),
        HasTixApiAccess: Symbol('HasTixApiAccess'),
        HasWSEAccount: Symbol('HasWSEAccount')
    }
};