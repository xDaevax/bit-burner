import { BaseElement } from 'modules/ui/components/base-element.js';
import { StyleMessage } from 'services/style-service.js';

/**
 * Component that renders a modal background, disabling background interaction for the modal.
 */
export class ModalBg extends BaseElement {
    #styleService;

    constructor(dom, styleService) {
        super(dom);
        this.#styleService = styleService;
    } // end constructor

    /**
     * Creates a liner node.
     * @returns {HTMLElement} A new liner.
     */
    create() {
        const modalBgStyles = `
            .modal-bg {
                display: block;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                background-color: rgba(0, 0, 0, 0.6);
                position: absolute;
                top: 0px;
                left: 0px;
                z-index: 50000; /* Ensure top */
            }
        `;

        const message = new StyleMessage();
        message.title = 'modal-bg';
        message.contents = modalBgStyles;

        this.#styleService.setStyle(message);

        const element = this.createNode('div');

        element.classList.add('modal-bg');
        element.id = 'custom-modal-bg';

        return element;
    } // end function create

    /**
     * Renders the modal at the root of the DOM if none is specified to overlay all other UI elements.
     */
    render() {
        this.getDom().getElementsByClassName('body')[0].append(this.create());
    } // end function render
} // end class ModalBg