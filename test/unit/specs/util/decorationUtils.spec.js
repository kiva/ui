import {
	randomDecorationPositions, offsetWithin, toExclusionRect, getExclusionRects, respawnDecoration,
} from '#src/util/animation/decorationUtils';
import Alea from '#src/util/experiment/Alea';

describe('randomDecorationPositions', () => {
	const ZONES = [
		{ left: [4, 24], top: [6, 48] },
		{ left: [76, 96], top: [12, 48] },
	];

	const isInsideZone = (point, zones) => zones.some(zone => point.left >= zone.left[0]
		&& point.left <= zone.left[1]
		&& point.top >= zone.top[0]
		&& point.top <= zone.top[1]);

	it('returns the requested number of points', () => {
		const points = randomDecorationPositions({
			count: 5, zones: ZONES, minGap: 4, random: Alea(1),
		});
		expect(points).toHaveLength(5);
	});

	it('places every point inside one of the zones', () => {
		const points = randomDecorationPositions({
			count: 20, zones: ZONES, minGap: 4, random: Alea(7),
		});
		points.forEach(point => {
			const asNumbers = { left: parseFloat(point.left), top: parseFloat(point.top) };
			expect(isInsideZone(asNumbers, ZONES)).toBe(true);
		});
	});

	it('keeps delays within [0, 3) seconds', () => {
		const points = randomDecorationPositions({
			count: 20, zones: ZONES, minGap: 0, random: Alea(3),
		});
		points.forEach(point => {
			const delay = parseFloat(point.delay);
			expect(delay).toBeGreaterThanOrEqual(0);
			expect(delay).toBeLessThan(3);
		});
	});

	it('spaces points at least minGap apart when the zones have room', () => {
		const wideZones = [{ left: [0, 100], top: [0, 100] }];
		const points = randomDecorationPositions({
			count: 8,
			zones: wideZones,
			minGap: 10,
			random: Alea(42),
			maxAttempts: 30,
		});

		for (let i = 0; i < points.length; i += 1) {
			for (let j = i + 1; j < points.length; j += 1) {
				const dLeft = parseFloat(points[i].left) - parseFloat(points[j].left);
				const dTop = parseFloat(points[i].top) - parseFloat(points[j].top);
				const distance = Math.sqrt((dLeft * dLeft) + (dTop * dTop));
				// Rounding to 1 decimal for display can shave a hair off the real gap.
				expect(distance).toBeGreaterThanOrEqual(10 - 0.15);
			}
		}
	});

	it('terminates and still returns count items when the gap is impossible', () => {
		const tinyZone = [{ left: [0, 0.1], top: [0, 0.1] }];
		const points = randomDecorationPositions({
			count: 6,
			zones: tinyZone,
			minGap: 1000,
			random: Alea(99),
			maxAttempts: 20,
		});
		expect(points).toHaveLength(6);
	});

	it('defaults minGap to 0 when omitted, same as passing it explicitly', () => {
		const zones = [{ left: [0, 100], top: [0, 100] }];
		const withMinGapOmitted = randomDecorationPositions({ count: 5, zones, random: Alea(4) });
		const withMinGapZero = randomDecorationPositions({
			count: 5, zones, minGap: 0, random: Alea(4),
		});
		expect(withMinGapOmitted).toEqual(withMinGapZero);
	});

	describe('sizeRange', () => {
		it('gives every point a whole-pixel size within the range', () => {
			const points = randomDecorationPositions({
				count: 20, zones: ZONES, minGap: 0, random: Alea(11), sizeRange: [4, 16],
			});
			points.forEach(point => {
				expect(point.size).toMatch(/^\d+px$/);
				const size = parseInt(point.size, 10);
				expect(size).toBeGreaterThanOrEqual(4);
				expect(size).toBeLessThanOrEqual(16);
			});
		});

		it('omits the size key entirely when no sizeRange is given', () => {
			const points = randomDecorationPositions({
				count: 5, zones: ZONES, minGap: 0, random: Alea(11),
			});
			points.forEach(point => {
				expect(point).not.toHaveProperty('size');
			});
		});
	});

	describe('existing', () => {
		// A single zone plus a scripted random sequence puts the first candidate exactly on
		// the seeded existing point (which must be rejected) before a second candidate far
		// from it (which must be accepted), which shows existing feeds the same gap check.
		const buildRetrySequence = () => {
			const sequence = [0, 0.5, 0.5, 0, 0.9, 0.9, 0.123];
			let i = 0;
			return () => {
				const value = sequence[i];
				i += 1;
				return value;
			};
		};

		it('rejects a candidate landing on a seeded existing point given as percent strings, and retries', () => {
			const points = randomDecorationPositions({
				count: 1,
				zones: [{ left: [0, 100], top: [0, 100] }],
				minGap: 10,
				random: buildRetrySequence(),
				maxAttempts: 5,
				existing: [{ top: '50%', left: '50%' }],
			});

			expect(points[0]).toMatchObject({ left: '90%', top: '90%' });
		});

		it('rejects a candidate landing on a seeded existing point given as plain numbers, and retries', () => {
			const points = randomDecorationPositions({
				count: 1,
				zones: [{ left: [0, 100], top: [0, 100] }],
				minGap: 10,
				random: buildRetrySequence(),
				maxAttempts: 5,
				existing: [{ top: 50, left: 50 }],
			});

			expect(points[0]).toMatchObject({ left: '90%', top: '90%' });
		});

		it('keeps minGap from seeded existing points under real randomness too', () => {
			const wideZones = [{ left: [0, 100], top: [0, 100] }];
			const points = randomDecorationPositions({
				count: 20,
				zones: wideZones,
				minGap: 10,
				random: Alea(42),
				maxAttempts: 30,
				existing: [{ top: '50%', left: '50%' }],
			});

			points.forEach(point => {
				const dLeft = parseFloat(point.left) - 50;
				const dTop = parseFloat(point.top) - 50;
				// Rounding to 1 decimal for display can shave a hair off the real gap.
				expect(Math.sqrt((dLeft * dLeft) + (dTop * dTop))).toBeGreaterThanOrEqual(10 - 0.15);
			});
		});

		it('matches the no-existing output when existing is omitted, so the random call sequence is unchanged', () => {
			const withoutExisting = randomDecorationPositions({
				count: 5, zones: ZONES, minGap: 4, random: Alea(9),
			});
			const withEmptyExisting = randomDecorationPositions({
				count: 5, zones: ZONES, minGap: 4, random: Alea(9), existing: [],
			});
			expect(withEmptyExisting).toEqual(withoutExisting);
		});
	});

	describe('exclusions', () => {
		const wideZones = [{ left: [0, 100], top: [0, 100] }];
		// A block covering the middle third of the zone in both axes.
		const middleExclusion = [{ left: [34, 66], top: [34, 66] }];

		it('never lands a point inside an exclusion, even with plenty of points and real randomness', () => {
			const points = randomDecorationPositions({
				count: 50,
				zones: wideZones,
				minGap: 2,
				random: Alea(5),
				exclusions: middleExclusion,
			});

			points.forEach(point => {
				const asNumbers = { left: parseFloat(point.left), top: parseFloat(point.top) };
				expect(isInsideZone(asNumbers, middleExclusion)).toBe(false);
			});
		});

		it('prefers an exclusion-free candidate over one that merely respects minGap', () => {
			// First candidate lands dead center of the exclusion (rejected outright). Second
			// candidate is outside the exclusion but too close to the seeded existing point,
			// failing minGap. With the exclusion-free candidate available, it wins over
			// retrying for a gap that was never going to be satisfied within maxAttempts.
			const sequence = [0, 0.5, 0.5, 0, 0.12, 0.12];
			let i = 0;
			const scripted = () => {
				const value = sequence[i];
				i += 1;
				return value;
			};

			const points = randomDecorationPositions({
				count: 1,
				zones: wideZones,
				minGap: 5,
				random: scripted,
				maxAttempts: 2,
				exclusions: [{ left: [40, 60], top: [40, 60] }],
				existing: [{ top: 10, left: 10 }],
			});

			expect(points[0]).toMatchObject({ left: '12%', top: '12%' });
		});

		it('falls back to an earlier exclusion-free candidate when the final attempt lands back inside', () => {
			// Candidate 1 lands inside the exclusion. Candidate 2 is outside it but too close
			// to the seeded existing point, so the retries continue and it's kept as the
			// fallback. Candidate 3 lands inside again and is the last one tried before
			// maxAttempts runs out, so the result is candidate 2, not candidate 3.
			const sequence = [
				0, 0.5, 0.5, // candidate 1: (50, 50), inside
				0, 0.1, 0.1, // candidate 2: (10, 10), outside but fails minGap
				0, 0.5, 0.5, // candidate 3: (50, 50), inside again, last tried
			];
			let i = 0;
			const scripted = () => {
				const value = sequence[i];
				i += 1;
				return value;
			};

			const points = randomDecorationPositions({
				count: 1,
				zones: wideZones,
				minGap: 3,
				random: scripted,
				maxAttempts: 3,
				exclusions: [{ left: [40, 60], top: [40, 60] }],
				existing: [{ top: 9, left: 9 }],
			});

			expect(points[0]).toMatchObject({ left: '10%', top: '10%' });
		});

		it('still returns a point when no candidate ever clears the exclusion', () => {
			// The exclusion covers the entire zone, so every attempt lands inside it.
			const points = randomDecorationPositions({
				count: 1,
				zones: wideZones,
				minGap: 0,
				random: Alea(3),
				maxAttempts: 4,
				exclusions: [{ left: [0, 100], top: [0, 100] }],
			});

			expect(points).toHaveLength(1);
		});

		it('reproduces the previous outputs exactly when exclusions is omitted', () => {
			const withoutExclusions = randomDecorationPositions({
				count: 10, zones: ZONES, minGap: 4, random: Alea(13),
			});
			const withEmptyExclusions = randomDecorationPositions({
				count: 10, zones: ZONES, minGap: 4, random: Alea(13), exclusions: [],
			});
			expect(withEmptyExclusions).toEqual(withoutExclusions);
		});
	});
});

