import { BaseElement } from 'modules/ui/components/base-element.js';

/**
 * A type used to create a UI element for displaying a server node's stats.
 */
export class NodeStats extends BaseElement {
    #node = null;
    #ns = null;
    #element = null;

    constructor(dom, ns, node) {
        super(dom);
        this.#ns = ns;
        this.#node = node;
    }

    refresh() {
        let server = this.#ns.getServer(this.#node.name());
        let rootStat = this.findElementsByClassName(this.findElementsByClassName(this.#element, 'root')[0], 'stat-value')[0];
        let backdoorStat = this.findElementsByClassName(this.findElementsByClassName(this.#element, 'backdoor')[0], 'stat-value')[0];

        rootStat.textContent = server.hasAdminRights;
        backdoorStat = server.backdoorInstalled;

        nextMap.current.setPortState('HTTP', currentNode.httpPortOpen);
		nextMap.current.setPortState('FTP', currentNode.ftpPortOpen);
		nextMap.current.setPortState('SSH', currentNode.sshPortOpen);
		nextMap.current.setPortState('SMTP', currentNode.smtpPortOpen);
		nextMap.current.setPortState('SQL', currentNode.sqlPortOpen);

        let portParent = this.findElementsByClassName(this.#element, 'port-status')[0];
        let sshPort = this.findElementsByClassName(portParent, 'HTTP')[0];
        let smtpPort = this.findElementsByClassName(portParent, 'SMTP')[0];
        sshPort.textContent = server.sshPortOpen;
        smtpPort.textContent = server.smtpPortOpen;

        if (server.sshPortOpen) {
            sshPort.classList.remove('red');
            sshPort.classList.add('green');
        }

        if (server.smtpPortOpen) {
            smtpPort.classList.remove('red');
            smtpPort.classList.add('green');
        }
        // TODO: When a GUID generator is introduced, look up this element in the DOM by ID, OR store the element itself as an instance field and use that.
    }

    createRootStat() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('root');
        node.title = 'Use NUKE.exe to gain root access';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'Root';

        let value = this.createNode('span');
        value.classList.add('stat-value');
        value.classList.add('state');

        if (this.#node.current.hasRoot()) {
            value.classList.add('green');
            value.textContent = 'Enabled';
        } else {
            value.classList.add('red');
            value.textContent = 'Disabled';
        }

        node.append(label);
        node.append(value);

        return node;
    }

    createBackdoorStat() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('backdoor');
        node.title = 'Run backdoor to enable direction connection';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'Backdoor';

        let value = this.createNode('span');
        value.classList.add('stat-value');
        value.classList.add('state');

        if (this.#node.current.hasBackdoor()) {
            value.classList.add('green');
            value.textContent = 'Installed';
        } else {
            value.classList.add('red');
            value.textContent = 'Not-installed';
        }

        node.append(label);
        node.append(value);

        return node;
    }

    createHackStat() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('hack');
        node.title = 'Amount of hacking skill required';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'Hack Needed';

        let value = this.createNode('span');
        value.classList.add('stat-value');

        const hackDiff = this.#node.current.minHackLevel() - this.#ns.getHackingLevel();
        let valueFormat = this.createNode('b');
        let valueFraction = this.createNode('span');
        valueFormat.textContent = hackDiff <= 0 ? 0 : hackDiff;

        value.append(valueFormat);
        valueFraction.innerHTML = `&nbsp;-&nbsp;${this.#ns.getHackingLevel()} / ${this.#node.current.minHackLevel()}`;
        value.append(valueFraction);

        node.append(label);
        node.append(value);

        return node;
    }

    createRamStat() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('ram');
        node.title = 'Server RAM';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'RAM';

        let value = this.createNode('span');
        value.classList.add('stat-value');

        value.textContent = `${this.#node.current.ram()} GB`;

        node.append(label);
        node.append(value);

        return node;
    }

    createCoreStat() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('cores');
        node.title = 'Server Cores';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'Cores';

        let value = this.createNode('span');
        value.classList.add('stat-value');

        value.textContent = this.#node.current.cores();

        node.append(label);
        node.append(value);

        return node;
    }

    createPortStat() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('ports');
        node.title = 'Open Ports required for NUKE.exe';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'Required Ports';

        let value = this.createNode('span');
        value.classList.add('stat-value');

        value.textContent = this.#node.current.numPortsRequired();

        node.append(label);
        node.append(value);

        return node;
    }

    createPortStatus() {
        let node = this.createNode('div');
        node.classList.add('stat-item');
        node.classList.add('port-status');
        node.title = 'Current Port Status';

        let label = this.createNode('span');
        label.classList.add('stat-label');
        label.textContent = 'Port Status';

        let value = this.createNode('span');
        value.classList.add('stat-value');

        let portList = this.createNode('ul');
        portList.classList.add('port-status-list');

        for(let i = 0; i < this.#node.current.ports().length; i++) {
            let currentPort = this.#node.current.ports()[i];
            let portItem = this.createNode('li');
            portItem.classList.add('state');
            portItem.classList.add(currentPort.name());

            if (currentPort.state) {
                portItem.classList.add('green');
            } else {
                portItem.classList.add('red');
            }

            portItem.textContent = currentPort.name();
            portList.append(portItem);            
        }

        value.append(portList);

        node.append(label);
        node.append(value);

        return node;
    }

    create() {
        let node = this.createNode('div');
        node.classList.add('stats');
        let nodeHeader = this.createNode('h4');
        nodeHeader.classList.add('border-bottom');
        let nodeHeaderText = this.createNode('span');
        nodeHeaderText.textContent = 'Stats';

        let nodeHeaderExpander = this.createNode('span');
        nodeHeaderExpander.classList.add('toggled');

        let nodeHeaderLink = this.createNode('a');
        nodeHeaderLink['href'] = 'javascript:void(0);';
        nodeHeaderLink.onclick = (e) => {
            let parent = e.currentTarget.parentNode;

            parent.classList.toggle('toggle');
            parent.classList.toggle('toggled');
            parent.parentNode.parentNode.getElementsByClassName('contents')[0].classList.toggle('close');
            console.log(parent.classList);
        };

        let nodeContents = this.createNode('div');
        nodeContents.classList.add('contents');
        nodeContents.classList.add('close');

        let nodeContentsLiner = this.createNode('div');
        nodeContentsLiner.classList.add('content-liner');

        nodeContentsLiner.append(this.createRootStat());
        nodeContentsLiner.append(this.createBackdoorStat());
        nodeContentsLiner.append(this.createHackStat());
        nodeContentsLiner.append(this.createRamStat());
        nodeContentsLiner.append(this.createCoreStat());
        nodeContentsLiner.append(this.createPortStat());
        nodeContentsLiner.append(this.createPortStatus());

        nodeHeaderExpander.append(nodeHeaderLink);
        nodeHeader.append(nodeHeaderText);
        nodeHeader.append(nodeHeaderExpander);
        node.append(nodeHeader);
        nodeContents.append(nodeContentsLiner);
        node.append(nodeContents);

        this.#element = node;

        return node;
    } // end function create
} // end class NodeStats