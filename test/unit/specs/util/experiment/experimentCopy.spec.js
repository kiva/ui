import { getExperimentCopy, selectActiveCopyRound } from '#src/util/experiment/experimentCopy';

const uiSetting = fields => ({
	sys: { contentType: { sys: { id: 'uiSetting' } } },
	fields,
});

// A round's schedule, a uiSetting with dates and an optional tracking action
const schedule = (key, fields = {}) => uiSetting({ key, active: true, ...fields });

// Rich text embedding the schedule the way editors do, inline inside a paragraph
const bodyWith = (target, nodeType = 'embedded-entry-inline') => ({
	nodeType: 'document',
	data: {},
	content: [{
		nodeType: 'paragraph',
		data: {},
		content: [
			{
				nodeType: 'text', value: '', marks: [], data: {}
			},
			{ nodeType, data: { target }, content: [] },
		],
	}],
});

const block = (key, fields = {}, contentType = 'genericContentBlock') => ({
	sys: { contentType: { sys: { id: contentType } } },
	fields: { key, ...fields },
});

// A block in a scheduled round
const roundBlock = (key, roundSchedule, fields = {}) => block(key, {
	headline: `${key} headline`,
	bodyCopy: bodyWith(roundSchedule),
	...fields,
});

const entry = (fields = {}, content = [
	block('tip-copy-a', { headline: 'A headline', subHeadline: 'A tagline' }),
	block('tip-copy-b', { headline: 'B headline' }),
]) => uiSetting({
	key: 'tip-copy',
	active: true,
	content,
	...fields,
});

const NOV = { startDate: '2026-11-01T00:00:00Z', endDate: '2026-12-01T00:00:00Z' };
const DEC = { startDate: '2026-12-01T00:00:00Z', endDate: '2027-01-01T00:00:00Z' };
const novSchedule = (fields = {}) => schedule('tip-copy-nov-setting', { ...NOV, ...fields });
const decSchedule = (fields = {}) => schedule('tip-copy-dec-setting', { ...DEC, ...fields });

