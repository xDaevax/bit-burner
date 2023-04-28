'use strict';
/**
 * A type for use in services or components that can process items that need to be slowed down or separated.
 * This queue instance is capable of processing items in the queue in FIFO order.
 * To add something to the queue instance, use the enQueue method with syntax similar to the following:
 *
 * myQueueInstance.enQueue({work: (onComplete) => {
 *      // Perform whatever work is necessary
 *      onComplete(); // Important, this enables the queue to begin processing the next item.
 * }});
 */
export class WorkQueue {
    /**
     * Initializes defaults for a queue that can sequentially process things in first-in first-out (FIFO) order.
     * @param {number} interval -The amount of time between queue checks when items may be processed if ready.
     */
    constructor(interval) {
        this.items = [];
        this.queueTimer = null;
        this.queueInterval = interval;
        this.currentlyProcessing = '';
        this.queueListening = false;
    }

    /**
     * Processes the queue on an interval.  The next queued item is processed when the currentlyProcessing state is an empty string (which is done by invoking the onComplete method).
     */
    processQueue() {
        if (this.items && this.items.length > 0) {
            if (this.currentlyProcessing === '') {
                this.processQueueItem(() => {
                    this.currentlyProcessing = '';
                });
            }
        } else {
            clearInterval(this.queueTimer);
            this.queueTimer = null;
            this.queueListening = false;
            this.currentlyProcessing = '';
        }
    } // end method processQueue

    /**
     * Processes an item in the queue (if any).
     */
    processQueueItem(onComplete) {
        this.currentlyProcessing = '1'; // mark it as processing to avoid the queue stepping on it's own toes before we get actual data in
        const itemToQueue = this.items.splice(0, 1)[0];
        this.currentlyProcessing = itemToQueue.id;
        itemToQueue.operation.work(onComplete.bind(this));
    }

    /**
     * Starts the listener if it previously wasn't running.
     */
    startListening() {
        if (!this.queueListening) {
            this.queueListening = true;
            this.queueTimer = setInterval(this.processQueue.bind(this), this.queueInterval);
        }
    }

    /**
     * Adds an item to the queue.  The queued items are processed in FIFO order.
     * @param {any} item - The item with the work being queued.
     */
    enQueue(item) {
        let newId = '';
        if (item && item.id) {
            newId = item.id;
        } else {
            newId = generateId();
        }

        this.items.push({
            id: newId,
            operation: item
        });
        this.startListening();
    }

    /**
     * Removes a specific item from the queue (if it's not the item currently being processed).
     * @param {string} id
     */
    deQueue(id) {
        if (this.currentlyProcessing !== id) {
            const isItemInQueue = this.items.some((match => match.id === id));
            if (isItemInQueue) {
                this.items = this.items.filter((match => match.id !== id));
            }
        }
    }
}
