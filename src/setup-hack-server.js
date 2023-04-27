/** @param {NS} ns */
export async function main(ns) {
    ns.run('buy-server.js', 1, ns.args[0]); // Buy the server with the given name
    await ns.sleep(500);
    let serverExists = false;

    try {
        serverExists = ns.getServer(ns.args[0]);
    } catch (err) {
        ns.tprint(err);
    }

    await ns.sleep(500);

    if (serverExists) {
        ns.run('copy-hacks.js', 1, ns.args[0]); // Setup new scripts
        let copyComplete = false;

        while (!copyComplete) {
            await ns.asleep(500);

            if (!ns.scriptRunning('copy-hacks.js', 'home')) {
                copyComplete = true;
            }
        }

        ns.exec(ns.args[1], ns.args[0], 1, ns.args[2]);
    } else {
        ns.tprint(`Not enough funds to buy ${ns.args[0]}.`);
    }
}