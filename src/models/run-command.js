import { NetworkCommand, NetworkCommandType } from 'models/network-command.js';

/**
 * A model used to run a network command.
 */
export class RunCommand {
    command = new NetworkCommand();
    targetNode = '';
    threadCount = 1;
    
    constructor() {

    }
}