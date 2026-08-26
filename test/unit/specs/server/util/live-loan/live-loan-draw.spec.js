// @vitest-environment node
import { createCanvas, loadImage } from 'canvas';
import draw, { compactCardDimensions } from '#server/util/live-loan/live-loan-draw';
import * as canvasImageUtils from '#server/util/live-loan/canvas-image-utils';

vi.mock('#server/util/live-loan/canvas-image-utils');

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
		expect(await dimensionsOf(buffer)).toEqual(compactCardDimensions);
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

	it('leaves the existing bundle style at its own (non-compact) dimensions', async () => {
		const { buffer } = await draw(makeLoan(), 'bundle');

		const dims = await dimensionsOf(buffer);
		expect(dims).not.toEqual(compactCardDimensions);
	});
});
