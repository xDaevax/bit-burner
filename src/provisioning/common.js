/**
 * @param {NS} sys The primary NetScript handle
 */
export function Common() {
	const self = {};
	self.sys = {};

	class Player {
		constructor() {

		}

		hackLevel() {
			return self.sys.getHackingLevel();
		}
	}

	let player = new Player();

	class Servers {
		#serverList = [];

		constructor() {
			this.#serverList = [];
		}

		initialize() {
			console.log(self);
			self.sys.scan().forEach(server => {
				this.#serverList.push(server);
			});
		}

		canHack(server) {
			console.log(this);
			return self.sys.getServerRequiredHackingLevel(server) <= player.hackLevel();
		}
	}

	let servers = new Servers();

	let Init = function (ns) {
		self.sys = ns;
		servers.initialize();
	};

	return {
		servers: servers,
		player: player,
		init: Init
	};
};