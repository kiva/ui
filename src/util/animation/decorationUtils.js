/**
 * Scatters points across percent-based zones, keeping them minGap apart where there's room.
 * Exclusions are a hard constraint checked before minGap: if no candidate clears both within
 * maxAttempts, the last one outside every exclusion wins, and failing that the last one tried,
 * so placement always finishes. `existing` points are kept clear of but not returned. Leaving
 * out `existing` or `exclusions` keeps the output and random-call sequence unchanged.
 *
 * @returns {Array<{top: string, left: string, delay: string, size?: string}>} Placed points,
 *   with `size` only when sizeRange is given.
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

// An element's box in pixels relative to ancestor, summed up its offsetParent chain. Null
// when the chain never reaches ancestor, so the caller skips it.
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
 * Converts a pixel box from offsetWithin into a padded exclusion rectangle, in percent of
 * the container.
 */
export function toExclusionRect(box, containerWidth, containerHeight, padding = 0) {
	const paddedLeft = ((box.left - padding) / containerWidth) * 100;
	const paddedRight = ((box.left + box.width + padding) / containerWidth) * 100;
	const paddedTop = ((box.top - padding) / containerHeight) * 100;
	const paddedBottom = ((box.top + box.height + padding) / containerHeight) * 100;
	return { left: [paddedLeft, paddedRight], top: [paddedTop, paddedBottom] };
}

/**
 * Percent rectangles to keep decorations clear of: each measurable element, padded, plus an
 * optional square in the top-right corner. Uses offsets rather than getBoundingClientRect
 * because it runs while entrance animations still transform the elements, and offsets give
 * the settled layout. Returns [] for a container with no size.
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
 * Gives one decoration a new position (and size) at the end of an animation loop. Its delay is
 * kept, since changing animation-delay mid-run restarts the animation, and the new point
 * stays clear of every other decoration in `groups`. Other options pass through to
 * randomDecorationPositions.
 */
export function respawnDecoration({
	groups, groupIndex, index, ...placement
}) {
	const existing = groups.flatMap((group, g) => group.filter((_, i) => !(g === groupIndex && i === index)));
	const [fresh] = randomDecorationPositions({ ...placement, count: 1, existing });
	return { ...fresh, delay: groups[groupIndex][index].delay };
}
