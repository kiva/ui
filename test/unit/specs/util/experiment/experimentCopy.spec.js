import { formatExperimentCopy } from '#src/util/experiment/experimentCopy';

const block = (key, fields = {}, contentType = 'genericContentBlock') => ({
	sys: { contentType: { sys: { id: contentType } } },
	fields: { key, ...fields },
});

const entry = (fields = {}, content = [
	block('tip-copy-a', { headline: 'A headline', subHeadline: 'A tagline' }),
	block('tip-copy-b', { headline: 'B headline' }),
]) => ({
	sys: { contentType: { sys: { id: 'uiSetting' } } },
	fields: {
		key: 'tip-copy',
		active: true,
		content,
		...fields,
	},
});

describe('experimentCopy.js', () => {
	describe('formatExperimentCopy', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('returns the blocks keyed by variant for an active entry without dates', () => {
			const variants = formatExperimentCopy(entry());

			expect(Object.keys(variants)).toEqual(['a', 'b']);
			expect(variants.a).toMatchObject({
				key: 'tip-copy-a',
				headline: 'A headline',
				subHeadline: 'A tagline',
				contentType: 'genericContentBlock',
			});
			expect(variants.b.headline).toBe('B headline');
		});

		it('returns the variants when now is inside the date window', () => {
			const variants = formatExperimentCopy(entry({
				startDate: '2026-10-01T00:00:00Z',
				endDate: '2026-11-01T00:00:00Z',
			}));

			expect(Object.keys(variants)).toEqual(['a', 'b']);
		});

		it('returns null when the entry is not active', () => {
			expect(formatExperimentCopy(entry({ active: false }))).toBeNull();
			expect(formatExperimentCopy(entry({ active: undefined }))).toBeNull();
		});

		it('returns null outside the date window', () => {
			expect(formatExperimentCopy(entry({
				startDate: '2026-11-01T00:00:00Z',
				endDate: '2026-12-01T00:00:00Z',
			}))).toBeNull();
			expect(formatExperimentCopy(entry({
				startDate: '2026-08-01T00:00:00Z',
				endDate: '2026-09-01T00:00:00Z',
			}))).toBeNull();
		});

		it('returns null when only one date is set', () => {
			expect(formatExperimentCopy(entry({ startDate: '2026-10-01T00:00:00Z' }))).toBeNull();
			expect(formatExperimentCopy(entry({ endDate: '2026-11-01T00:00:00Z' }))).toBeNull();
		});

		it('returns null for an empty or undefined entry', () => {
			expect(formatExperimentCopy(undefined)).toBeNull();
			expect(formatExperimentCopy(null)).toBeNull();
			expect(formatExperimentCopy({})).toBeNull();
		});

		it('returns null when the entry has no key', () => {
			// Without the check, a missing key would become the text "undefined" and match these blocks
			expect(formatExperimentCopy(entry({ key: undefined }, [block('undefined-a')]))).toBeNull();
			expect(formatExperimentCopy(entry({ key: '' }, [block('-a')]))).toBeNull();
		});

		it('ignores blocks without the setting key prefix, a variant, or the block content type', () => {
			const variants = formatExperimentCopy(entry({}, [
				block(undefined, { headline: 'No key' }),
				block('other-copy-b', { headline: 'Other set' }),
				block('tip-copy-', { headline: 'Bare prefix' }),
				block('tip-copy-a', { headline: 'Wrong type' }, 'richTextContent'),
				block('tip-copy-a', { headline: 'A headline' }),
			]));

			expect(Object.keys(variants)).toEqual(['a']);
			expect(variants.a.headline).toBe('A headline');
		});

		it('keeps the first block when two share a variant', () => {
			const variants = formatExperimentCopy(entry({}, [
				block('tip-copy-b', { headline: 'First' }),
				block('tip-copy-b', { headline: 'Second' }),
			]));

			expect(variants.b.headline).toBe('First');
		});

		it('returns null when no usable block remains', () => {
			expect(formatExperimentCopy(entry({}, []))).toBeNull();
			expect(formatExperimentCopy(entry({}, [block('other-copy-b')]))).toBeNull();
		});
	});
});
