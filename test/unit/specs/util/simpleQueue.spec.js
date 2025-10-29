import SimpleQueue from '../../../../src/util/simpleQueue';

describe('SimpleQueue', () => {
	const queue = new SimpleQueue();
	const testObjEntry = { test: 'value' };

	it('returns true if no items are in the queue', () => {
		expect(queue.isEmpty()).toEqual(true);
	});

	it('returns false if items are in the queue', () => {
		queue.add(1);
		expect(queue.isEmpty()).toEqual(false);
	});

	it('returns a length of 1, with 1 item in the queue', () => {
		expect(queue.length).toEqual(1);
	});

	it('returns a value of 1, with 1 item in the queue', () => {
		expect(queue.peek()).toEqual(1);
	});

	it('returns undefined when peeking an empty queue', () => {
		const emptyQueue = new SimpleQueue();
		expect(emptyQueue.peek()).toBeUndefined();
	});

	it('returns a value of 1, when removing the 1 item from the queue', () => {
		expect(queue.remove()).toEqual(1);
	});

	it('returns an object value after adding it to the queue', () => {
		queue.add(testObjEntry);
		expect(queue.peek()).toEqual(testObjEntry);
	});

	it('returns an array with 1 object value from the queue', () => {
		expect(queue.items).toEqual([testObjEntry]);
	});

	it('returns 0 length after restting the queue', () => {
		queue.add(testObjEntry);
		queue.add(testObjEntry);
		queue.add(testObjEntry);
		expect(queue.length).toBeGreaterThan(0);
		queue.reset();
		expect(queue.length).toEqual(0);
	});

	it('limits the number entries in the queue to the itemLimit value', () => {
		queue.reset();
		const totalItems = 210; // default limit is 200
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < totalItems; i++) {
			queue.add(i);
		}
		expect(queue.length).toEqual(queue.itemLimit);
	});

	it('configures itemLimit passed via options object', () => {
		const itemLimit = 30;
		const limitQueue = new SimpleQueue({ itemLimit });
		expect(limitQueue.itemLimit).toEqual(itemLimit);
	});
});
