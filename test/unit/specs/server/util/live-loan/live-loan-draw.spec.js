// @vitest-environment node
import { createCanvas, loadImage } from 'canvas';
import draw, { compactCardDimensions } from '#server/util/live-loan/live-loan-draw';
import {
	compactColors,
	compactCardPadding,
	compactTopRowHeight,
	compactSectionGap,
	compactResizeFactor,
} from '#server/util/live-loan/compact-card-constants';
import * as canvasImageUtils from '#server/util/live-loan/canvas-image-utils';

vi.mock('#server/util/live-loan/canvas-image-utils');

// Sample the right half of the bar, clear of the lighter pill background
const SAMPLE_X_FRACTION = 0.77;
// JPEG is lossy, so match a flat colour within a channel tolerance
const COLOUR_TOLERANCE = 12;

function hexToRgb(hex) {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16),
	};
}

const TRACK_COLOUR = hexToRgb(compactColors.progressTrack);
const BORDER_COLOUR = hexToRgb(compactColors.border);

// A real (drawable) node-canvas stands in for the borrower photo
function fakeBorrowerImage() {
	return createCanvas(120, 120);
}

function makeLoan(overrides = {}) {
	return {
		name: 'Margaret',
		id: 1,
		geocode: { country: { name: 'Guatemala' } },
		use: 'To build a sanitary toilet to improve her family health',
		loanAmount: 1000,
		status: 'fundraising',
		distributionModel: 'fieldPartner',
		borrowerCount: 1,
		anonymizationLevel: 'none',
		activity: { name: 'Sanitation' },
		sector: { name: 'Health' },
		tags: [],
		tagsData: [],
		themes: [],
		loanFundraisingInfo: { fundedAmount: 115 },
		...overrides,
	};
}

async function dimensionsOf(buffer) {
	const img = await loadImage(buffer);
	return { width: img.width, height: img.height };
}

// Decodes an image buffer and returns the single pixel column at the given
// fraction of its width, which is all the row scans below need.
async function decodeColumn(buffer, xFraction) {
	const img = await loadImage(buffer);
	const x = Math.round(img.width * xFraction);
	const ctx = createCanvas(1, img.height).getContext('2d');
	ctx.drawImage(img, -x, 0);
	return { data: ctx.getImageData(0, 0, 1, img.height).data, height: img.height };
}

// True when row y of a decoded 1px column matches the given flat colour within tolerance.
function isColourRow(data, y, target) {
	const r = data[(y * 4)];
	const g = data[(y * 4) + 1];
	const b = data[(y * 4) + 2];
	return Math.abs(r - target.r) < COLOUR_TOLERANCE
		&& Math.abs(g - target.g) < COLOUR_TOLERANCE
		&& Math.abs(b - target.b) < COLOUR_TOLERANCE;
}

// Finds the top-most device row containing the border colour in a 1px-wide strip
// down the horizontal centre, which locates the card's top border edge.
async function topBorderY(buffer) {
	const { data, height } = await decodeColumn(buffer, 0.5);
	for (let y = 0; y < height; y += 1) {
		if (isColourRow(data, y, BORDER_COLOUR)) {
			return y;
		}
	}
	return -1;
}

// Finds the bottom-most device row containing the progress-track grey in a
// 1px-wide strip on the right half of the bar, which locates the bar vertically.
async function barBottomY(buffer) {
	const { data, height } = await decodeColumn(buffer, SAMPLE_X_FRACTION);
	let lastTrackRow = -1;
	for (let y = 0; y < height; y += 1) {
		if (isColourRow(data, y, TRACK_COLOUR)) {
			lastTrackRow = y;
		}
	}
	return lastTrackRow;
}

// Anything this dark in the card is glyph ink rather than background or bar
const TEXT_LUMINANCE_CEILING = 128;

