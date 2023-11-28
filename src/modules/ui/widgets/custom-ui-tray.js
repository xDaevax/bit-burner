import { BaseElement } from 'modules/ui/components/base-element';
import { Liner } from 'modules/ui/components/liner';
import { Container } from 'modules/ui/components/container';
import { LinerOptions } from 'modules/ui/components/liner';
import { StyleMessage } from 'services/style-service';
import { Capability } from 'models/capability';

/**
 * Type used to display a custom UI for launching additional UI enhancements.
 */
export class CustomUITray extends BaseElement {
    #styleService;
    #uiOptions;
    #state = [];
    #augmentations;

    /**
     * Initializes a new instance of the CustomUITray class.
     * @param {Document} dom The Document instance used to interact with the DOM.
     * @param {StyleService} styleService The StyleService instance used to push style updates to the DOM.
     * @param {CustomUITrayOptions} uiOptions The options used to customize the UI tray.
     */
    constructor(dom, styleService, uiOptions, augmentations) {
        super(dom);
        this.#styleService = styleService;
        this.#uiOptions = uiOptions;
        this.#augmentations = augmentations;
    } // end constructor

    #setupStyles() {
        const styles = `
            .max-10 {
                max-width: 10vw;
            }

            .cui-font-color {
                color: rgb(204, 204, 174);
                font-family: "Lucida Console", "Lucida Sans Unicode", "Fira Mono", Consolas, "Courier New", Courier, monospace, "Times New Roman";
            }
        `;

        const message = new StyleMessage();
        message.title = 'ui-tray';
        message.contents = styles;

        this.#styleService.setStyle(message);
    }

    #initUIAugments() {
        if (this.#uiOptions?.scripts?.length > 0) {
            this.#uiOptions.scripts.forEach(script => {
                let newState = new AugmentState();
                newState.sourceFile = script;
                newState.enabled = false;

                this.#state.push(newState);
            });
        }
    }

    #createOptions() {
        let options = new LinerOptions();
        options.id = 'ui-utilities-liner';
        options.children.push('test');
        options.cssClasses.push('max-10');
        options.cssClasses.push('text-normal');
        options.allowClose = true;
        options.allowExpand = true;
        return options;
    }

    /**
     * 
     * @param {string} id The unique identifier of the element.
     * @param {Array<Capability>} capabilities The set of capabilities of the current game. 
     */
    create(id, capabilities) {
        this.#setupStyles();
        this.#initUIAugments();
        let options = this.#createOptions();
        let uiCapabilities = this.createNode('ul');
        uiCapabilities.cssClasses = 'toggle-handle';
        
        if (capabilities && capabilities.length > 0) {
            capabilities.forEach(item => {
                let lineItem = this.createNode('li');
                lineItem.textContent = `${item.name}: ${item.value}`;

                uiCapabilities.appendChild(lineItem);
            });
        }

        let augmentationControls = Object.keys(this.#augmentations ?? {})?.map(item => item()?.initialize()); // TODO: write an initialize method to create the HTML node to return for each augmentation.
        let augmentationMenu = new Liner(this.getDom(), { });

        options.children.push(uiCapabilities);

        let liner = new Liner(this.getDom(), options);
        let container = new Container(this.getDom(), { id: id, content: liner.create(), expandable: options.allowExpand, closable: options.allowClose });

        container.render('Interface Utilities');
    } // end function create

    render(id, capabilities) {
        this.getDom().getElementsByTagName('body')[0].append(this.create(id, capabilities));
    } // end function render
} // end class CustomUITray

class AugmentState {
    enabled = false;
    id = '';
    sourceFile = '';
}

export class CustomUITrayOptions {
    scripts = [];

    constructor() {

    }
}