/**
 * A set of configuration properties for the observer.
 * @typedef {Object} ObserverConfiguration
 * @property {(any) => void | null} next The function to invoke when the observable value changes.
 * @property {(any) => void | null} error The function to invoke when an error occurrs in the observable.
 * @property {() => void | null} complete The function to invoke when the observable completes.
 */

/**
 * Rudimentary implementation of observables to simplify state management.
 */
export class Observer {
    #handlers;
    #isUnsubscribed;

    /**
     * Initializes a new instance of the Observable class.
     * @param {ObserverConfiguration} handlers The handles to configure for the observer.
     */
    constructor(handlers) {
        this.#handlers = handlers;
        this.#isUnsubscribed = false;
    }

    /**
     * Fired when the observable value changes.
     * @param {any} value The value being set on the observable.
     */
    next(value) {
        if (this.#handlers.next && !this.#isUnsubscribed) {
            this.#handlers.next(value);
        }
    }

    /**
     * Fired when an error occurs on the observable.
     * @param {any} error The error information.
     */
    error(error) {
        if (!this.#isUnsubscribed) {
            if (this.#handlers.error) {
                this.#handlers.error(error);
            }

            this.unsubscribe();
        }
    }

    /**
     * Fired when the observable is completed.
     */
    complete() {
        if (!this.#isUnsubscribed) {
            if (this.#handlers.complete) {
                this.#handlers.complete();
            }

            this.unsubscribe();
        }
    }

    /**
     * Unhooks the observer from the observable.
     */
    unsubscribe() {
        this.#isUnsubscribed = true;

        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
}