describe('offsetWithin', () => {
	it('sums offsets across a multi-level chain up to the ancestor, returning the element\'s own width/height', () => {
		const ancestor = {};
		const middle = { offsetTop: 10, offsetLeft: 5, offsetParent: ancestor };
		const el = {
			offsetTop: 20, offsetLeft: 8, offsetWidth: 100, offsetHeight: 40, offsetParent: middle,
		};

		expect(offsetWithin(el, ancestor)).toEqual({
			top: 30, left: 13, width: 100, height: 40,
		});
	});

	it('returns null when the chain never reaches the ancestor', () => {
		const el = {
			offsetTop: 5, offsetLeft: 5, offsetWidth: 10, offsetHeight: 10, offsetParent: null,
		};

		expect(offsetWithin(el, {})).toBeNull();
	});

	it('returns null for a missing el', () => {
		expect(offsetWithin(null, {})).toBeNull();
	});
});

describe('toExclusionRect', () => {
	const BOX = {
		top: 100, left: 200, width: 50, height: 50,
	};

	it('converts a box to percent of the container with no padding', () => {
		expect(toExclusionRect(BOX, 1000, 500, 0)).toEqual({
			left: [20, 25],
			top: [20, 30],
		});
	});

	it('pads every side before converting to percent', () => {
		expect(toExclusionRect(BOX, 1000, 500, 10)).toEqual({
			left: [19, 26],
			top: [18, 32],
		});
	});

	it('defaults padding to 0 when omitted', () => {
		expect(toExclusionRect(BOX, 1000, 500)).toEqual({
			left: [20, 25],
			top: [20, 30],
		});
	});
});

