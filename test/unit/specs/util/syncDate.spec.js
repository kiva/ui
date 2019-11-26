import { mocks, reset, setDelay } from 'timesync';
import syncDate from '@/util/syncDate';

describe('syncDate.js', () => {
	const delay = 10000;

	beforeEach(() => {
		setDelay(delay);
	});

	afterEach(() => {
		reset();
	});

	it('Prevents timesync.sync() from being called multiple times', () => {
		syncDate();
		return syncDate().then(() => {
			expect(mocks.sync.mock.calls.length).toBe(1);
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
});
