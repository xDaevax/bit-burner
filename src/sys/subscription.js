/**
 * Class representing a subscription to an observable.
 * Provides a method to unsubscribe from the observable.
 */
export class Subscription {
  /**
   * Creates a Subscription.
   * @param {function} unsubscribeFn - The function to call when unsubscribing.
   */
  constructor(unsubscribeFn) {
    this.unsubscribeFn = unsubscribeFn;
    this.isUnsubscribed = false;
  } // end constructor

  /**
   * Unsubscribes from the observable.
   */
  unsubscribe() {
    if (!this.isUnsubscribed) {
      this.unsubscribeFn();
      this.isUnsubscribed = true;
    }
  } // end unsubscribe function
} // end class Subscription
