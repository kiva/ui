// @vitest-environment node
import { createCanvas, loadImage } from 'canvas';
import draw, { compactCardDimensions, contentTypeForStyle } from '#server/util/live-loan/live-loan-draw';
import { compactColors } from '#server/util/live-loan/compact-card-constants';
import * as canvasImageUtils from '#server/util/live-loan/canvas-image-utils';

vi.mock('#server/util/live-loan/canvas-image-utils');

// Sample the right half of the bar, clear of the lighter pill background
const SAMPLE_X_FRACTION = 0.77;
// JPEG at quality 0.5 is lossy, so match the track colour within a channel tolerance
const COLOUR_TOLERANCE = 12;
// Progress-track grey is a flat grey, so any channel of its hex is the target value
const TRACK_GREY = parseInt(compactColors.progressTrack.slice(1, 3), 16);

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

// Finds the bottom-most device row containing the progress-track grey in a
// 1px-wide strip on the right half of the bar, which locates the bar vertically.
async function barBottomY(buffer) {
	const { ctx, width, height } = await decodeToContext(buffer);
	const x = Math.round(width * SAMPLE_X_FRACTION);
	const { data } = ctx.getImageData(x, 0, 1, height);
	let lastTrackRow = -1;
	for (let y = 0; y < height; y += 1) {
		const r = data[(y * 4)];
		const g = data[(y * 4) + 1];
		const b = data[(y * 4) + 2];
		const isTrackGrey = Math.abs(r - TRACK_GREY) < COLOUR_TOLERANCE
			&& Math.abs(g - TRACK_GREY) < COLOUR_TOLERANCE
			&& Math.abs(b - TRACK_GREY) < COLOUR_TOLERANCE;
		if (isTrackGrey) {
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

	it('renders the compact-bundle style as a compact-sized PNG', async () => {
		const { buffer, hasBorrowerImage } = await draw(makeLoan(), 'compact-bundle');

		expect(Buffer.isBuffer(buffer)).toBe(true);
		expect(hasBorrowerImage).toBe(true);
		// PNG signature bytes, so the card can carry an alpha channel
		expect(buffer.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
		expect(await dimensionsOf(buffer)).toEqual(compactCardDimensions);
	});

	it('renders a transparent margin around the card so it composites on any background', async () => {
		const { buffer } = await draw(makeLoan(), 'compact-bundle');

		const { ctx } = await decodeToContext(buffer);
		// The outer corner sits in the margin outside the card, so it must be fully transparent
		const cornerAlpha = ctx.getImageData(0, 0, 1, 1).data[3];

		expect(cornerAlpha).toBe(0);
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

	it('maps only the compact-bundle style to PNG, other styles to JPEG', () => {
		expect(contentTypeForStyle('compact-bundle')).toBe('image/png');
		expect(contentTypeForStyle('bundle')).toBe('image/jpeg');
		expect(contentTypeForStyle('classic')).toBe('image/jpeg');
		expect(contentTypeForStyle('legacy')).toBe('image/jpeg');
	});
});
