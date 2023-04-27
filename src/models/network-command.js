/**
 * A type that represents a command that can be executed on the network.
 */
export class NetworkCommand {
    displayName = '';
    description = '';
    fileName  = '';
    path = '';
    type = NetworkCommandType.Other;
    icon = '';
    action = () => {};

    /**
     * 
     * @param {string} fileName The name of the file.
     * @param {string} path The full path to the command.
     * @param {NetworkCommandType} type The type of the command.
     * @param {string} displayName The display name of the command. 
     * @param {string} description Describes the behavior of the command. 
     * @param {string} icon The icon (if any) to use.
     * @param {VoidFunction} action The action to invoke for this command.
     */
    constructor(fileName, path, type, displayName, description, icon, action) {
        this.fileName = fileName;
        this.path = path;
        this.type = type;
        this.displayName = displayName;
        this.description = description;
        this.icon = icon ?? 'none';
        this.action = action;
    }
}

/**
 * An enumeration set that represents the types of available commands.
 */
export class NetworkCommandType {
    static Executable = 'exe';
    static Script = 'script';
    static Other = 'other';
}