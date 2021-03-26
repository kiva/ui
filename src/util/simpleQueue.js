/**
 * Utility class to help with creating and managing a basic queue
 * - This implementation uses array properites and is meant for small queues of items
 */
export default class SimpleQueue {
	/**
	 * Initialize a queue to hold items in an array
	 */
	constructor(options = {}) {
		this.items = [];
		this.itemLimit = options && options.itemLimit ? options.itemLimit : 200;
	}

	/**
	 * Add an item to the queue
	 */
	add(item) {
		// limit items added to queue
		if (this.items.length === this.itemLimit) {
			return false;
		}
		this.items.push(item);
	}

	/**
	 * Remove an item from the queue
	 */
	remove() {
		return this.items.shift();
	}

	/**
	 * Check for items in the queue
	 */
	isEmpty() {
		return this.items.length === 0;
	}

	/**
	 * Get the item at the front of the queue
	 */
	peek() {
		return !this.isEmpty() ? this.items[0] : undefined;
	}

	/**
	 * Remove all items from the queue
	 */
	reset() {
		this.items.length = 0;
	}

	/**
	 * Get the length of the queue
	 */
	get length() {
		return this.items.length;
	}
}
