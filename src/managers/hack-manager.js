import { NetworkNode } from "models/network-node.js";
import { NetworkMap } from "models/network-map.js";
import { HackCapabilities } from "models/hack-capabilities.js";
import { NetworkManager } from "managers/network-manager.js";

/** @param {NS} ns */
export async function main(ns) {
  let manager = new HackManager(ns);
}

export class HackManager {
  #ns = {};
  #capabilities = {};
  #configuration = {};
  #networkManager;
  #flatNetwork = [];
  #allScripts = [];

  /**
   * Initializes a new instance of the HackManager class.
   * @param {NS} ns
   * @param {HackManagerConfiguration} configuration
   * @param {NetworkManager} networkManager
   */
  constructor(ns, configuration, networkManager) {
    this.#ns = ns;
    this.#capabilities = new HackCapabilities(ns);
    this.#configuration = configuration ?? new HackManagerConfiguration();
    this.#networkManager = networkManager;
  }

  #processAllNodes() {
    this.#networkManager.build("home");
    let map = this.#networkManager.getMap();
    return map.children;
  }

  #flattenNetwork() {
    let allNodes = this.#processAllNodes();
    let workingNodes = [];

    allNodes?.forEach((node) => {
      this.#getCompromisedNode(node, workingNodes);
    });

    if (workingNodes?.length > 0) {
      if (workingNodes?.length > 1) {
        // TODO: Introduce sorting later
        this.#flatNetwork = [...workingNodes];
      } else {
        this.#flatNetwork = [...workingNodes];
      }
    } else {
      this.#flatNetwork = [];
    }
  }

  #getCompromisedNode(node, flatNodeList) {
    if (!node) {
      return;
    }

    if (this.#configuration.exclusions.some(item => item == node.current.name())) {
        return;
    }

    if (this.#configuration.prefixExclusions.find(item => node.current.name().startsWith(item))) {
        return;
    }

    if (node.canHack(this.#ns.getPlayer().skills.hacking)) {
        flatNodeList.push(node.current);
    }

    node.children.forEach((child) => {
      this.#getCompromisedNode(child, flatNodeList);
    });
  }

  startScan() {
    this.#flattenNetwork();
  }

  async startHack() {
    while (true) {
        let currentNodeCount = this.#flatNetwork.length;
        this.startScan();

        if (currentNodeCount != this.#flatNetwork.length) {
            if (this.#allScripts.length > 0) {
               this.#allScripts.forEach(scriptId => {
                this.#ns.kill(scriptId);
               });

               this.#allScripts = [];
            }

            this.#flatNetwork.forEach(node => {
                this.#allScripts.push(this.#ns.run('hack-n-grow.js', 200, node.name()));
            });
        }

        await this.#ns.asleep(3000);
    }
  }
}

export class HackManagerConfiguration {
  exclusions = [];
  prefixExclusions = [];

  constructor() {
    this.exclusions = [];
    this.prefixExclusions = [];
  }

}
