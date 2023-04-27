import { NetworkMap } from 'models/network-map.js';
import { NetworkNode } from 'models/network-node.js';
import { NetworkHeader } from 'modules/ui/network-header.js';
import { NodeStats } from 'modules/ui/node-stats.js';
import { NodeCommands } from 'modules/ui/node-commands.js';
import { BaseElement } from 'modules/ui/components/base-element.js';

export class NetworkVisualizer extends BaseElement {
	#ns = null;
	#nodesToUpdate = null;

	constructor(dom, ns) {
		super(dom);
		this.#ns = ns;
	}

	createStyle() {
		let existingStyle = this.findElementById('network-styles');

		if (existingStyle) {
			existingStyle.remove();
		}

		let css = `
			/* DOM Styling */
			body {
				background-color: black;
				color: rgb(200, 200, 180);
				font-family: Verdana, arial, sans-serif;
			}

			a {
				text-decoration: none;
				color: rgb(200, 200, 180);
			}

			h5 {
				margin: 0.2rem;
			}

			/* Borders and Dividers */
			.border-bottom {
				border-bottom: solid 1px rgb(68, 68, 68);
			}

			.border-left {
				border-left: solid 1px rgb(68, 68, 68);
			}

			.border-right {
				border-right: solid 1px rgb(68, 68, 68);
			}

			.rounded {
				border-radius: 0.3rem;
				padding: 0.3rem;
			}

			/* Sizing and layout */
			.width-100 {
				width: 100%;
			}

			/* Containers - In order of use */

			.node-list {
				display: block;
				overflow-y: scroll;
				max-height: 100vh;
				overflow-x: hidden;
				padding: 0.4rem;
				max-width: 70vw;
			}

			.node-wrapper {
				display: grid;
				grid-template-columns: 45% 45%;
				grid-column-gap: 5%;
				color: rgb(200, 200, 180);
				align-content: flex-start;
			}

			.node-wrapper>* {
				border: solid 0.5px rgb(200, 200, 180);
				border-radius: 0.1rem;
				padding: 0.3rem;
				margin: auto;
				width: 100%;
				background-color: rgb(30, 30, 30);
			}

			.content-liner .scripts,
			.content-liner .executables {
				width: 45%;
			}

			.commands,
			.stats {
				overflow: hidden;
			}

			.node-children h4,
			.node-wrapper h4 {
				display: flex;
				align-self: center;
				align-items: center;
				align-content: center;
				justify-content: space-between;
			}

			.node-wrapper h4 {
				margin-top: 0.1rem;
				padding-bottom: 0.4rem;
				margin-right: -0.3rem;
				margin-left: -0.3rem;
				padding-left: 0.3rem;
				padding-right: 0.3rem;
			}

			.node-wrapper .toggle a:before,
			.node-wrapper .toggled a:before,
			.node-children .toggle a:before,
			.node-children .toggled a:before {
				content: "\\29E8";
			}

			.node-wrapper .toggled,
			.node-children .toggled {
				transform: rotate(-90deg);
				transition: transform 0.3s ease-in-out;
			}

			.node-wrapper .toggle,
			.node-children .toggle {
				transform: rotate(0deg);
				transition: transform 0.3s ease-in-out;
			}

			.contents {
				margin-top: 0px;
				height: auto;
				opacity: 1;
				transition: all 0.3s ease-in-out;
			}

			.commands .contents {
				display: flex;
				flex-direction: row;
			}

			.commands a.nuke:before {
				content: '\\2622';
			}

			.commands a.backdoor:before {
				content: '\\23ce';
			}

			.command-item:before {
				margin-right: 0.1rem;
			}

			.content-liner {
				display: flex;
				flex-direction: row;
				flex-basis: 1;
				flex-wrap: wrap;
				width: 100%;
				justify-content: space-around;
			}

			.stat-item {
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-self: center;
				align-items: center;
				flex-direction: row;
				flex-wrap: wrap;
				flex-basis: 1 1;
				margin-bottom: 0.7rem;
			}

			.stat-item>* {
				display: flex;
			}

			.close {
				height: 0px;
				margin-top: -30px;
				opacity: 0;
				display: block;
				transition: all 0.3s ease-in-out;
			}

			.content-item {
			padding: 0.2rem;
			margin: 0.2rem;
			border-radius: 0.5rem;
			background-color: rgba(255, 255, 255, 0.1);
			cursor: pointer;
			transition: all 0.3s ease-in-out;
			display: inline-block;
			}

			.content-item:hover {
			background-color: rgba(255, 255, 255, 0.2);
			transition: all 0.3s ease-in-out;
			}

			.disabled {
			cursor: default;
			}

			.disabled:hover {
			background-color: rgba(255, 255, 255, 0.1);
			transition: none !important;
			}

			.state:before {
			content: "\\2022";
			margin-right: 0.1rem;
			}

			.green:before {
			color: rgb(100, 200, 100);
			}

			.red:before {
			color: rgb(200, 100, 100);
			}

			.port-status-list {
			list-style-type: none;
			text-indent: 0px;
		}`;

		const styleTag = this.createNode('style');
		styleTag.type = 'text/css';
		styleTag.appendChild(this.getDom().createTextNode(css));
		this.getDom().head.appendChild(styleTag);
	}

