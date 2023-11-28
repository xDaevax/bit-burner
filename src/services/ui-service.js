import { UIManager } from "managers/ui-manager";

/**
 * Service type that handles primary user interface logic.
 */
export class UIService {
    /**
     * @returns {Document}
     */
    #dom;
    #sleep;
    /**
     * @returns {UIManager}
     */
    #manager;
    dispose = false;

    /**
     * 
     * @param {Document} dom 
     * @param {*} sleep 
     * @param {UIManager} uiManager The manager for the user interface that handles low level UI calls.
     */
    constructor(dom, sleep, uiManager) {
        this.#dom = dom;
        this.#sleep = sleep;
        this.#manager = uiManager;
        (async () => await this.#initialize())();
    }

    async #initialize() {
        while(!this.dispose) {
            await this.#sleep(1000);
            this.#manager.display();
        }
    }
}