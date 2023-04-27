/** @param {NS} ns */
export async function main(ns) {
	let files = [
		'/managers/network-manager.js',
		'/models/network-map.js',
		'/models/network-node.js',
		'hack-n-grow.js',
		'full-weaken.js',
		'weaken-all.js',
		'hack-n-grow-all.js',
        'bulk-hack.js'
	];

	files.forEach(file => {
		ns.scp(file, ns.args[0]);
		ns.tprint(`copied ${file} to ${ns.args[0]}`);
	});

	ns.tprint('done');
}