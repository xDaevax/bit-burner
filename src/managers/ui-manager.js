import { CustomUITray } from 'modules/ui/widgets/custom-ui-tray';
import { StyleService } from 'services/style-service';
import { CapabilityLoader } from 'sys/capability-loader';

/**
 * Manager that controls custom user interface elements and provides configuration for which are enabled, styling, and other customizations.
 */
export class UIManager {
    /**
     * @returns {Document}
     */
    #dom;
    /**
     * @returns {StyleService}
     */
    #styleService;
    /**
     * @returns {CapabilityLoader}
     */
    #capabilityLoader;
    static #id = 'ui-manager';
    #augmentations;

    // TODO: Setup a "base" menu system that runs other UI augmentations / menu customizations.

    /**
     * Initializes a new instance of the UIManager class.
     * @param {Document} dom The document instance used to interact with the DOM.
     * @param {StyleService} styleService The style service instance used to push new styles to the UI.
     * @param {CapabilityLoader} capabilityLoader The capability loader used to obtain information about the current game progress.
     * @param {any} augmentations The augmentations to be applied
     */
    constructor(dom, styleService, capabilityLoader, augmentations) {
        this.#dom = dom;
        this.#styleService = styleService;
        this.#capabilityLoader = capabilityLoader;
        this.#augmentations = augmentations;
    } // end constructor

    /**
     * Renders the custom UI tray (if it is not already).
     */
    display() {
        if (!this.isPresent()) {
            const element = new CustomUITray(this.#dom, this.#styleService, this.#augmentations);

            element.render(UIManager.#id, this.#capabilityLoader.loadCapabilities());
        }
    } // end function display

    /**
     * Determines whether the custom UI tray has already been applied to the DOM.
     * @returns the DOM node for the custom UI tray, or null if the DOM node has not been added yet.
     */
    isPresent() {
        return this.#dom.getElementById(UIManager.#id);
    } // end function isPresent
}