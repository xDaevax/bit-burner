import { BaseElement } from 'modules/ui/components/base-element.js';

/**
 * Type that represents a UI Network Header.
 */
export class NetworkHeader extends BaseElement {
	displayText = '';

	/**
	 * Initializes a new instance of the NetworkHeader class.
	 * @param {Document} dom The dom node used to create elements.
	 */
	constructor(dom) {
		super(dom);
	}

	/**
	 * Builds the DOM element for the network header.
	 * @returns {HTMLElement} An HTML element that can be rendered.
	 */
	create() {
		const element = this.createNode('div');
		element.classList.add('overview');
		const nodetitle = this.createNode('h3');
		nodetitle.classList.add('node-title');
		nodetitle.classList.add('border-bottom');
		nodetitle.textContent = this.displayText;

		element.append(nodetitle);

		return element;
	}
}