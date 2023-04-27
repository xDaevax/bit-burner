/** @param {NS} ns */
export async function main(ns) {
    const ops = {
        hackNGrow: 'hack-n-grow-all.js',
        weaken: 'weaken-all.js'
    };

    const options = {
        operation: ops[ns.args[0]],
    };

	runHacks(ns, options);	
}

function runHacks(ns, options) {
    ns.tprint(options);

    ns.run(options.operation, 1);
}