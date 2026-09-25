/**
 * Scatters points across a set of candidate zones, spacing them apart where the zones
 * allow it. Used to place the twinkling stars and dots on the goal-in-review headline slide.
 *
 * @param {object} options Placement inputs.
 * @param {number} options.count How many points to place.
 * @param {Array<{left: [number, number], top: [number, number]}>} options.zones Candidate
 *   rectangles in percent; a zone is picked at random per point, then a point uniformly
 *   inside it.
 * @param {number} [options.minGap] Minimum Euclidean distance, in the same percent units,
 *   to keep between placed points. A candidate too close retries up to maxAttempts, then
 *   is accepted anyway so placement always finishes.
 * @param {Function} [options.random] Source of randomness in [0, 1), injectable for tests.
 * @param {number} [options.maxAttempts] Retries per point before giving up on the gap.
 * @param {[number, number]} [options.sizeRange] Whole-pixel size bounds, [min, max] inclusive.
 *   When given, each point also gets a `size`, uniformly random within the range; omitted
 *   entirely when this is left out, so callers that don't vary size see no `size` key.
 * @param {Array<{top: string|number, left: string|number}>} [options.existing] Points already
 *   on screen, in the same percent units (as '<n>%' strings or plain numbers). Seeds the
 *   collision set so freshly placed points also keep minGap from these, without being
 *   included in the returned array themselves. Omitting it reproduces the exact output and
 *   random-call sequence of a call with no existing points at all.
 * @param {Array<{left: [number, number], top: [number, number]}>} [options.exclusions] Rectangles,
 *   in the same percent units, a point may never land inside. This is a hard constraint, checked
 *   before minGap. Each point retries up to maxAttempts for a candidate that clears every exclusion
 *   and keeps minGap. If none does, it takes the last candidate that cleared the exclusions,
 *   ignoring minGap. If no candidate ever cleared them, it takes the last candidate tried, so
 *   placement always finishes; callers should leave usable space outside their exclusions.
 *   Omitting it (the default) reproduces the exact output and random-call sequence of
 *   a call with no exclusions at all.
 * @returns {Array<{top: string, left: string, delay: string, size?: string}>} The placed points.
 */
export function randomDecorationPositions({
	count,
	zones,
	minGap = 0,
	random = Math.random,
	maxAttempts = 20,
	sizeRange,
	existing = [],
	exclusions = [],
}) {
	const placed = existing.map(point => ({
		left: typeof point.left === 'string' ? parseFloat(point.left) : point.left,
		top: typeof point.top === 'string' ? parseFloat(point.top) : point.top,
	}));
	const seededCount = placed.length;

	const pickPoint = () => {
		const zone = zones[Math.floor(random() * zones.length)];
		return {
			left: zone.left[0] + (random() * (zone.left[1] - zone.left[0])),
			top: zone.top[0] + (random() * (zone.top[1] - zone.top[0])),
		};
	};

	const isFarEnough = point => placed.every(other => {
		const dLeft = point.left - other.left;
		const dTop = point.top - other.top;
		return Math.sqrt((dLeft * dLeft) + (dTop * dTop)) >= minGap;
	});

	// A point is outside a rectangle when either coordinate falls outside that rectangle's range.
	const isOutsideExclusions = point => exclusions.every(zone => point.left < zone.left[0]
		|| point.left > zone.left[1]
		|| point.top < zone.top[0]
		|| point.top > zone.top[1]);

	for (let i = 0; i < count; i += 1) {
		let point = pickPoint();
		let lastOutsideExclusions = isOutsideExclusions(point) ? point : null;

		for (
			let attempt = 1;
			attempt < maxAttempts && !(isOutsideExclusions(point) && isFarEnough(point));
			attempt += 1
		) {
			point = pickPoint();
			if (isOutsideExclusions(point)) {
				lastOutsideExclusions = point;
			}
		}

		// Exclusions are a hard constraint: a candidate that cleared every exclusion but missed
		// minGap still beats a final candidate that landed inside one.
		if (!isOutsideExclusions(point) && lastOutsideExclusions) {
			point = lastOutsideExclusions;
		}

		placed.push(point);
	}

	return placed.slice(seededCount).map(point => {
		const position = {
			top: `${Math.round(point.top * 10) / 10}%`,
			left: `${Math.round(point.left * 10) / 10}%`,
			delay: `${Math.round(random() * 300) / 100}s`,
		};
		if (sizeRange) {
			const [min, max] = sizeRange;
			position.size = `${min + Math.floor(random() * ((max - min) + 1))}px`;
		}
		return position;
	});
}

// Sums an element's offsetTop/offsetLeft up its offsetParent chain until reaching
// ancestor, returning its box in pixels relative to ancestor. Returns null if the chain
// never reaches ancestor, so the caller can skip an element it can't measure this way
// rather than exclude the wrong box.
export function offsetWithin(el, ancestor) {
	if (!el) {
		return null;
	}
	let top = 0;
	let left = 0;
	let node = el;
	while (node && node !== ancestor) {
		top += node.offsetTop;
		left += node.offsetLeft;
		node = node.offsetParent;
	}
	if (node !== ancestor) {
		return null;
	}
	return {
		top, left, width: el.offsetWidth, height: el.offsetHeight,
	};
}

