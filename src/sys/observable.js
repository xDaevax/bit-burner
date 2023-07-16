import { Observer } from "sys/observer.js";

export class Observable {
    constructor(subscribe) {
        this._subscribe = subscribe;
    }

    subscribe(obs) {
        const observer = new Observer(obs);

        observer._unsubscribe = this._subscribe(observer);

        return ({
            unsubscribe() {
                observer.unsubscribe();
            }
        });
    }

    static from(values) {
        return new Observable((observer) => {
            values.forEach((value) => observer.next(value));

            observer.complete();

            return () => {
                console.log('Observable.from: unsubscribed');
            };
        });
    }

    static interval(interval) {
        return new Observable((observer) => {
            let i = 0;

            const id = setInterval(() => {
                observer.next(i++);
            }, interval);

            return () => {
                clearInterval(id);
                console.log('Observable.interval: unsubscribbed');
            };
        });
    }

    static fromEvent(element, eventName) {
        return new Observable((observer) => {
            const eventHandler = (event) => observer.next(event);

            element.addEventListener(eventName, eventHandler, false);

            return () => {
                element.removeEventListener(eventName, eventHandler, false);
                console.log('Observable.fromEvent: unsubscribbed');
            };
        });
    };
}

Observable.prototype.map = function (transformation) {
    const stream = this;
    
    return new Observable((observer) => {
      const subscription = stream.subscribe({
        next: (value) => observer.next(transformation(value)),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
      
      return subscription.unsubscribe;
    });
  };