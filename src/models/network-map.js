import { NetworkNode } from 'models/network-node.js';

/**
 * Represents a map of the network.
 */
export class NetworkMap {
	current = null;
	children = [];

	/**
	 * Initializes a new instance of the NetworkMap class.
	 */
	constructor() {
		this.current = new NetworkNode({});
		this.children = [];
	} // end constructor

	/**
	 * Adds a new network node to the map.
	 * @param {NetworkNode} node The network node to add to the map.
	 */
	addNode(node) {
		this.children.push(node);
	} // end function addNode

	/**
	 * Returns a value indicating whether the map has any children.
	 * @returns true if there are any nodes in the map; false otherwise.
	 */
	hasChildren() {
		return this.children?.length > 0 ?? false;
	} // end function hasChildren

	/**
	 * Determines whether a node or child of a node in the given tree of nodes is vulnerable against the given hack level.
	 * @param {Number} hackLevel The player's current hack level or level to check against.
	 * @param {NetworkNode} node The Network Node instance to check, or null to check the entire node map. 
	 * @returns true if one of the nodes has a miminum hack skill that is less than the given hack level.
	 */
	hasVulnerableNode(hackLevel, node = null) {
		let workingNode = null;

		if (node == null) {
			workingNode = this;
		} else {
			workingNode = node;
		}

		let childVulnerable = false;

		if (workingNode.length > 0) {
			for (let i = 0; i < workingNode.length; i++) {
				if (workingNode[i].hasVulnerableNode(hackLevel)) {
					childVulnerable = true;
					break;
				}
			}
		}

		return childVulnerable || (this.current.minHackLevel() <= hackLevel && !this.current.hasRoot());
	} // end function hasVulnerableNode
} // end class NetworkMap