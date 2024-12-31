import { Subscription } from "sys/subscription";

/**
 * Class representing a BehaviorSubject.
 * A BehaviorSubject holds a current value and emits this value immediately to new subscribers.
 */
export class BehaviorSubject {
  /**
   * Creates a BehaviorSubject.
   * @param {*} initialValue - Initial value of the BehaviorSubject.
   */
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = [];
    this.isComplete = false;
  }

  /**
   * Emits a new value to all subscribers.
   * @param {*} newValue - The new value to emit.
   */
  next(newValue) {
    if (this.isComplete) {
      throw new Error("Cannot emit new values after completion.");
    }

    this.value = newValue;
    this.subscribers.forEach((subscriber) => subscriber.next(newValue));
  }

  /**
   * Marks the BehaviorSubject as complete and notifies all subscribers.
   * No further values can be emitted after calling `complete`.
   */
  complete() {
    if (this.isComplete) return;

    this.isComplete = true;
    this.subscribers.forEach((subscriber) => {
      if (subscriber.complete) {
        subscriber.complete();
      }
    });

    // Clear subscribers after completion to prevent memory leaks
    this.subscribers = [];
  }

  /**
   * Subscribes to the BehaviorSubject.
   * Immediately emits the current value to the subscriber.
   * @param {{ next: function, complete?: function }} observer - Observer object with `next` and optional `complete` methods.
   * @returns {Subscription} Subscription object to manage the subscription.
   */
  subscribe(observer) {
    if (this.isComplete) {
      if (observer.complete) {
        observer.complete();
      }

      return new Subscription(() => {}); // Return a no-op subscription
    }

    // Immediately emit the current value
    if (observer.next) {
      observer.next(this.value);
    }

    // Add observer to the subscribers list
    this.subscribers.push(observer);

    // Return a Subscription object
    return new Subscription(() => {
      this.subscribers = this.subscribers.filter((sub) => sub !== observer);
    });
  }
} // end class BehaviorSubject
