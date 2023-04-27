/**
 * Base class for types that represent UI components.
 */
export class BaseElement {
	#dom = null;

	/**
	 * Initializes a new instance of the BaseElement class.
	 * @param {Document} dom The DOM instance used to create elements.
	 */
	constructor(dom) {
		this.#dom = dom;
	} // end constructor

	/**
	 * Finds an element based on it's ID.
	 * @param {string} id The unique identifier of the node to find.
	 */
	findElementById(id) {
		return this.#dom.getElementById(id);
	} // end function findElementById

	getDom() {
		return this.#dom;
	} // end function getDom

	/**
	 * Attempts to locate a DOM element whose class matches the given name.  If the parent is given, the search is only performed on children of the parent.
	 * @param {HTMLElement} parent The parent node to search in (if any).  Leave blank to search the whole DOM.
	 * @param {string} name The CSS class name to search for.
	 * @returns {HTMLElement} The elements matching the given inputs.
	 */
	findElementsByClassName(parent, name) {
		if (parent) {
			return parent.getElementsByClassName(name);
		}

		return this.#dom.getElementsByClassName(name);
	} // end function findElementsByClassName

	/**
	 * Creates a new DOM node with the given element name.
	 * @param {string} name The name of the HTML element to create.
	 * @returns {HTMLElement} The new element.
	 */
	createNode(name) {
		return this.#dom.createElement(name);
	} // end function createNode
} // end class BaseElement