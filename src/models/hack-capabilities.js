import { NetworkNode } from 'models/network-node.js';

export class HackCapabilities {
    #ns = {};
    #homeNode = {};

    constructor(ns) {
        this.#ns = ns;
        const server = this.#ns.getServer('home');

        this.#homeNode = new NetworkNode({
            ip: server.ip,
			name: server.hostname,
			cores: server.cpuCores,
			ram: server.maxRam,
			hasBackdoor: server.backdoorInstalled,
			hasRoot: server.hasAdminRights,
			hackLevel: server.requiredHackingSkill,
			availableMoney: server.moneyAvailable,
			securityLevel: server.hackDifficulty,
			numPortsRequired: server.numOpenPortsRequired
        });

        this.#homeNodesetPortState('HTTP', server.httpPortOpen);
		this.#homeNodesetPortState('FTP', server.ftpPortOpen);
		this.#homeNodesetPortState('SSH', server.sshPortOpen);
		this.#homeNodesetPortState('SMTP', server.smtpPortOpen);
		this.#homeNodesetPortState('SQL', server.sqlPortOpen);
    }

    hasExe(exeName) {
        return this.#ns.ls(this.#homeNode.getName(), exeName)?.some();
    }

    hasRelaySMTP() {
        return this.hasExe('relaySMTP.exe');
    }

    hasFTPCrack() {
        return this.hasExe('FTPCrack.exe');
    }

    hasBruteSSH() {
        return this.hasExe('BruteSSH.exe');
    }

    hasHTTPWorm() {
        return this.hasExe('HTTPWorm.exe');
    }

    hasSQLInject() {
        return this.hasExe('SQLInject.exe');
    }

    hasDeepScan1() {
        return this.hasExe('DeepscanV1.exe');
    }

    hasDeepScan2() {
        return this.hasExe('DeepscanV2.exe');
    }

    hasServerProfiler() {
        return this.hasExe('ServerProfiler.exe');
    }

    hasFormulas() {
        return this.hasExe('Formulas.exe');
    }

    totalRam() {
        return this.#homeNode.ram();
    }

    availableRam() {
        return this.totalRam() - this.#homeNode.ramUsed();
    }

    coreCount() {
        return this.#homeNode.cores();
    }
}