	createCommand(command) {
		let element = this.createNode('li');
		element.classList.add('command');

		let link = this.createNode('a');
		link.classList.add('pointer');
		link.textContent = command.text;
		link.onclick = (e) => {
			switch (command.type) {
				case 'exec':
					switch (command.name) {
						case 'NUKE.exe':
							this.#ns.nuke(command.target);
							break;
						case 'FTPCrack.exe':
							this.#ns.ftpcrack(command.target);
							break;
						case 'RelaySMTP.exe':
							this.#ns.relaysmtp(command.target);
							break;
						case 'BruteSSH.exe':
							this.#ns.brutessh(command.target);
							break;
					}

					break;
				case 'run':
					this.#ns.run(command.name, 5, ...command.args);
					break;

			}

		};

		element.append(link);

		return element;
	}

	createNetworkNode(node) {
		const element = this.createNode('div');
		element.classList.add('node');
		let headerNode = new NetworkHeader(this.getDom());
		headerNode.displayText = node.current.name();

		let nodeWrapper = this.createNode('div');
		nodeWrapper.classList.add('node-wrapper');
		let nodeStats = new NodeStats(this.getDom(), this.#ns, node);
		let nodeCommands = new NodeCommands(this.getDom(), this.#ns, node);
		let stats = nodeStats.create();
		nodeCommands.updateNodeStatus = () => {
			stats.refresh();
		};
		element.append(headerNode.create());
		nodeWrapper.append(nodeStats.create());
		nodeWrapper.append(nodeCommands.create());

		element.append(nodeWrapper);
/*
		nodeStats.classList.add('stats');
		let nodeStatsHeader = this.#dom.createElement('h4');
		nodeStatsHeader.textContent = 'Stats';
		let nodeStatsDetails = this.#dom.createElement('ul');
		nodeStatsDetails.append(this.createStat(`Has Root: ${node.current.hasRoot()}`));
		nodeStatsDetails.append(this.createStat(`Has Backdoor: ${node.current.hasBackdoor()}`));
		nodeStatsDetails.append(this.createStat(`# Cores: ${node.current.cores()}`));
		nodeStatsDetails.append(this.createStat(`RAM ${node.current.ram()}`));
		const hackDiff = node.current.minHackLevel() - this.#ns.getHackingLevel();
		nodeStatsDetails.append(this.createStat(`Hack Needed: ${hackDiff <= 0 ? 0 : hackDiff}`));
		nodeStats.append(nodeStatsHeader);
		nodeStats.append(nodeStatsDetails);

		

		let nodeCommandsDetails = this.#dom.createElement('ul');
		nodeCommandsDetails.append(this.createCommand({ type: 'exec', text: 'NUKE', name: 'NUKE.exe', target: node.current.name() }));
		nodeCommandsDetails.append(this.createCommand({ type: 'exec', text: 'BruteSSH', name: 'BruteSSH.exe', target: node.current.name() }));
		nodeCommandsDetails.append(this.createCommand({ type: 'exec', text: 'FTPCrack', name: 'FTPCrack.exe', target: node.current.name() }));
		nodeCommandsDetails.append(this.createCommand({ type: 'exec', text: 'RelaySMTP', name: 'RelaySMTP.exe', target: node.current.name() }));
		nodeCommandsDetails.append(this.createCommand({ type: 'exec', text: 'Backdoor', name: 'backdoor', target: node.current.name() }));
		nodeCommandsDetails.append(this.createCommand({ type: 'run', text: 'Full Weaken', name: `full-weaken.js`, target: node.current.name(), args: [node.current.name()] }));
		nodeCommandsDetails.append(this.createCommand({ type: 'run', text: 'Hack n Grow', name: `hack-n-grow.js`, target: node.current.name(), args: [node.current.name()] }));
		nodeCommands.append(nodeCommandsHeader);
		nodeCommands.append(nodeCommandsDetails);
*/
		if (node.hasChildren()) {
			const nextLevel = this.createNode('div');
			nextLevel.classList.add('node-children');

			let childrenHeader = this.createNode('h4');
			childrenHeader.classList.add('border-bottom');
			let headerText = this.createNode('span');
			headerText.textContent = 'Children';
			let headerExpander = this.createNode('span');
			headerExpander.classList.add('toggled');

			let expanderLink = this.createNode('a');
			expanderLink['href'] = 'javascript:void(0);';
			expanderLink.onclick = (e) => {
				let parent = e.currentTarget.parentNode;

				parent.classList.toggle('toggle');
				parent.classList.toggle('toggled');
				parent.parentNode.parentNode.getElementsByClassName('contents')[0].classList.toggle('close');
				console.log(parent.classList);
			};

			headerExpander.append(expanderLink);
			
			childrenHeader.append(headerText);
			childrenHeader.append(headerExpander);

			nextLevel.append(childrenHeader);

			let childContents = this.createNode('div');
			childContents.classList.add('contents');
			childContents.classList.add('close');

			for (let i = 0; i < node.children.length; i++) {
				const subNode = this.createNetworkNode(node.children[i]);
				childContents.append(subNode);
			}

			nextLevel.append(childContents);

			element.append(nextLevel);
		}

		return element;
	}

	create(map) {
		this.createStyle();
		const element = this.createNode('div');
		element.classList.add('node-list');
		element.id = 'network-visualization';
		element.classList.add('css-m9uj84'); // For font styling
		element.append(this.createNetworkNode(map));

		return element;
	}
}