import {Container} from 'modules/ui/container.js';

/** @param {NS} ns */
export async function main(ns) {
	let c = new Container('test-ui', eval('document'));
	c.render(ns.args[0]);
}