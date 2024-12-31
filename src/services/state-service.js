import { CapabilityLoader } from "sys/capability-loader";
import { PortService } from "services/port-service";
import { Subscription } from "sys/subscription";
import { PlayerDataWatcher } from "data/player-data-watcher";
import { PlayerData } from "data/player-data";
import { BehaviorSubject } from "sys/behavior-subject";
import { ExecutableDataWatcher } from "data/executable-data-watcher";

/**
 * Class with a timer used to keep track of various state information and update it in the store.
 */
export class StateService {
  static #channelName = "state-channel";
  #ns;
  /**
   * @type {CapabilityLoader}
   */
  #loader;

  /**
   * @type {PortService}
   */
  #portService;

  /**
   * @type {Subscription}
   */
  #playerSubscription;

  /**
   * @type {PlayerDataWatcher}
   */
  #playerWatcher;

  /**
   * @type {Subscription}
   */
  #executableSubscription;

  /**
   * @type {ExecutableDataWatcher}
   */
  #executableWatcher;

  /**
   * Initializes a new instance of the StateService class.
   * @param {NetScript} ns The NetScript instance used to access the game API.
   * @param {CapabilityLoader} loader The capability loader for loading different capabilities.
   * @param {PortService} portService The PortService instance used to read / write port information.
   * @param {PlayerDataWatcher} playerWatcher The PlayerDataWatcher instance keeping track of player information.
   * @param {ExecutableDataWatcher} executableWatcher The ExecutableDataWatcher instance keeping track of player executable information.
   */
  constructor(ns, loader, portService, playerWatcher, executableWatcher) {
    this.#ns = ns;
    this.#loader = loader;
    this.#portService = portService;
    this.#playerSubscription = playerWatcher.onStateChange({
        next: (data) => {
            if (data) {
                let message = new StateMessage();
                message.type = 'player';
                message.contents = data;
                this.setState(message);
            }
        }
    });

    this.#executableSubscription = executableWatcher.onStateChange({
        next: (data) => {
            if (data) {
                let message = new StateMessage();
                message.type = 'executable';
                message.contents = data;
                this.setState(message);
            }
        }
    });

    this.#playerWatcher = playerWatcher;
    this.#executableWatcher = executableWatcher;
    (async () => await this.#listen())();
  } // end constructor

  addPlayerWatcher(watcher) {
    this.#playerWatcher.onStateChange({
        next: (data) => watcher(data)
    });
  }

  addExecutableWatcher(watcher) {
    this.#executableWatcher.onStateChange({
        next: (data) => watcher(data)
    });
  }

  /**
   * Returns a port that can be written to or read from.
   * @param {string} name The name of the port
   * @returns {NetscriptPort} The port handle used to perform port operations.
   */
  #getPort(name) {
    let targetPort = this.#ns.getPortHandle(this.#portService.findHandle(name));

    return targetPort;
  } // end function getPort

  async #listen() {
    try {
      this.#portService.findHandle(StateService.#channelName);
    } catch (e) {
      this.#portService.register(StateService.#channelName);
    }

    while (!this.dispose) {
        let statePort = this.#getPort(StateService.#channelName);

        if (!statePort?.empty()) {
            while (!statePort.empty()) {
                let updatedState = new StateMessage();
                updatedState = JSON.parse(statePort.read());
                console.log(updatedState);
            }
        }

        await this.#ns.asleep(1000);
    }

    this.#playerSubscription.unsubscribe();
  }

  /**
   * Writes a state update to the port.
   * @param {StateMessage} state The state to write.
   */
  setState(state) {
    let statePort = this.#getPort(StateService.#channelName);

    statePort.write(JSON.stringify(state));
  } // end function setState
} // end class StateService

/**
 * Type used to update state of the system.  Create new instances of this type and send them to the state service.
 */
export class StateMessage {
    /**
     * @type {string}
     */
    type;
  /**
   * @type {*}
   */
  contents;

  /**
   * Initializes a new instance of the StateMessage class.
   */
  constructor() {} // end constructor
} // end class StateMessage
