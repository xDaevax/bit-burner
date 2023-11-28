import { BaseElement } from 'modules/ui/components/base-element.js';

/**
 * Type used to render a UI Liner that adds margin.
 */
export class Liner extends BaseElement {
    #options;

    /**
     * Initializes a new instance of the Liner class.
     * @param {Document} dom The document instance used to interact with the DOM.
     * @param {LinerOptions} options The set of options used to configure the liner and any children.
     */
    constructor(dom, options) {
        super(dom);

        if (options) {
            this.#options = options;
        } else {
            this.#options = new LinerOptions();
        }
    } // end constructor

    /**
     * Creates a liner node.
     * @returns {HTMLElement} A new liner.
     */
    create() {
        const node = this.createNode('div');

        if (this.#options.cssClasses?.length > 0) {
            node.classList.add(...this.#options.cssClasses);
        }

        if (node.className.indexOf('liner') < 0) {
            node.classList.add('liner');
        }

        if (this.#options.children?.length > 0) {
            this.#options.children.forEach(child => {
                node.append(child);
            });
        }

        if (this.#options.id) {
            node.id = this.#options.id;
        }

        return node;
    } // end function create

    /**
     * Renders the liner to the DOM on the given parent (if any) or at the root of the DOM if none is specified.
     * @param {HtmlElement} parent The parent node to add the liner to.
     */
    render(parent) {
        if (parent) {
            parent.append(this.create());
        } else {
            this.getDom().append(this.create());
        }
    } // end function render
} // end class Liner

/**
 * Options used to configure a liner.
 */
export class LinerOptions {
    cssClasses = [];
    children = [];
    allowClose = false;
    allowExpand = false;
    id = null;
} // end class LinerOptions