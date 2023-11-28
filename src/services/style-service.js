export class StyleService {
    #ns;
    #dom;
    #portService;
    static #channelName = 'style-channel';

    dispose = false;

    constructor(ns, dom, portService) {
        this.#ns = ns;
        this.#dom = dom;
        this.#portService = portService;
        (async () => await this.#listen())();
    }

    async #listen() {
        try {
            this.#portService.findHandle(StyleService.#channelName);
        } catch (e) {
            this.#portService.register(StyleService.#channelName);
        }

        while (!this.dispose) {
            let stylePort = this.#getPort(StyleService.#channelName);

            if (!stylePort?.empty()) {
                let stylesheets = [];

                for (let i = 0; i < this.#dom.styleSheets.length; i++) {
                    let currentSheet = this.#dom.styleSheets[i];

                    if (currentSheet?.title?.length > 0) {
                        stylesheets.push(currentSheet);
                    }
                }

                while (!stylePort.empty()) {
                    let updatedStyle = new StyleMessage();
                    updatedStyle = JSON.parse(stylePort.read());

                    let matchingStyle = stylesheets.find(match => match.title === updatedStyle.title);

                    if (matchingStyle) {
                        this.#dom.getElementById(matchingStyle.ownerNode.id).innerHTML = updatedStyle.contents;
                    } else {
                        let newStyle = this.#dom.createElement('style');
                        newStyle.setAttribute('type', 'text/css');
                        newStyle.setAttribute('title', updatedStyle.title);
                        newStyle.id = updatedStyle.title;
                        newStyle.innerHTML = updatedStyle.contents;
                        this.#dom.getElementsByTagName('head')[0].append(newStyle);
                    }
                }
            }

            await this.#ns.asleep(1000);
        }
    }

    /**
     * Returns a port that can be written to or read from.
     * @param {string} name The name of the port
     * @returns {NetscriptPort} The port handle used to perform port operations.
     */
    #getPort(name) {
        let targetPort = this.#ns.getPortHandle(this.#portService.findHandle(name));

        return targetPort;
    } // end function getPort

    /**
     * Applies a style to the head.
     * @param {StyleMessage} style The style to apply.  If the style does not already exist, it will be added, otherwise it will be updated.
     */
    setStyle(style) {
        let stylePort = this.#getPort(StyleService.#channelName);

        stylePort.write(JSON.stringify(style));
    } // end function setStyle
} // end class StyleService

/**
 * Type used to update styles in the head.  Create new instances of this type and send them to the style port for registration.
 */
export class StyleMessage {
    title = '';
    contents = '';

    /**
     * Initializes a new instance of the StyleMessage class.
     */
    constructor() {
    } // end constructor
} // end class StyleMessage