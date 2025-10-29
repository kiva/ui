import emitter from '../../../../src/plugins/event-emitter';

describe('event-emitter.js', () => {
	it('should export a mitt emitter instance', () => {
		expect(emitter).toBeDefined();
		expect(typeof emitter.on).toBe('function');
		expect(typeof emitter.off).toBe('function');
		expect(typeof emitter.emit).toBe('function');
	});

	it('should allow subscribing to and emitting events', () => {
		let callbackCalled = false;
		let receivedData = null;

		const handler = data => {
			callbackCalled = true;
			receivedData = data;
		};

		emitter.on('test-event', handler);
		emitter.emit('test-event', { test: 'data' });

		expect(callbackCalled).toBe(true);
		expect(receivedData).toEqual({ test: 'data' });

		// Clean up
		emitter.off('test-event', handler);
	});

	it('should allow unsubscribing from events', () => {
		let callCount = 0;
		const handler = () => {
			callCount += 1;
		};

		emitter.on('unsubscribe-test', handler);
		emitter.emit('unsubscribe-test');
		expect(callCount).toBe(1);

		emitter.off('unsubscribe-test', handler);
		emitter.emit('unsubscribe-test');
		expect(callCount).toBe(1); // Should not increment
	});
});