// Counts text-dark pixels in a horizontal band of the card, inside the padding so
// the card border never counts as text.
async function darkPixelsInBand(buffer, topDeviceY, bottomDeviceY) {
	const img = await loadImage(buffer);
	const ctx = createCanvas(img.width, img.height).getContext('2d');
	ctx.drawImage(img, 0, 0);
	const left = compactCardPadding * compactResizeFactor;
	const { data } = ctx.getImageData(left, topDeviceY, img.width - (left * 2), bottomDeviceY - topDeviceY);
	let count = 0;
	for (let i = 0; i < data.length; i += 4) {
		const luminance = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114);
		if (luminance < TEXT_LUMINANCE_CEILING) {
			count += 1;
		}
	}
	return count;
}

describe('draw – compact-bundle style', () => {
	beforeEach(() => {
		canvasImageUtils.loadBorrowerImage.mockResolvedValue({
			image: fakeBorrowerImage(),
			hasBorrowerImage: true,
		});
	});

	it('renders the compact-bundle style as a compact-sized JPEG', async () => {
		const { buffer, hasBorrowerImage } = await draw(makeLoan(), 'compact-bundle');

		expect(Buffer.isBuffer(buffer)).toBe(true);
		expect(hasBorrowerImage).toBe(true);
		// JPEG start-of-image marker
		expect(buffer.subarray(0, 3).toString('hex')).toBe('ffd8ff');
		expect(await dimensionsOf(buffer)).toEqual(compactCardDimensions);
	});

	it('draws a hairline border along the top edge of the card', async () => {
		const { buffer } = await draw(makeLoan(), 'compact-bundle');

		const borderY = await topBorderY(buffer);

		// The border is found (not -1) and sits at the very top edge, well above the
		// progress track lower down.
		expect(borderY).toBeGreaterThanOrEqual(0);
		expect(borderY).toBeLessThan(compactCardDimensions.height * 0.1);
	});

	it('passes hasBorrowerImage through when the borrower photo is missing', async () => {
		canvasImageUtils.loadBorrowerImage.mockResolvedValue({
			image: fakeBorrowerImage(),
			hasBorrowerImage: false,
		});

		const { hasBorrowerImage } = await draw(makeLoan(), 'compact-bundle');

		expect(hasBorrowerImage).toBe(false);
	});

	it('renders an anonymized loan without throwing', async () => {
		const { buffer } = await draw(makeLoan({ anonymizationLevel: 'full' }), 'compact-bundle');

		expect(Buffer.isBuffer(buffer)).toBe(true);
	});

	it('pins the progress bar to the card bottom regardless of use-text length', async () => {
		const shortUse = await draw(makeLoan({ use: 'Bread.' }), 'compact-bundle');
		const longUse = await draw(
			makeLoan({
				use: 'To purchase additional flour, sugar, yeast, and other raw baking materials '
					+ 'in bulk so she can expand her neighbourhood bakery and hire an assistant.',
			}),
			'compact-bundle',
		);

		const shortBottom = await barBottomY(shortUse.buffer);
		const longBottom = await barBottomY(longUse.buffer);

		expect(shortBottom).toBeGreaterThan(0);
		expect(longBottom).toBeGreaterThan(0);
		// The bar must sit near the bottom of the card, not partway up.
		expect(longBottom).toBeGreaterThan(compactCardDimensions.height * 0.75);
		// ...and land in the same place whether the use text is 1 or 4 lines.
		expect(Math.abs(shortBottom - longBottom)).toBeLessThanOrEqual(3);
	});

	it('keeps a full-length use statement inside the space reserved above the pills', async () => {
		const { buffer } = await draw(
			makeLoan({
				use: 'To purchase additional flour, sugar, yeast, and other raw baking materials '
					+ 'in bulk so she can expand her neighbourhood bakery and hire an assistant.',
			}),
			'compact-bundle',
		);

		// The gap between the reserved top row and the pill row must stay empty: if the
		// use text outgrows its reserved height it descends into the pills.
		const gapTop = (compactCardPadding + compactTopRowHeight) * compactResizeFactor;
		const gapBottom = gapTop + (compactSectionGap * compactResizeFactor);

		expect(await darkPixelsInBand(buffer, gapTop, gapBottom)).toBe(0);
	});

	it('leaves the existing bundle style at its own (non-compact) dimensions', async () => {
		const { buffer } = await draw(makeLoan(), 'bundle');

		const dims = await dimensionsOf(buffer);
		expect(dims).not.toEqual(compactCardDimensions);
	});
});
