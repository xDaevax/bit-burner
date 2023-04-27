/** @param {NS} ns */
export async function main(ns) {
}

/**
 * Represents a node on the network
 */
export class NetworkNode {
	#name = '';
	#ipAddress = '';
	#cores = 0;
	#ram = 0;
	#hasBackdoor = false;
	#hasRoot = false;
	#minHackLevel = 0;
	#availableMoney = 0;
	#securityLevel = 0;
	#numPortsRequired = 0;
	#ramUsed = 0;
	#ports = [];

	/**
	 * Initializes a new instance of the NetworkNode class.
	 * @param {any} options The options used to configure defaults on the Network Node.
	 */
	constructor(options) {
		if (options) {
			this.#name = options.name;
			this.#ipAddress = options.ip;
			this.#cores = options.cores;
			this.#ram = options.ram;
			this.#hasBackdoor = options.hasBackdoor;
			this.#hasRoot = options.hasRoot;
			this.#minHackLevel = options.hackLevel;
			this.#availableMoney = options.availableMoney;
			this.#securityLevel = options.securityLevel;
			this.#numPortsRequired = options.numPortsRequired;
			this.#ramUsed = options.ramUsed;
			this.#ports.push(new NetworkPort('SSH', 22, false));
			this.#ports.push(new NetworkPort('FTP', 21, false));
			this.#ports.push(new NetworkPort('SMTP', 25, false));
			this.#ports.push(new NetworkPort('HTTP', 80, false));
			this.#ports.push(new NetworkPort('SQL', 1433, false));
		}
	} // end constructor

	/**
	 * Returns the total amount of available money.
	 */
	availableMoney() {
		return this.#availableMoney;
	} // end function availableMoney

	/**
	 * Returns the number of cores available on the node.
	 */
	cores() {
		return this.#cores;
	} // end function cores

	/**
	 * Returns a value indicating whether a backdoor is installed on the node.
	 */
	hasBackdoor() {
		return this.#hasBackdoor;
	} // end function hasBackdoor

	/**
	 * Returns a value indicating whether root access is available on the node.
	 */
	hasRoot() {
		return this.#hasRoot;
	} // end function hasRoot
	
	/**
	 * 
	 * @returns {Number} The current security level of the server.
	 */
	securityLevel() {
		return this.#securityLevel;
	} // end function securityLevel

	/**
	 * 
	 * @returns {Number} The number of ports that need to be opened to NUKE.
	 */
	numPortsRequired() {
		return this.#numPortsRequired;
	} // end function numPortsRequired

	/**
	 * Returns the IP address of the node.
	 */
	ipAddress() {
		return this.#ipAddress;
	} // end function ipAddress

	minHackLevel() {
		return this.#minHackLevel;
	} // end function minHackLevel

	/**
	 * Returns the name / host name of the node.
	 */
	name() {
		return this.#name;
	} // end function name

	/**
	 * Sets the state of the port whose name matches the given name.
	 * @param {string} name The name of the port state to change.
	 * @param {boolean} state True to show the port as opened; false otherwise.
	 */
	setPortState(name, state) {
		for(let i = 0; i < this.#ports.length; i++) {
			if (this.#ports[i].name() === name) {
				this.#ports[i].state = state;
			}
		}
	} // end function setPortState

	/**
	 * Returns a collection of the ports and their respective states on this node.
	 */
	ports() {
		return this.#ports;
	} // end function ports

	/**
	 * Returns the amount of ram available on the node.
	 */
	ram() {
		return this.#ram;
	} // end function ram

	/**
	 * The RAM currently in use on the node.
	 * @returns A number representing the used RAM.
	 */
	ramUsed() {
		return this.#ramUsed;
	} // end function ramUsed
} // end class NetworkNode

/**
 * Represents a port on a network node.
 */
export class NetworkPort {
	#name = '';
	#number = 0;
	state = false;

	/**
	 * Creates a new instance of the NetworkPort class.
	 * @param {string} name The name of the port.
	 * @param {number} portNumber The port number of the network port.
	 * @param {boolean} isOpen True to indicate the port is open; false otherwise.
	 */
	constructor(name, portNumber, isOpen) {
		this.#name = name;
		this.#number = portNumber;
		this.state = isOpen;
	} // end constructor
	
	/**
	 * Returns the name of the port.
	 */
	name() {
		return this.#name;
	} // end function name

	/**
	 * Returns the port number of the network port.
	 */
	number() {
		return this.#number;
	} // end function number
} // end class NetworkPort