/**
 * Converts an element's offset box (as returned by offsetWithin) to a percent-of-container
 * exclusion rectangle, padded on every side.
 *
 * @param {{top: number, left: number, width: number, height: number}} box Element box in
 *   pixels, relative to the container.
 * @param {number} containerWidth Container width in pixels.
 * @param {number} containerHeight Container height in pixels.
 * @param {number} [padding] Pixels of padding kept clear around the box on every side.
 * @returns {{left: [number, number], top: [number, number]}} The padded box as percent of
 *   the container, in the same shape as a zone/exclusion rectangle passed to
 *   randomDecorationPositions.
 */
export function toExclusionRect(box, containerWidth, containerHeight, padding = 0) {
	const paddedLeft = ((box.left - padding) / containerWidth) * 100;
	const paddedRight = ((box.left + box.width + padding) / containerWidth) * 100;
	const paddedTop = ((box.top - padding) / containerHeight) * 100;
	const paddedBottom = ((box.top + box.height + padding) / containerHeight) * 100;
	return { left: [paddedLeft, paddedRight], top: [paddedTop, paddedBottom] };
}

/**
 * Rectangles, in percent of a container, that decorations should be kept clear of: each
 * measurable element in elements (padded), plus optionally a square in the container's
 * top-right corner (e.g. for a close button). Meant to be called fresh whenever placement
 * runs, since it's cheap and keeps it correct across a resize.
 *
 * Measured with offsetTop/offsetLeft/offsetWidth/offsetHeight rather than
 * getBoundingClientRect: this is meant to run while an element is still mid entrance
 * animation (a CSS transform translates and fades it in) and the container itself may be
 * mid enter-animation too. getBoundingClientRect reports wherever a transform currently has
 * an element, so it would place these boxes off by as much as the animation's own travel
 * distance from where the element actually settles; offsets reflect the final layout
 * regardless of any transform.
 *
 * An unmeasurable container (zero size, as in a test environment without layout) yields no
 * exclusions at all, leaving placement to the caller's zones alone.
 *
 * @param {object} options Exclusion inputs.
 * @param {Element} options.container Element the returned rectangles are relative to.
 * @param {Array<Element|null>} [options.elements] Elements to exclude; an entry that's
 *   missing or whose offsetParent chain never reaches container is skipped rather than
 *   excluding the wrong box.
 * @param {number} [options.padding] Pixels of padding kept clear around each element on
 *   every side.
 * @param {number} [options.cornerSize] Whole pixels for a square excluded in the
 *   container's top-right corner; 0 (the default) adds no corner exclusion.
 * @returns {Array<{left: [number, number], top: [number, number]}>} The exclusion
 *   rectangles, in percent of container, in the zone shape used by
 *   randomDecorationPositions.
 */
export function getExclusionRects({
	container, elements = [], padding = 0, cornerSize = 0,
}) {
	const containerWidth = container?.offsetWidth;
	const containerHeight = container?.offsetHeight;
	if (!containerWidth || !containerHeight) {
		return [];
	}

	const exclusions = elements
		.map(el => offsetWithin(el, container))
		.filter(Boolean)
		.map(box => toExclusionRect(box, containerWidth, containerHeight, padding));

	if (cornerSize > 0) {
		const cornerWidthPercent = (cornerSize / containerWidth) * 100;
		const cornerHeightPercent = (cornerSize / containerHeight) * 100;
		exclusions.push({
			left: [100 - cornerWidthPercent, 100],
			top: [0, cornerHeightPercent],
		});
	}

	return exclusions;
}

/**
 * Picks a new position (and size, when sizeRange is given) for one decoration that's
 * finishing an animation loop, keeping its existing delay: changing animation-delay
 * mid-run restarts or shifts the animation. The new point keeps minGap from every other
 * decoration currently on screen, across all groups.
 *
 * @param {object} options Respawn inputs; any option not listed here is passed through to
 *   randomDecorationPositions (zones, minGap, sizeRange, exclusions, random, maxAttempts).
 * @param {Array<Array<{top: string, left: string, delay: string}>>} options.groups Every
 *   group of decorations on screen (e.g. stars and dots). Not mutated.
 * @param {number} options.groupIndex Which group holds the decoration being respawned.
 * @param {number} options.index The decoration's index within its group.
 * @returns {{top: string, left: string, delay: string, size?: string}} The replacement point,
 *   for the caller to store at the same index.
 */
export function respawnDecoration({
	groups, groupIndex, index, ...placement
}) {
	const existing = groups.flatMap((group, g) => group.filter((_, i) => !(g === groupIndex && i === index)));
	const [fresh] = randomDecorationPositions({ ...placement, count: 1, existing });
	return { ...fresh, delay: groups[groupIndex][index].delay };
}
