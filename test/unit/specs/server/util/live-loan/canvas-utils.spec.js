// @vitest-environment node
import {
	styledRunsToWords, wrapStyledText, fitPillLabels, coverRect,
} from '#server/util/live-loan/canvas-utils';

// Fake 2d context: 1px per character, records every fillText with the active font
function makeFakeCtx() {
	const calls = [];
	return {
		font: '',
		fillStyle: '',
		measureText(str) {
			return { width: str.length };
		},
		fillText(text, x, y) {
			calls.push({
				text, x, y, font: this.font
			});
		},
		calls,
	};
}

describe('coverRect', () => {
	it('scales a 4:3 landscape source to cover a square, cropping the sides', () => {
		const {
			width, height, offsetX, offsetY
		} = coverRect(960, 720, 60);

		expect(width).toBeCloseTo(80);
		expect(height).toBeCloseTo(60);
		// horizontal overflow is centered (negative), vertical is flush
		expect(offsetX).toBeCloseTo(-10);
		expect(offsetY).toBeCloseTo(0);
	});

	it('scales a portrait source to cover a square, cropping top and bottom', () => {
		const {
			width, height, offsetX, offsetY
		} = coverRect(720, 960, 60);

		expect(width).toBeCloseTo(60);
		expect(height).toBeCloseTo(80);
		expect(offsetX).toBeCloseTo(0);
		expect(offsetY).toBeCloseTo(-10);
	});

	it('does not distort a square source', () => {
		const {
			width, height, offsetX, offsetY
		} = coverRect(100, 100, 60);

		expect(width).toBeCloseTo(60);
		expect(height).toBeCloseTo(60);
		expect(offsetX).toBeCloseTo(0);
		expect(offsetY).toBeCloseTo(0);
	});
});

describe('fitPillLabels', () => {
	// pill width = 3*padding + textWidth (1px/char); gap between pills
	it('keeps every pill when they all fit', () => {
		const ctx = makeFakeCtx();

		expect(fitPillLabels(ctx, ['ab', 'cd'], 200, 8, 8)).toEqual(['ab', 'cd']);
	});

	it('drops a trailing pill that overflows the row', () => {
		const ctx = makeFakeCtx();

		// first pill = 24+2 = 26 (fits in 30); second needs 8+26 more -> overflow
		expect(fitPillLabels(ctx, ['ab', 'cd'], 30, 8, 8)).toEqual(['ab']);
	});

	it('drops a lone pill that is too wide on its own', () => {
		const ctx = makeFakeCtx();

		// pill = 24+10 = 34 > 30 -> dropped entirely (no ellipsis)
		expect(fitPillLabels(ctx, ['abcdefghij'], 30, 8, 8)).toEqual([]);
	});

	it('returns an empty array for no callouts', () => {
		const ctx = makeFakeCtx();

		expect(fitPillLabels(ctx, [], 200, 8, 8)).toEqual([]);
	});
});

describe('styledRunsToWords', () => {
	it('splits runs into words carrying their bold flag', () => {
		const words = styledRunsToWords([
			{ text: '$100 helps ', bold: false },
			{ text: 'Margaret in Guatemala', bold: true },
			{ text: ' to build', bold: false },
		]);

		expect(words).toEqual([
			{ word: '$100', bold: false },
			{ word: 'helps', bold: false },
			{ word: 'Margaret', bold: true },
			{ word: 'in', bold: true },
			{ word: 'Guatemala', bold: true },
			{ word: 'to', bold: false },
			{ word: 'build', bold: false },
		]);
	});
});

describe('wrapStyledText', () => {
	const fonts = { regularFont: 'regular', boldFont: 'bold' };

	it('draws bold words with the bold font and regular words with the regular font', () => {
		const ctx = makeFakeCtx();
		const runs = [
			{ text: 'a ', bold: false },
			{ text: 'Bob', bold: true },
		];

		const lines = wrapStyledText(ctx, runs, 0, 0, 1000, 4, 10, fonts);

		expect(ctx.calls.map(c => ({ text: c.text, font: c.font }))).toEqual([
			{ text: 'a', font: 'regular' },
			{ text: 'Bob', font: 'bold' },
		]);
		expect(lines).toBe(1);
	});

	it('wraps words onto a new line when they exceed the max width and returns the line count', () => {
		const ctx = makeFakeCtx();
		const runs = [{ text: 'aaaa bbbb cccc', bold: false }];

		// maxWidth 9 fits one 4-char word per line (word + trailing space)
		const lines = wrapStyledText(ctx, runs, 0, 0, 9, 4, 10, fonts);

		const ys = ctx.calls.map(c => c.y);
		expect(ys).toEqual([0, 10, 20]);
		expect(lines).toBe(3);
	});

	it('clamps to maxLines, appends an ellipsis, and returns the clamped count', () => {
		const ctx = makeFakeCtx();
		const runs = [{ text: 'aaaa bbbb cccc', bold: false }];

		const lines = wrapStyledText(ctx, runs, 0, 0, 9, 1, 10, fonts);

		// Only the first line is drawn; nothing lands on a second line
		expect(ctx.calls.every(c => c.y === 0)).toBe(true);
		// The final drawn token includes the ellipsis
		expect(ctx.calls.at(-1).text).toContain('…');
		expect(lines).toBe(1);
	});
});
