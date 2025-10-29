import store2 from 'store2';
import {
	mocks,
	realNow,
	reset,
	setDelay,
} from 'timesync';
import syncDate from '../../../../src/util/syncDate';

vi.mock('timesync');

describe('syncDate.js', () => {
	const delay = 10000;

	beforeEach(() => {
		setDelay(delay);
	});

	afterEach(() => {
		reset();
		mocks.sync.mockClear();
		store2.clearAll();
	});

	it('Prevents timesync.sync() from being called multiple times while syncing', () => {
		syncDate();
		return syncDate().then(() => {
			expect(mocks.sync.mock.calls.length).toBe(1);
		});
	});

	it('Uses previous offset instead of syncing if less than 10 minutes has passed since the last sync', () => {
		const nineMinutes = 9 * 60 * 1000;
		store2.set('timesync.lastSyncTime', realNow() - nineMinutes);
		const oldOffset = 1234;
		store2.set('timesync.lastOffset', oldOffset);
		// Expect the offset to initially be 0 before syncing is called
		expect(mocks.offset).toBe(0);
		return syncDate().then(() => {
			// Expect timesync.sync() not to have been called
			expect(mocks.sync.mock.calls.length).toBe(0);
			// Expect the offset to be the saved offset
			expect(mocks.offset).toBe(oldOffset);
		});
	});

	it('Updates the last sync time in local storage upon syncing', () => {
		const elevenMinutes = 11 * 60 * 1000;
		const initialSyncTime = realNow() - elevenMinutes;
		store2.set('timesync.lastSyncTime', initialSyncTime);
		return syncDate().then(() => {
			// Expect syncing to be called
			expect(mocks.sync.mock.calls.length).toBe(1);
			// Expect that the lastSyncTime has been updated
			const syncTime = store2.get('timesync.lastSyncTime');
			expect(syncTime).not.toBe(initialSyncTime);
			// Expect that the lastSyncTime has been updated to now (approximately)
			const differenceFromNow = Math.abs(realNow() - syncTime);
			expect(differenceFromNow).toBeLessThan(30);
			// Expect that the calculated delay has been saved
			expect(store2.get('timesync.lastOffset')).toBe(delay);
		});
	});

	it('Replaces Date constructor with synchronized time', () => {
		const start = (new Date()).getTime();
		return syncDate().then(() => {
			const end = (new Date()).getTime();
			const difference = end - start;
			expect(difference).toBeGreaterThan(delay - 100);
			expect(difference).toBeLessThan(delay + 100);
		});
	});

	it('Replaces Date.now with synchronized time', () => {
		const start = Date.now();
		return syncDate().then(() => {
			const end = Date.now();
			const difference = end - start;
			expect(difference).toBeGreaterThan(delay - 100);
			expect(difference).toBeLessThan(delay + 100);
		});
	});

	it('Does not replace Date objects created with arguments', () => {
		const randomTime = Math.floor(Math.random() * 1600000000000);
		return syncDate().then(() => {
			const date = new Date(randomTime);
			expect(date.getTime()).toBe(randomTime);
		});
	});

	it('Does not change Date.parse', () => {
		return syncDate().then(() => {
			expect(Date.parse('February 18, 2018 12:30 PM GMT')).toBe(1518957000000);
			expect(Date.parse('February 48, 2018 12:30 PM GMT')).toBe(NaN);
		});
	});

	it('Does not change Date.UTC', () => {
		return syncDate().then(() => {
			expect(Date.UTC(2019, 4, 1, 3, 15, 30)).toBe(1556680530000);
			expect(Date.UTC()).toBe(NaN);
		});
	});

	it('Handles error events during syncing', () => {
		// Force an error by triggering the error callback
		return new Promise(resolve => {
			mocks.on.mockImplementation((event, callback) => {
				if (event === 'error') {
					setTimeout(() => callback(new Error('Test sync error')), 10);
				}
			});
			syncDate().then(() => {
				expect(mocks.off).toHaveBeenCalledWith('error');
				resolve();
			});
		});
	});

	it('Should not sync if offset already exists and within 10 minutes', () => {
		const nineMinutes = 9 * 60 * 1000;
		store2.set('timesync.lastSyncTime', realNow() - nineMinutes);
		// Simulate offset already being set (no need to restore)
		mocks.offset = 5000;

		return syncDate().then(() => {
			// Expect timesync.sync() not to have been called
			expect(mocks.sync.mock.calls.length).toBe(0);
			// Offset should remain unchanged
			expect(mocks.offset).toBe(5000);
		});
	});
});
