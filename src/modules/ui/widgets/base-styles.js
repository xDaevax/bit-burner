import { StyleMessage, StyleService } from "services/style-service";

export class BaseStyles {
    /**
     * @returns {StyleService}
     */
    #styleService;

    /**
     * 
     * @param {StyleService} styleService The StyleService instance used to push style updates to the DOM.
     */
    constructor(styleService) {
        this.#styleService = styleService;
    }

    initStyles() {
        const message = new StyleMessage();
        const styles = `
        /* Borders and Dividers */
        .border-bottom {
            border-bottom: solid 1px rgb(68, 68, 68);
        }

        .border-left {
            border-left: solid 1px rgb(68, 68, 68);
        }

        .border-right {
            border-right: solid 1px rgb(68, 68, 68);
        }
        
        .rounded {
            border-radius: 0.3rem;
            padding: 0.3rem;
        }

        /* Sizing and layout */
        .width-100 {
            width: 100%;
        }
        
        .toggle:before,
        .toggled:before,
        .toggle:before,
        .toggled:before {
            content: "\\29E8";
        }

        .liner {
            color: rgb(200, 200, 180);
        }

        .text-normal {
            font-family: Verdana, arial, sans-serif;
        }

        button.custom-ui {
            background-color: transparent;
            width: 20px;
            height: 20px;
        }

        .toggled {
            transform: rotate(-90deg);
            transition: transform 0.3s ease-in-out;
		}
        
        .toggle {
            transform: rotate(0deg);
            transition: transform 0.3s ease-in-out;
        }

        .collapsable {
            transition: all 0.3s ease-in-out;
        }

        .collapsed {
            height: 0px;
            opacity: 0;
            display: block;
            transition: all 0.3s ease-in-out;
        }
        `;
        message.title = 'base-styles';
        message.contents = styles;

        this.#styleService.setStyle(message);
    }
}