describe('getExclusionRects', () => {
	const CONTAINER_WIDTH = 1000;
	const CONTAINER_HEIGHT = 500;

	const buildContainer = () => ({ offsetWidth: CONTAINER_WIDTH, offsetHeight: CONTAINER_HEIGHT });

	const buildElement = (container, {
		top, left, width, height,
	}) => ({
		offsetTop: top,
		offsetLeft: left,
		offsetWidth: width,
		offsetHeight: height,
		offsetParent: container,
	});

	it('returns [] when the container is missing', () => {
		expect(getExclusionRects({ container: null, elements: [] })).toEqual([]);
	});

	it('returns [] when the container has zero offsetWidth', () => {
		const container = { offsetWidth: 0, offsetHeight: CONTAINER_HEIGHT };
		expect(getExclusionRects({ container, elements: [] })).toEqual([]);
	});

	it('returns [] when the container has zero offsetHeight', () => {
		const container = { offsetWidth: CONTAINER_WIDTH, offsetHeight: 0 };
		expect(getExclusionRects({ container, elements: [] })).toEqual([]);
	});

	it('skips elements that are missing or never reach the container, without throwing', () => {
		const container = buildContainer();
		const unmeasurable = {
			offsetTop: 5, offsetLeft: 5, offsetWidth: 10, offsetHeight: 10, offsetParent: null,
		};

		expect(getExclusionRects({ container, elements: [null, unmeasurable] })).toEqual([]);
	});

	it('pads each measurable element box before converting to percent', () => {
		const container = buildContainer();
		const el = buildElement(container, {
			top: 100, left: 200, width: 50, height: 50,
		});

		const result = getExclusionRects({ container, elements: [el], padding: 10 });

		expect(result).toEqual([{ left: [19, 26], top: [18, 32] }]);
	});

	it('omits the corner box when cornerSize is 0 (the default)', () => {
		const container = buildContainer();
		expect(getExclusionRects({ container, elements: [] })).toEqual([]);
	});

	it('appends the top-right corner box only when cornerSize is greater than 0', () => {
		const container = buildContainer();
		const result = getExclusionRects({ container, elements: [], cornerSize: 100 });

		expect(result).toEqual([{ left: [90, 100], top: [0, 20] }]);
	});

	it('computes exact percent values for a known 1000x500 layout with elements and a corner', () => {
		const container = buildContainer();
		const measurable = buildElement(container, {
			top: 100, left: 200, width: 50, height: 50,
		});
		const unmeasurable = {
			offsetTop: 0, offsetLeft: 0, offsetWidth: 5, offsetHeight: 5, offsetParent: null,
		};

		const result = getExclusionRects({
			container,
			elements: [measurable, null, unmeasurable],
			padding: 10,
			cornerSize: 100,
		});

		expect(result).toEqual([
			{ left: [19, 26], top: [18, 32] },
			{ left: [90, 100], top: [0, 20] },
		]);
	});
});

