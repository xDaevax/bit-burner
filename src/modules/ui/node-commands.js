import { BaseElement } from 'modules/ui/components/base-element.js';
import { NetworkCommand, NetworkCommandType } from 'models/network-command';
import { Modal } from 'modules/ui/modal.js';

/**
 * A type used to create a UI element for displaying a server node's commands.
 */
export class NodeCommands extends BaseElement {
    #node = null;
    #ns = null;
    #executables = [];
    updateNodeStats = () => {};

    constructor(dom, ns, node) {
        super(dom);
        this.#ns = ns;
        this.#node = node;
        this.#executables = [
            new NetworkCommand('BruteSSH.exe', 'BruteSSH.exe', NetworkCommandType.Executable, 'Brute SSH', 'Opens the SSH port on the target', null, () => {
                this.#ns.brutessh(this.#node.current.name());
            }),
            new NetworkCommand('FTPCrack.exe', 'FTPCrack.exe', NetworkCommandType.Executable, 'FTP Crack', 'Opens the FTP port on the target', null, () => {
                this.#ns.ftpcrack(this.#node.current.name());
            }),
            new NetworkCommand('relaySMTP.exe', 'relaySMTP.exe', NetworkCommandType.Executable, 'Relay SMTP', 'Opens the SMTP port on the target', null, () => {
                this.#ns.relaysmtp(this.#node.current.name());
            }),
            new NetworkCommand('HTTPWorm.exe', 'HTTPWorm.exe', NetworkCommandType.Executable, 'HTTP Worm', 'Opens the HTTP port on the target', null, () => {
                this.#ns.httpworm(this.#node.current.name());
            }),
            new NetworkCommand('SQLInject.exe', 'SQLInject.exe', NetworkCommandType.Executable, 'SQL Inject', 'Opens the SQL port on the target', null, () => {
                this.#ns.sqlinject(this.#node.current.name());
            }),
            new NetworkCommand('NUKE.exe', 'NUKE.exe', NetworkCommandType.Executable, 'NUKE', 'Roots the target', 'nuke', () => {
                this.#ns.nuke(this.#node.current.name());
            })
        ];
    }

    showCommandInput(command) {

    }

    createExecutables() {
        let executablesLiner = this.createNode('div');
        executablesLiner.classList.add('executables');

        let executablesHeader = this.createNode('h5');
        executablesHeader.textContent = 'Executables';

        executablesLiner.append(executablesHeader);

        for (let i = 0; i < this.#executables.length; i++) {
            const currentExe = this.#executables[i];

            let item = this.createNode('div');
            item['title'] = currentExe.description;
            item.classList.add('content-item');

            let link = this.createNode('a');
            link.href = 'javascript:void(0);';
            link.textContent = currentExe.displayName;
            link.classList.add('comment-item');
            
            if (currentExe.icon) {
                link.classList.add(currentExe.icon);
            }

            if (!this.#ns.fileExists(currentExe.path)) {
                item.classList.add('disabled');
                link.onclick = (event) => {
                    this.#ns.toast(`${currentExe.displayName} is not available.`, 'warning');
                };
            } else {
                link.onclick = (event) => {
                    this.#ns.toast(`Executing ${currentExe.displayName} on ${this.#node.current.name()}.`, 'info');
                    currentExe.action();
                    this.updateNodeStats();
                };
            }

            item.append(link);

            executablesLiner.append(item);
        }

        return executablesLiner;
    } // end function createExecutables

    createScripts() {
        let scriptsLiner = this.createNode('div');
        scriptsLiner.classList.add('scripts');

        let scriptsHeader = this.createNode('h5');
        scriptsHeader.textContent = 'Scripts';

        scriptsLiner.append(scriptsHeader);

        return scriptsLiner;
    }

    create() {
        let node = this.createNode('div');
        node.classList.add('commands');
        let nodeHeader = this.createNode('h4');
        nodeHeader.classList.add('border-bottom');
        let nodeHeaderText = this.createNode('span');
        nodeHeaderText.textContent = 'Commands';

        let nodeHeaderExpander = this.createNode('span');
        nodeHeaderExpander.classList.add('toggled');

        let nodeHeaderLink = this.createNode('a');
        nodeHeaderLink['href'] = 'javascript:void(0);';
        nodeHeaderLink.onclick = (e) => {
            let parent = e.currentTarget.parentNode;

            parent.classList.toggle('toggle');
            parent.classList.toggle('toggled');
            parent.parentNode.parentNode.getElementsByClassName('contents')[0].classList.toggle('close');
        };

        let nodeContents = this.createNode('div');
        nodeContents.classList.add('contents');
        nodeContents.classList.add('close');

        let nodeContentsLiner = this.createNode('div');
        nodeContentsLiner.classList.add('content-liner');

        nodeContentsLiner.append(this.createExecutables());
        nodeContentsLiner.append(this.createScripts());

        nodeHeaderExpander.append(nodeHeaderLink);
        nodeHeader.append(nodeHeaderText);
        nodeHeader.append(nodeHeaderExpander);
        node.append(nodeHeader);
        nodeContents.append(nodeContentsLiner);
        node.append(nodeContents);

        return node;
    } // end function create
} // end class NodeCommands