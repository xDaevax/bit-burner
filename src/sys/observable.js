import { Subscription } from "sys/subscription";

/**
 * Class representing an Observable.
 * Observables emit values over time to subscribed observers.
 */
export class Observable {
  /**
   * Creates an Observable.
   * @param {function(observer: { next: function, complete?: function }): function} subscribeFn - Function called when the Observable is subscribed to. Should emit values via `observer.next` and return a cleanup function.
   */
  constructor(subscribeFn) {
    this.subscribeFn = subscribeFn;
  } // end constructor

  /**
   * Subscribes to the Observable.
   * @param {{ next: function, complete?: function }} observer - Observer object with `next` and optional `complete` methods.
  * @returns {Subscription} Subscription object to manage the subscription.
   */
  subscribe(observer) {
    const unsubscribeFn = this.subscribeFn(observer);
    return new Subscription(unsubscribeFn);
  } // end function subscribe

  /**
   * Creates an Observable from an array of values.
   * @param {Array} array - Array of values to emit.
   * @returns {Observable} Observable that emits each array value in sequence.
   */
  static from(array) {
    return new Observable((observer) => {
      array.forEach((item) => observer.next(item));

      if (observer.complete) {
        observer.complete();
      }
    });
  } // end function from
} // end class Observable