describe('respawnDecoration', () => {
	const ZONES = [{ left: [0, 100], top: [0, 100] }];
	const STARS = [
		{ top: '10%', left: '10%', delay: '0.5s' },
		{ top: '50%', left: '50%', delay: '1.2s' },
	];
	const DOTS = [
		{ top: '90%', left: '90%', delay: '2s' },
	];

	it('keeps the respawned point\'s delay', () => {
		const fresh = respawnDecoration({
			groups: [STARS, DOTS], groupIndex: 0, index: 1, zones: ZONES, random: Alea(3),
		});
		expect(fresh.delay).toBe('1.2s');
	});

	it('returns a single freshly placed point inside the zones', () => {
		const fresh = respawnDecoration({
			groups: [STARS, DOTS],
			groupIndex: 1,
			index: 0,
			zones: [{ left: [20, 30], top: [40, 60] }],
			random: Alea(5),
		});
		expect(parseFloat(fresh.left)).toBeGreaterThanOrEqual(20);
		expect(parseFloat(fresh.left)).toBeLessThanOrEqual(30);
		expect(parseFloat(fresh.top)).toBeGreaterThanOrEqual(40);
		expect(parseFloat(fresh.top)).toBeLessThanOrEqual(60);
	});

	it('passes sizeRange through to placement', () => {
		const fresh = respawnDecoration({
			groups: [STARS, DOTS], groupIndex: 0, index: 0, zones: ZONES, sizeRange: [8, 8], random: Alea(2),
		});
		expect(fresh.size).toBe('8px');
	});

	it('seeds every other point across all groups, excluding only the one being respawned', () => {
		// Same random stream as a direct call seeded with the other points, so the outputs
		// match exactly only if the same existing set was used.
		const expected = randomDecorationPositions({
			count: 1,
			zones: ZONES,
			minGap: 30,
			random: Alea(11),
			existing: [STARS[1], DOTS[0]],
		})[0];

		const fresh = respawnDecoration({
			groups: [STARS, DOTS], groupIndex: 0, index: 0, zones: ZONES, minGap: 30, random: Alea(11),
		});

		expect(fresh).toEqual({ ...expected, delay: '0.5s' });
	});

	it('does not mutate the groups', () => {
		const stars = STARS.map(point => ({ ...point }));
		const dots = DOTS.map(point => ({ ...point }));
		respawnDecoration({
			groups: [stars, dots], groupIndex: 0, index: 0, zones: ZONES, random: Alea(4),
		});
		expect(stars).toEqual(STARS);
		expect(dots).toEqual(DOTS);
	});
});
