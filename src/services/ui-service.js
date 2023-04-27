
export class UIService {
    #dom;
    #sleep;
    #manager;
    dispose = false;

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