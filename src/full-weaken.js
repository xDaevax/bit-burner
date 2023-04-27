/** @param {NS} ns */
export async function main(ns) {
	ns.print(`Attempting to weaken host, ${ns.args[0]}, to minimum level.`);

	let currentSecurity = ns.getServerSecurityLevel(ns.args[0]);
	let minSecurity = ns.getServerMinSecurityLevel(ns.args[0]);

	ns.print(`Host: ${ns.args[0]}, has a minimum security of : ${minSecurity}.  Current level: ${currentSecurity}`);
	ns.toast(`Starting weakening on '${ns.args[0]}'.`, 'info');

	while (currentSecurity > minSecurity) {
		await ns.weaken(ns.args[0]);
		currentSecurity = ns.getServerSecurityLevel(ns.args[0]);
		ns.toast(`${ns.args[0]} lowered to ${currentSecurity}.  Next weaken in ${ns.getWeakenTime()}.`, 'info', 5000);
	}

	ns.toast(`Completed weakening for '${ns.args[0]}'.`, 'success');
}