/** @param {NS} ns */
export async function main(ns) {
	
	if (!ns.args[0] || ns.args[0] === '') {
		throw Error('No host provided to weaken');
	}

	ns.print(`Attempting to weaken target to ${ns.args[1]}.`);

	await waitUntil(() => {
		if (ns.getServerSecurityLevel() <= ns.args[1] || ns.getServerSecurityLevel() <= ns.getServerMinSecurityLevel()) {
			return true;
		}

		return false;
	});
}

async function waitUntil(ns, condition) {
  return await new Promise(resolve => {
    const interval = setInterval(async () => {
		ns.print(`Weakening target: '${ns.args[0]}'`);
		let weakenResult = await ns.weaken(ns.args[0]);

		ns.print(weakenResult);

		if (ns.getServerSecurityLevel() <= ns.args[1]) {
			ns.print('Target security level reached.');
		}

		if (ns.getServerSecurityLevel() <= ns.getServerMinSecurityLevel()) {
			ns.print('Cannot set security level lower than minimum.  Exiting.');
		}

      if (condition) {
        clearInterval(interval);
	  }

	  resolve('done');      
    }, 1000);
	resolve('done');
  });
}