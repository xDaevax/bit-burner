import { BaseElement } from 'modules/ui/components/base-element.js';

/**
 * Type used to render a UI button.
 */
export class Button extends BaseElement {
    #options = {};

    /**
     * Initializes a new instance of the Button class
     * @param {Document} dom The document instance used to interact with the DOM.
     * @param {ButtonOptions} options The set of options used to configure the button. 
     */
    constructor(dom, options) {
        super(dom);

        if (options) {
            this.#options = options;
        } else {
            this.#options = new ButtonOptions();
        }
    } // end constructor

    /**
     * Creates a button node.
     * @returns {HTMLElement} A new button.
     */
    create() {
        const node = this.createNode('button');

        if (this.#options.cssClasses?.length > 0) {
            node.classList.add(...this.#options.cssClasses);
        }

        node.value = this.#options.displayText;
        node.onclick = this.#options.click;

        return node;
    } // end function create

    /**
     * Renders the button to the DOM on the given parent (if any) or at the root of the DOM if none is specified.
     * @param {HtmlElement} parent The parent node to add the button to.
     */
    render(parent) {
        if (parent) {
            parent.append(this.create());
        } else {
            this.getDom().getElementsByTagName('body')[0].append(this.create());
        }
    } // end function render
} // end class Button

/**
 * Options used to configure a button.
 */
export class ButtonOptions {
    displayText = '';
    cssClasses = [];
    click = (e) => { };
} // end class ButtonOptions