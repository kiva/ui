// @vitest-environment node
import { createCanvas, loadImage } from 'canvas';
import draw, { compactCardDimensions } from '#server/util/live-loan/live-loan-draw';
import { compactColors } from '#server/util/live-loan/compact-card-constants';
import * as canvasImageUtils from '#server/util/live-loan/canvas-image-utils';

vi.mock('#server/util/live-loan/canvas-image-utils');

// Sample the right half of the bar, clear of the lighter pill background
const SAMPLE_X_FRACTION = 0.77;
// JPEG is lossy, so match a flat colour within a channel tolerance
const COLOUR_TOLERANCE = 12;
// Both greys are flat, so any channel of the hex is the target value
const TRACK_GREY = parseInt(compactColors.progressTrack.slice(1, 3), 16);
const BORDER_GREY = parseInt(compactColors.border.slice(1, 3), 16);

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

// Decodes an image buffer onto a canvas context so its pixels can be sampled
async function decodeToContext(buffer) {
	const img = await loadImage(buffer);
	const ctx = createCanvas(img.width, img.height).getContext('2d');
	ctx.drawImage(img, 0, 0);
	return { ctx, width: img.width, height: img.height };
}

// True when row y of a decoded 1px column matches the given flat grey within tolerance.
function isGreyRow(data, y, target) {
	const r = data[(y * 4)];
	const g = data[(y * 4) + 1];
	const b = data[(y * 4) + 2];
	return Math.abs(r - target) < COLOUR_TOLERANCE
		&& Math.abs(g - target) < COLOUR_TOLERANCE
		&& Math.abs(b - target) < COLOUR_TOLERANCE;
}

// Finds the top-most device row containing the border grey in a 1px-wide strip
// down the horizontal centre, which locates the card's top border edge.
async function topBorderY(buffer) {
	const { ctx, width, height } = await decodeToContext(buffer);
	const x = Math.round(width / 2);
	const { data } = ctx.getImageData(x, 0, 1, height);
	for (let y = 0; y < height; y += 1) {
		if (isGreyRow(data, y, BORDER_GREY)) {
			return y;
		}
	}
	return -1;
}

// Finds the bottom-most device row containing the progress-track grey in a
// 1px-wide strip on the right half of the bar, which locates the bar vertically.
async function barBottomY(buffer) {
	const { ctx, width, height } = await decodeToContext(buffer);
	const x = Math.round(width * SAMPLE_X_FRACTION);
	const { data } = ctx.getImageData(x, 0, 1, height);
	let lastTrackRow = -1;
	for (let y = 0; y < height; y += 1) {
		if (isGreyRow(data, y, TRACK_GREY)) {
			lastTrackRow = y;
		}
	}
	return lastTrackRow;
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

	it('leaves the existing bundle style at its own (non-compact) dimensions', async () => {
		const { buffer } = await draw(makeLoan(), 'bundle');

		const dims = await dimensionsOf(buffer);
		expect(dims).not.toEqual(compactCardDimensions);
	});
});