describe('experimentCopy.js', () => {
	describe('selectActiveCopyRound', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-11-15T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('returns null for an empty or undefined entry', () => {
			expect(selectActiveCopyRound(undefined)).toBeNull();
			expect(selectActiveCopyRound(null)).toBeNull();
			expect(selectActiveCopyRound({})).toBeNull();
		});

		describe('with blocks that embed no schedule', () => {
			it('returns the blocks keyed by version as one always-on round named after the entry', () => {
				const result = selectActiveCopyRound(entry());

				expect(result.key).toBe('tip-copy');
				expect(result.trackingAction).toBeNull();
				expect(Object.keys(result.variants)).toEqual(['a', 'b']);
				expect(result.variants.a).toMatchObject({
					key: 'tip-copy-a',
					headline: 'A headline',
					subHeadline: 'A tagline',
					contentType: 'genericContentBlock',
				});
			});

			it('returns the round when now is inside the entry dates', () => {
				expect(selectActiveCopyRound(entry(NOV)).key).toBe('tip-copy');
			});

			it('returns null when the entry is not active', () => {
				expect(selectActiveCopyRound(entry({ active: false }))).toBeNull();
				expect(selectActiveCopyRound(entry({ active: undefined }))).toBeNull();
			});

			it('returns null outside the entry dates', () => {
				expect(selectActiveCopyRound(entry(DEC))).toBeNull();
			});

			it('returns null when only one date is set or the dates are backwards', () => {
				expect(selectActiveCopyRound(entry({ startDate: NOV.startDate }))).toBeNull();
				expect(selectActiveCopyRound(entry({ endDate: NOV.endDate }))).toBeNull();
				expect(selectActiveCopyRound(entry({ startDate: NOV.endDate, endDate: NOV.startDate })))
					.toBeNull();
			});

			it('returns null when the entry has no key', () => {
				expect(selectActiveCopyRound(entry({ key: undefined }))).toBeNull();
				expect(selectActiveCopyRound(entry({ key: '' }))).toBeNull();
			});

			it("returns the entry's trackingAction when set", () => {
				const result = selectActiveCopyRound(entry({ dataObject: { trackingAction: 'EXP-ENTRY' } }));

				expect(result.trackingAction).toBe('EXP-ENTRY');
			});
		});

		describe('reading blocks', () => {
			it('ignores blocks without a key, a version, or the block content type', () => {
				const result = selectActiveCopyRound(entry({}, [
					block(undefined, { headline: 'No key' }),
					block('nodash', { headline: 'No version separator' }),
					block('tip-copy-', { headline: 'Bare prefix' }),
					block('tip-copy-a', { headline: 'Wrong type' }, 'richTextContent'),
					block('tip-copy-a', { headline: 'A headline' }),
				]));

				expect(Object.keys(result.variants)).toEqual(['a']);
				expect(result.variants.a.headline).toBe('A headline');
			});

			it('keeps the first block when two in a round share a version', () => {
				const result = selectActiveCopyRound(entry({}, [
					block('tip-copy-b', { headline: 'First' }),
					block('tip-copy-b', { headline: 'Second' }),
				]));

				expect(result.variants.b.headline).toBe('First');
			});

			it('returns null when no usable block remains', () => {
				expect(selectActiveCopyRound(entry({}, []))).toBeNull();
				expect(selectActiveCopyRound(entry({}, [block('tip-copy-')]))).toBeNull();
			});
		});

		describe('with blocks that embed a schedule in their body', () => {
			it('groups blocks by the schedule they embed, named after the schedule', () => {
				const result = selectActiveCopyRound(entry({}, [
					roundBlock('tip-copy-nov-a', novSchedule()),
					roundBlock('tip-copy-nov-b', novSchedule()),
				]));

				expect(result.key).toBe('tip-copy-nov-setting');
				expect(Object.keys(result.variants)).toEqual(['a', 'b']);
				expect(result.variants.b.headline).toBe('tip-copy-nov-b headline');
			});

			it('finds a schedule embedded as a block entry too', () => {
				const result = selectActiveCopyRound(entry({}, [
					block('tip-copy-nov-a', { bodyCopy: bodyWith(novSchedule(), 'embedded-entry-block') }),
				]));

				expect(result.key).toBe('tip-copy-nov-setting');
			});

			it('returns the round whose dates include now', () => {
				const parent = entry({}, [
					roundBlock('tip-copy-nov-a', novSchedule()),
					roundBlock('tip-copy-dec-a', decSchedule()),
					roundBlock('tip-copy-dec-b', decSchedule()),
				]);

				expect(selectActiveCopyRound(parent).key).toBe('tip-copy-nov-setting');
				vi.setSystemTime(new Date('2026-12-15T00:00:00Z'));
				const dec = selectActiveCopyRound(parent);
				expect(dec.key).toBe('tip-copy-dec-setting');
				expect(Object.keys(dec.variants)).toEqual(['a', 'b']);
			});

			it('returns the first linked round when rounds overlap', () => {
				const parent = entry({}, [
					roundBlock('tip-copy-second-a', schedule('second', NOV)),
					roundBlock('tip-copy-first-a', schedule('first', NOV)),
				]);

				expect(selectActiveCopyRound(parent).key).toBe('second');
			});

			it('returns null in a gap between rounds', () => {
				const parent = entry({}, [
					roundBlock('tip-copy-nov-a', novSchedule()),
					roundBlock('tip-copy-dec-a', decSchedule()),
				]);

				vi.setSystemTime(new Date('2027-02-01T00:00:00Z'));
				expect(selectActiveCopyRound(parent)).toBeNull();
			});

			it('falls back to blocks without a schedule when no scheduled round is live', () => {
				const parent = entry({}, [
					roundBlock('tip-copy-nov-a', novSchedule()),
					block('tip-copy-a', { headline: 'Default A' }),
				]);

				expect(selectActiveCopyRound(parent).key).toBe('tip-copy-nov-setting');
				vi.setSystemTime(new Date('2027-02-01T00:00:00Z'));
				expect(selectActiveCopyRound(parent).key).toBe('tip-copy');
			});

			it('skips rounds whose schedule is inactive, has broken dates or has no key', () => {
				const parent = entry({}, [
					roundBlock('tip-copy-off-a', schedule('off', { ...NOV, active: false })),
					roundBlock('tip-copy-half-a', schedule('half', { startDate: NOV.startDate })),
					roundBlock('tip-copy-nokey-a', schedule(undefined, NOV)),
					roundBlock('tip-copy-nov-a', novSchedule()),
				]);

				expect(selectActiveCopyRound(parent).key).toBe('tip-copy-nov-setting');
			});

			it('skips blocks whose embedded schedule did not resolve, instead of showing them always', () => {
				const unresolved = { sys: { type: 'Link', linkType: 'Entry', id: 'draft-schedule' } };
				const parent = entry({}, [
					block('tip-copy-nov-a', { headline: 'Unscheduled Nov', bodyCopy: bodyWith(unresolved) }),
					block('tip-copy-a', { headline: 'Default A' }),
				]);

				const result = selectActiveCopyRound(parent);
				expect(result.key).toBe('tip-copy');
				expect(result.variants.a.headline).toBe('Default A');
				expect(selectActiveCopyRound(entry({}, [parent.fields.content[0]]))).toBeNull();
			});

			it('ignores embedded entries that are not uiSettings', () => {
				const result = selectActiveCopyRound(entry({}, [
					block('tip-copy-a', { bodyCopy: bodyWith(block('some-block')) }),
				]));

				expect(result.key).toBe('tip-copy');
			});

			it('returns null when the parent is not active or the round is outside the parent dates', () => {
				const blocks = [roundBlock('tip-copy-nov-a', novSchedule())];

				expect(selectActiveCopyRound(entry({ active: false }, blocks))).toBeNull();
				expect(selectActiveCopyRound(entry(DEC, blocks))).toBeNull();
			});

			it("returns the schedule's trackingAction when set", () => {
				const nov = novSchedule({ dataObject: { trackingAction: 'EXP-MP-1-Nov2026' } });
				const result = selectActiveCopyRound(entry({}, [roundBlock('tip-copy-nov-a', nov)]));

				expect(result.trackingAction).toBe('EXP-MP-1-Nov2026');
			});

			it('returns a null trackingAction when it is missing, blank or not text', () => {
				[undefined, {}, { trackingAction: '  ' }, { trackingAction: 42 }].forEach(dataObject => {
					const parent = entry({}, [roundBlock('tip-copy-nov-a', novSchedule({ dataObject }))]);
					expect(selectActiveCopyRound(parent).trackingAction).toBeNull();
				});
			});
		});
	});

	describe('getExperimentCopy', () => {
		const variants = {
			a: { headline: 'Control headline', subHeadline: 'Tip {percentage}% on {amount}' },
			b: { headline: 'Variant headline', subHeadline: '' },
		};

		it('returns the assigned variant field', () => {
			expect(getExperimentCopy(variants, 'b', 'headline')).toBe('Variant headline');
		});

		it('falls back to control when the version is null, undefined or unknown', () => {
			expect(getExperimentCopy(variants, null, 'headline')).toBe('Control headline');
			expect(getExperimentCopy(variants, undefined, 'headline')).toBe('Control headline');
			expect(getExperimentCopy(variants, 'unassigned', 'headline')).toBe('Control headline');
		});

		it('returns null when there is no usable copy', () => {
			expect(getExperimentCopy(null, 'a', 'headline')).toBeNull();
			expect(getExperimentCopy(undefined, 'a', 'headline')).toBeNull();
			expect(getExperimentCopy({}, 'z', 'headline')).toBeNull();
			expect(getExperimentCopy(variants, 'a', 'missingField')).toBeNull();
			expect(getExperimentCopy(variants, 'b', 'subHeadline')).toBeNull();
		});

		it('returns null when the field is not plain text', () => {
			const richText = { a: { bodyCopy: { nodeType: 'document', content: [] } } };
			expect(getExperimentCopy(richText, 'a', 'bodyCopy')).toBeNull();
		});

		it('fills every placeholder, coercing values and keeping dollar signs intact', () => {
			const copy = getExperimentCopy(variants, 'a', 'subHeadline', { percentage: 15, amount: '$25' });
			expect(copy).toBe('Tip 15% on $25');
		});

		it('leaves tokens untouched when their replacement value is null or undefined', () => {
			const copy = getExperimentCopy(variants, 'a', 'subHeadline', { percentage: null, amount: undefined });
			expect(copy).toBe('Tip {percentage}% on {amount}');
		});

		it('inserts replacement values verbatim, including dollar-sequence characters', () => {
			expect(getExperimentCopy(variants, 'a', 'subHeadline', { percentage: 15, amount: '$&' }))
				.toBe('Tip 15% on $&');
		});

		it('replaces repeated tokens and leaves unknown tokens untouched', () => {
			const repeated = { a: { headline: '{name} and {name} met {other}' } };
			expect(getExperimentCopy(repeated, 'a', 'headline', { name: 'Ana' })).toBe('Ana and Ana met {other}');
		});
	});
});
