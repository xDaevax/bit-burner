import { BaseElement } from 'modules/ui/components/base-element.js';

export class ModalOptions {
    showClose = false;
    draggable = false;
    content = null;
    closeAction = () => {};
    domReference = null;
    nsReference = null;
}
/**
 * Type used to display a modal window / dialog.
 */
export class Modal extends BaseElement {
    #ns = null;
    
    constructor(ns, dom) {
        super(dom);
        this.#ns = ns;
    }

    create() {

    }

    /**
     * Creates a modal window with the given options.
     * @param {ModalOptions} options 
     */
    static show(options) {
        let modal = new Modal(options.nsReference, options.domReference);

        options.domReference.append(modal.create());
    } // end function show
} // end class Modal