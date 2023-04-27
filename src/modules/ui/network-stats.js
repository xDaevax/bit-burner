import { BaseElement } from 'modules/ui/components/base-element.js';

/** @param {NS} ns */
export async function main(ns) {

}

/**
 * Type that is used to build a UI for displaying network node stats.
 */
export class NetworkStats extends BaseElement {
	#refreshFunction = (data) => {};
	#node = null;

	/**
	 * Initializes a new instance of the NetworkStats class.
	 * @param {document} dom The DOM instance used to create elements.
	 * @param {NetworkMap} node The NetworkMap instance with details about the node.
	 * @param {Function} refreshFunction The function used to load updated stats for the node.
	 */
	constructor(dom, node, refreshFunction) {
		super(dom);
		this.#node = node;

		if (refreshFunction) {
			this.#refreshFunction = refreshFunction;
		}
	}

	/**
	 * Updates the data for the node.
	 */
	refreshData() {
		this.#refreshFunction(this.#node);
	}

	/**
	 * Creates the DOM node.
	 */
	create() {
		let node = this.createNode('div');
		node.classList.add('stats');
		let title = this.createNode('h4');
		title.textContent = 'Stats';
		node.append(title);
		
		return node;
	} // end function create
} // end class NetworkStats