import { BaseElement } from 'modules/ui/components/base-element';

/**
 * Type used to render an SVG graphic.
 */
export class SVG extends BaseElement {
    #options = {};

    /**
     * Initializes a new instance of the SVG class
     * @param {Document} dom The document instance used to interact with the DOM.
     * @param {SVGOptions} options The set of options used to configure the SVG. 
     */
    constructor(dom, options) {
        super(dom);

        if (options) {
            this.#options = options;
        } else {
            this.#options = new SVGOptions();
        }
    } // end constructor

    /**
     * Creates an SVG node.
     * @returns {HTMLElement} A new SVG.
     */
    create() {
        const node = this.createNodeNS('http://www.w3.org/2000/svg', 'svg');

        if (this.#options.cssClasses?.length > 0) {
            node.classList.add(...this.#options.cssClasses);
        }

        node.classList.add('custom-svg');

        let pathData = this.createNodeNS('http://www.w3.org/2000/svg', 'path');
        pathData.setAttribute('d', this.#options.pathData);
        node.append(pathData);
        node.onclick = this.#options.click;

        return node;
    } // end function create

    /**
     * Renders the SVG to the DOM on the given parent (if any) or at the root of the DOM if none is specified.
     * @param {HtmlElement} parent The parent node to add the SVG to.
     */
    render(parent) {
        if (parent) {
            parent.append(this.create());
        } else {
            this.getDom().getElementsByTagName('body')[0].append(this.create());
        }
    } // end function render
} // end class SVG

/**
 * Options used to configure an SVG.
 */
export class SVGOptions {
    pathData = '';
    cssClasses = [];
    click = (e) => { };
} // end class SVGOptions