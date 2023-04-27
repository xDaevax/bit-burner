import { BaseElement } from 'modules/ui/components/base-element';
import { Liner } from 'modules/ui/components/liner';
import { Container } from 'modules/ui/components/container';
import { LinerOptions } from 'modules/ui/components/liner';
import { StyleMessage } from 'services/style-service';

/**
 * Type used to display a custom UI for launching additional UI enhancements.
 */
export class CustomUITray extends BaseElement {
    #styleService;
    #uiOptions;
    #state = [];

    /**
     * Initializes a new instance of the CustomUITray class.
     * @param {Document} dom The Document instance used to interact with the DOM.
     * @param {StyleService} styleService The StyleService instance used to push style updates to the DOM.
     * @param {CustomUITrayOptions} uiOptions The options used to customize the UI tray.
     */
    constructor(dom, styleService, uiOptions) {
        super(dom);
        this.#styleService = styleService;
        this.#uiOptions = uiOptions;
    } // end constructor

    #setupStyles() {
        const styles = `
            .max-10 {
                max-width: 10vw;
                color: white;
            }
        `;

        const message = new StyleMessage();
        message.title = 'ui-tray';
        message.contents = styles;

        this.#styleService.setStyle(message);
    }

    #initUIAugments() {
        if (this.#uiOptions.scripts.length > 0) {
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
        return options;
    }

    create(id) {
        this.#setupStyles();
        this.#initUIAugments();
        let options = this.#createOptions();
        let liner = new Liner(this.getDom(), options);
        let container = new Container(this.getDom(), { id: id, content: liner.create() });

        container.render('Interface Utilities');
    } // end function create

    render(id) {
        this.getDom().getElementsByTagName('body')[0].append(this.create(id));
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