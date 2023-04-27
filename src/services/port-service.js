export class PortService {
    #ports = {};
    
    constructor() {

    }

    register(portName) {
        if (this.#ports[portName]) {
            throw new Error(`The port name: [${portName}], has already been registered.`);
        }

        this.#ports[portName] = this.#findNextNumber();
    }

    findHandle(portName) {
        if (this.#ports[portName] != undefined && this.#ports[portName] !== null) {
            return this.#ports[portName];
        }

        throw Error(`No registered port found for: [${portName}].`);
    }

    #findNextNumber() {
        let allKeys = Object.keys(this.#ports);

        if (allKeys && allKeys.length > 0) {
            let largestNumber = allKeys.map(item => this.#ports[item]).sort().reverse()[0];

            return largestNumber + 1;
        } else {
            return 1;
        }
    }
}