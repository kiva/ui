// @vitest-environment node
import { resolveBundleSize } from '#server/util/live-loan/bundle-size';

describe('resolveBundleSize', () => {
	describe('tier boundaries', () => {
		it.each([
			[0, { count: 1 }],
			[25.00, { count: 1 }],
			[25.01, { count: 2 }],
			[50.00, { count: 2 }],
			[50.01, { count: 3 }],
			[75.00, { count: 3 }],
			[75.01, { count: 4 }],
			[100.00, { count: 4 }],
			[100.01, { count: 5 }],
			[125.00, { count: 5 }],
			[125.01, { count: 6 }],
			[150.00, { count: 6 }],
			[150.01, { redirect: '/lend/filter' }],
			[500.00, { redirect: '/lend/filter' }],
		])('balance %s resolves to %o', (balance, expected) => {
			expect(resolveBundleSize(String(balance))).toEqual(expected);
		});
	});

	describe('normal cases per tier', () => {
		it('balance 35 -> 2 loans', () => {
			expect(resolveBundleSize('35')).toEqual({ count: 2 });
		});
		it('balance 60 -> 3 loans', () => {
			expect(resolveBundleSize('60')).toEqual({ count: 3 });
		});
		it('balance 90 -> 4 loans', () => {
			expect(resolveBundleSize('90')).toEqual({ count: 4 });
		});
		it('balance 110 -> 5 loans', () => {
			expect(resolveBundleSize('110')).toEqual({ count: 5 });
		});
		it('balance 140 -> 6 loans', () => {
			expect(resolveBundleSize('140')).toEqual({ count: 6 });
		});
		it('balance 1000 -> redirect', () => {
			expect(resolveBundleSize('1000')).toEqual({ redirect: '/lend/filter' });
		});
	});

	describe('fallbacks to 4-loan default', () => {
		it.each([
			undefined,
			null,
			'',
			'abc',
			'NaN',
			'-25',
			'-0.01',
		])('input %o resolves to { count: 4 }', input => {
			expect(resolveBundleSize(input)).toEqual({ count: 4 });
		});
	});

	describe('accepts numeric input too', () => {
		it('numeric 75 -> 3 loans', () => {
			expect(resolveBundleSize(75)).toEqual({ count: 3 });
		});
		it('numeric 0 -> 1 loan', () => {
			expect(resolveBundleSize(0)).toEqual({ count: 1 });
		});
		it('numeric -5 -> fallback 4 loans', () => {
			expect(resolveBundleSize(-5)).toEqual({ count: 4 });
		});
	});

	describe('strict numeric validation', () => {
		it('rejects trailing garbage: "75abc" -> fallback', () => {
			expect(resolveBundleSize('75abc')).toEqual({ count: 4 });
		});
		it('accepts scientific notation: "1e10" -> redirect', () => {
			expect(resolveBundleSize('1e10')).toEqual({ redirect: '/lend/filter' });
		});
		it('trims surrounding whitespace: " 75 " -> 3 loans', () => {
			expect(resolveBundleSize(' 75 ')).toEqual({ count: 3 });
		});
		it('whitespace-only string -> fallback', () => {
			expect(resolveBundleSize('   ')).toEqual({ count: 4 });
		});
	});

	describe('rejects non-string, non-number inputs', () => {
		it.each([
			[true],
			[false],
			[[]],
			[['75', '100']],
			[{}],
			[{ balance: 75 }],
		])('input %o resolves to { count: 4 }', input => {
			expect(resolveBundleSize(input)).toEqual({ count: 4 });
		});
	});
});
