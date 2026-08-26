import { mdiMapMarker } from '@mdi/js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
	createCanvas, CanvasRenderingContext2D, registerFont
} from 'canvas';
import deePool from 'deepool';
import numeral from 'numeral';
import { polyfillPath2D } from 'path2d-polyfill';
import {
	ellipsisLine, drawPill, wrapText, wrapStyledText, fitPillLabels, coverRect, roundRect
} from './canvas-utils.js';
import { loadBorrowerImage } from './canvas-image-utils.js';
import getLoanCallouts from '../../../src/util/loanCallouts.js';
import getLoanUse from '../../../src/util/loanUse.js';
import { buildCompactLoanUseRuns, buildToGoText } from './compact-card-text.js';
import {
	compactResizeFactor,
	compactCardWidth,
	compactCardPadding,
	compactCardRadius,
	compactImageSize,
	compactImageRadius,
	compactImageGap,
	compactUseLineHeight,
	compactMaxUseLines,
	compactSectionGap,
	compactPillHeight,
	compactPillPadding,
	compactPillGap,
	compactToGoLineHeight,
	compactToGoBarGap,
	compactBarHeight,
	compactCardMargin,
	compactCardHeight,
	compactCardDimensions,
	compactColors,
	compactRegularFont,
	compactMediumFont,
} from './compact-card-constants.js';
import { trace } from '../mockTrace.js';

// Re-exported for the image-dimension assertions in the renderer's tests
export { compactCardDimensions } from './compact-card-constants.js';

// Polyfill Path2D for material design icon support
global.CanvasRenderingContext2D = CanvasRenderingContext2D;
polyfillPath2D(global);

// Legacy styling constants
const resizeFactor = 3;
const cardWidth = 300 * resizeFactor;
const cardHeight = 525 * resizeFactor;
// Bundle Legacy is the legacy card with the CTA removed; shrink height to ~20px below the fundraising row
const bundleLegacyCardHeight = 450 * resizeFactor;

// Kiva Classic styling constants
const classicResizeFactor = 3;
const classicCardWidth = 440 * classicResizeFactor;
const classicCardHeight = 510 * classicResizeFactor;

function fontFile(name) {
	return join(dirname(fileURLToPath(import.meta.url)), './fonts', name);
}

trace('registerFonts', () => {
	// registerFont writes to the process-wide font host and throws if the module
	// is loaded more than once in a single process (e.g. across test files); the
	// first registration wins, so a repeat registration can be safely ignored.
	const register = (file, opts) => {
		try {
			registerFont(fontFile(file), opts);
		} catch (e) {
			// Font already registered for this process
		}
	};

	register('PostGrotesk-Light.ttf', { family: 'Kiva Post Grot', weight: '300' });
	register('PostGrotesk-Book.ttf', { family: 'Kiva Post Grot', weight: '400' });
	register('PostGrotesk-Medium.ttf', { family: 'Kiva Post Grot', weight: '500' });
	register('PostGrotesk-MediumItalic.ttf', { family: 'Kiva Post Grot', weight: '500', style: 'italic' });
});

// Use pool of canvas objects instead to avoid creating a new canvas for each request
// eslint-disable-next-line prefer-arrow-callback
const legacyCanvasPool = deePool.create(function makeCanvas() {
	return trace('createLegacyCanvas', () => createCanvas(cardWidth, cardHeight));
});
// eslint-disable-next-line prefer-arrow-callback
const bundleLegacyCanvasPool = deePool.create(function makeCanvas() {
	return trace('createBundleLegacyCanvas', () => createCanvas(cardWidth, bundleLegacyCardHeight));
});

// eslint-disable-next-line prefer-arrow-callback
const classicCanvasPool = deePool.create(function makeCanvas() {
	return trace('createClassicCanvas', () => createCanvas(classicCardWidth, classicCardHeight));
});
// eslint-disable-next-line prefer-arrow-callback
const compactCanvasPool = deePool.create(function makeCanvas() {
	return trace('createCompactCanvas', () => createCanvas(compactCardDimensions.width, compactCardDimensions.height));
});
legacyCanvasPool.grow(2);
bundleLegacyCanvasPool.grow(2);
classicCanvasPool.grow(2);
compactCanvasPool.grow(2);

async function drawLegacy(loanData, { skipButton = false } = {}) {
	const pool = skipButton ? bundleLegacyCanvasPool : legacyCanvasPool;
	const poolTraceName = skipButton ? 'bundleLegacyCanvasPool' : 'legacyCanvasPool';
	const effectiveCardHeight = skipButton ? bundleLegacyCardHeight : cardHeight;
	// Get canvas & context
	const canvas = trace(`${poolTraceName}.use`, () => pool.use());
	const ctx = trace('canvas.getContext', () => canvas.getContext('2d', { alpha: false }));
	const borderThickness = 2 * resizeFactor;
	const bodyWidth = cardWidth * 0.85;
	const borrowerImgAspectRatio = 0.75;

	const kivaColors = {
		action: '#2B7C5F',
		brand: '#2AA967',
		textLight: '#999999',
		strokeGrey: '#d8d8d8',
		textDark: '#484848',
		white: '#ffffff'
	};

	try {
		// Canvas prep
		trace('canvas-prep', () => {
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, cardWidth, effectiveCardHeight);
		});

		// Borrower name
		trace('borrower-name', () => {
			const nameXPos = cardWidth / 2;
			const nameYPos = 242 * resizeFactor;
			ctx.fillStyle = kivaColors.action;
			ctx.font = `500 ${24 * resizeFactor}px "Kiva Post Grot"`;
			ctx.fillText(ellipsisLine(ctx, loanData.name, bodyWidth), nameXPos, nameYPos);
		});

		// Borrower country
		trace('borrower-country', () => {
			const countryXPos = cardWidth / 2;
			const countryYPos = 275 * resizeFactor;
			ctx.fillStyle = kivaColors.textLight;
			ctx.font = `500 ${16 * resizeFactor}px "Kiva Post Grot"`;
			ctx.fillText(ellipsisLine(ctx, loanData.geocode.country.name, bodyWidth), countryXPos, countryYPos);
		});

		// Borrower use
		trace('borrower-use', () => {
			const useXPos = cardWidth / 2;
			const useYPos = 315 * resizeFactor;
			const useMaxLines = 3;
			const useMaxLineHeight = 16 * 1.3 * resizeFactor;
			const useText = getLoanUse({ ...loanData, maxLength: 100 });
			ctx.fillStyle = kivaColors.textDark;
			ctx.font = `400 ${16 * resizeFactor}px "Kiva Post Grot"`;
			wrapText(ctx, useText, useXPos, useYPos, bodyWidth, useMaxLines, useMaxLineHeight);
		});

		// Fundraising info
		trace('fundraising-info', () => {
			const fundingXPos = (cardWidth - bodyWidth) / 2;
			const fundingYPos = 400 * resizeFactor;
			const fundingHeight = 8 * resizeFactor;
			const fundingBorderRadius = 10;
			const fundingTextYPos = fundingYPos + fundingHeight + (8 * resizeFactor);
			const fundraisingPercent = loanData.loanFundraisingInfo.fundedAmount / loanData.loanAmount;
			const fundraisingRemaining = loanData.loanAmount - loanData.loanFundraisingInfo.fundedAmount;
			// Fundraising info - bar
			roundRect(ctx, fundingXPos, fundingYPos, bodyWidth, fundingHeight, fundingBorderRadius);
			ctx.fillStyle = kivaColors.strokeGrey;
			ctx.fill();
			// eslint-disable-next-line max-len
			roundRect(ctx, fundingXPos, fundingYPos, bodyWidth * fundraisingPercent, fundingHeight, fundingBorderRadius);
			ctx.fillStyle = kivaColors.brand;
			ctx.fill();
			// Fundraising info - text
			ctx.font = `italic 500 ${14 * resizeFactor}px "Kiva Post Grot"`;
			ctx.fillText(`$${fundraisingRemaining} to go`, cardWidth / 2, fundingTextYPos);
		});

		// Button
		if (!skipButton) {
			trace('button', () => {
				const btnXPos = (cardWidth - bodyWidth) / 2;
				const btnYPos = 450 * resizeFactor;
				const btnHeight = 50 * resizeFactor;
				const btnBorderRadius = 14 * resizeFactor;
				const btnFontSize = 19;
				const btnFontRenderSize = btnFontSize * resizeFactor;
				const btnTxtXPos = cardWidth / 2;
				const btnTxtYPos = btnYPos + (btnHeight / 2) - (btnFontRenderSize / 2);
				// ctx.shadowBlur = 0;
				// ctx.shadowOffsetX = 0;
				// ctx.shadowOffsetY = 2 * resizeFactor;
				// ctx.shadowColor = kivaColors.darkBlue;
				roundRect(ctx, btnXPos, btnYPos, bodyWidth, btnHeight, btnBorderRadius);
				ctx.fillStyle = kivaColors.action;
				ctx.fill();
				ctx.shadowColor = 'transparent';
				ctx.fillStyle = kivaColors.white;
				ctx.font = `500 ${btnFontSize * resizeFactor}px "Kiva Post Grot"`;
				ctx.fillText('Lend now', btnTxtXPos, btnTxtYPos);
			});
		}

		// Borrower Image
		const hasBorrowerImage = await trace('borrower-image', async () => {
			const result = await loadBorrowerImage(loanData);
			ctx.drawImage(result.image, 0, 0, cardWidth, cardWidth * borrowerImgAspectRatio);
			return result.hasBorrowerImage;
		});

		// Add a border around everything
		trace('border', () => {
			ctx.strokeStyle = kivaColors.strokeGrey;
			ctx.lineWidth = borderThickness;
			ctx.strokeRect(
				borderThickness / 2,
				borderThickness / 2,
				cardWidth - borderThickness,
				effectiveCardHeight - borderThickness
			);
		});

		// Export to jpeg
		const buffer = trace('export-jpeg', () => canvas.toBuffer('image/jpeg', { quality: 0.5 }));

		// Recycle canvas for use in other requests
		trace(`${poolTraceName}.recycle`, () => pool.recycle(canvas));

		return { buffer, hasBorrowerImage };
	} catch (e) {
		// Recycle canvas for use in other requests
		if (canvas) {
			trace(`${poolTraceName}.recycle`, () => pool.recycle(canvas));
		}
		throw e;
	}
}

async function drawClassic(loanData, { skipButton = false } = {}) {
	// Get canvas & context
	const canvas = trace('classicCanvasPool.use', () => classicCanvasPool.use());
	const ctx = trace('canvas.getContext', () => canvas.getContext('2d', { alpha: false }));
	const borrowerImgMargin = 8 * classicResizeFactor;
	const borrowerImgAspectRatio = 0.75;
	const borrowerImgWidth = classicCardWidth - (2 * borrowerImgMargin);
	const borrowerImgHeight = borrowerImgWidth * borrowerImgAspectRatio;

	const kivaColors = {
		action: '#2B7C5F',
		brand: '#2AA967',
		textPrimary: '#212121',
		bgSecondary: '#f5f5f5',
		bgTertiary: '#e0e0e0',
		white: '#ffffff'
	};

	try {
		// Canvas prep
		trace('canvas-prep', () => {
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillStyle = kivaColors.white;
			ctx.fillRect(0, 0, classicCardWidth, classicCardHeight);
		});

		// Borrower Image
		const hasBorrowerImage = await trace('borrower-image', async () => {
			const result = await loadBorrowerImage(loanData);
			ctx.save();
			// eslint-disable-next-line max-len
			roundRect(ctx, borrowerImgMargin, borrowerImgMargin, borrowerImgWidth, borrowerImgHeight, 16 * classicResizeFactor);
			ctx.clip();
			ctx.drawImage(result.image, borrowerImgMargin, borrowerImgMargin, borrowerImgWidth, borrowerImgHeight);
			ctx.restore();
			return result.hasBorrowerImage;
		});

		// Borrower country
		trace('borrower-country', () => {
			const countryXPos = 16 * classicResizeFactor;
			const countryYPos = borrowerImgHeight - (22 * classicResizeFactor);
			ctx.font = `500 ${14 * classicResizeFactor}px "Kiva Post Grot"`;
			drawPill(
				ctx,
				loanData.geocode.country.name,
				countryXPos,
				countryYPos,
				4 * classicResizeFactor,
				kivaColors.textPrimary,
				kivaColors.white,
				mdiMapMarker
			);
		});

		// Borrower use
		trace('borrower-use', () => {
			const useXPos = 12 * classicResizeFactor;
			const useYPos = (28 * classicResizeFactor) + borrowerImgHeight;
			const useWidth = borrowerImgWidth - (8 * classicResizeFactor);
			const useMaxLines = 2;
			const useMaxLineHeight = 17 * 1.5 * classicResizeFactor;
			const useText = getLoanUse({ ...loanData, version: 2 });
			ctx.fillStyle = kivaColors.textPrimary;
			ctx.font = `400 ${17 * classicResizeFactor}px "Kiva Post Grot"`;
			wrapText(ctx, useText, useXPos, useYPos, useWidth, useMaxLines, useMaxLineHeight);
		});

		// Loan callouts
		trace('loan-callouts', () => {
			const tagYPos = 404 * classicResizeFactor;
			const callouts = getLoanCallouts(loanData);
			let lastTagRight = 8 * classicResizeFactor;
			ctx.font = `500 ${14 * classicResizeFactor}px "Kiva Post Grot"`;
			for (let i = 0; i < callouts.length; i += 1) {
				const xPos = lastTagRight + (4 * classicResizeFactor);
				const { pillWidth } = drawPill(
					ctx,
					callouts[i],
					xPos,
					tagYPos,
					8 * classicResizeFactor,
					kivaColors.textPrimary,
					kivaColors.bgSecondary
				);
				lastTagRight = xPos + pillWidth;
			}
		});

		// Fundraising info
		trace('fundraising-info', () => {
			const fundingXPos = 12 * classicResizeFactor;
			const fundingYPos = 462 * classicResizeFactor;
			const fundingHeight = 8 * classicResizeFactor;
			const fundingWidth = 98 * classicResizeFactor;
			const fundingBorderRadius = fundingHeight / 2;
			const fundingBarYPos = fundingYPos + (22 * classicResizeFactor);
			const fundraisingPercent = loanData.loanFundraisingInfo.fundedAmount / loanData.loanAmount;
			const fundraisingRemaining = loanData.loanAmount - loanData.loanFundraisingInfo.fundedAmount;
			const amountLeftFormatted = numeral(fundraisingRemaining).format('$0,0');
			// Fundraising info - text
			ctx.font = `500 ${14 * classicResizeFactor}px "Kiva Post Grot"`;
			ctx.fillStyle = kivaColors.textPrimary;
			ctx.fillText(`${amountLeftFormatted} to go`, fundingXPos, fundingYPos);
			// Fundraising info - bar
			ctx.save();
			roundRect(ctx, fundingXPos, fundingBarYPos, fundingWidth, fundingHeight, fundingBorderRadius);
			ctx.clip();
			ctx.fillStyle = kivaColors.bgTertiary;
			ctx.fill();
			// eslint-disable-next-line max-len
			roundRect(ctx, fundingXPos, fundingBarYPos, fundingWidth * fundraisingPercent, fundingHeight, fundingBorderRadius);
			ctx.fillStyle = kivaColors.brand;
			ctx.fill();
			ctx.restore();
		});

		// Button
		if (!skipButton) {
			trace('button', () => {
				const btnXPos = 252 * classicResizeFactor;
				const btnYPos = 454 * classicResizeFactor;
				const btnHeight = 48 * classicResizeFactor;
				const btnWidth = 180 * classicResizeFactor;
				const btnBorderRadius = 14 * classicResizeFactor;
				const btnFontSize = 17 * classicResizeFactor;
				const btnTxtXPos = btnXPos + (btnWidth / 2);
				const btnTxtYPos = btnYPos + (btnHeight / 2) - (btnFontSize / 2);
				// Button background
				roundRect(ctx, btnXPos, btnYPos, btnWidth, btnHeight, btnBorderRadius);
				ctx.fillStyle = kivaColors.action;
				ctx.fill();
				// Button Text
				ctx.fillStyle = kivaColors.white;
				ctx.font = `500 ${btnFontSize}px "Kiva Post Grot"`;
				ctx.textAlign = 'center';
				ctx.fillText('Lend now', btnTxtXPos, btnTxtYPos);
				ctx.textAlign = 'left';
			});
		}

		// Export to jpeg
		const buffer = trace('export-jpeg', () => canvas.toBuffer('image/jpeg', { quality: 0.25 }));

		// Recycle canvas for use in other requests
		trace('classicCanvasPool.recycle', () => classicCanvasPool.recycle(canvas));

		return { buffer, hasBorrowerImage };
	} catch (e) {
		// Recycle canvas for use in other requests
		if (canvas) {
			trace('classicCanvasPool.recycle', () => classicCanvasPool.recycle(canvas));
		}
		throw e;
	}
}

async function drawCompact(loanData) {
	const canvas = trace('compactCanvasPool.use', () => compactCanvasPool.use());
	const ctx = trace('canvas.getContext', () => canvas.getContext('2d', { alpha: false }));

	try {
		// Work in logical (unscaled) units; the pooled canvas is reused so reset
		// the transform explicitly on every render.
		trace('canvas-prep', () => {
			ctx.setTransform(compactResizeFactor, 0, 0, compactResizeFactor, 0, 0);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';

			// White background across the whole image (incl. the shadow margin)
			ctx.fillStyle = compactColors.white;
			ctx.fillRect(0, 0, compactCardWidth + (2 * compactCardMargin), compactCardHeight + (2 * compactCardMargin));

			// Card with a subtle drop shadow, baked onto the white background
			ctx.save();
			ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
			ctx.shadowBlur = 12;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 4;
			// eslint-disable-next-line max-len
			roundRect(ctx, compactCardMargin, compactCardMargin, compactCardWidth, compactCardHeight, compactCardRadius);
			ctx.fillStyle = compactColors.white;
			ctx.fill();
			ctx.restore();

			// Move the origin into the card and clip content to its rounded corners.
			// Balanced by the restore before export so the pooled canvas resets.
			ctx.save();
			ctx.translate(compactCardMargin, compactCardMargin);
			roundRect(ctx, 0, 0, compactCardWidth, compactCardHeight, compactCardRadius);
			ctx.clip();
		});

		const pad = compactCardPadding;

		// Borrower image (square, rounded, left). Cover-crop so the 4:3 source
		// photo fills the square without distortion.
		const hasBorrowerImage = await trace('borrower-image', async () => {
			const result = await loadBorrowerImage(loanData);
			const { image } = result;
			const {
				width, height, offsetX, offsetY,
			} = coverRect(image.width, image.height, compactImageSize);
			ctx.save();
			roundRect(ctx, pad, pad, compactImageSize, compactImageSize, compactImageRadius);
			ctx.clip();
			ctx.drawImage(image, pad + offsetX, pad + offsetY, width, height);
			ctx.restore();
			return result.hasBorrowerImage;
		});

		// Loan use statement (right of image, bold name + country, clamped to 4 lines)
		const useLines = trace('borrower-use', () => {
			const textX = pad + compactImageSize + compactImageGap;
			const textWidth = compactCardWidth - textX - pad;
			const runs = buildCompactLoanUseRuns(loanData);
			ctx.fillStyle = compactColors.textPrimary;
			return wrapStyledText(
				ctx,
				runs,
				textX,
				pad,
				textWidth,
				compactMaxUseLines,
				compactUseLineHeight,
				{ regularFont: compactRegularFont, boldFont: compactMediumFont }
			);
		});

		// Top row hugs the taller of the image and the wrapped use text
		const topRowBottom = pad + Math.max(compactImageSize, useLines * compactUseLineHeight);

		// Loan callouts (grey pills, never orange). Collapses when there are none;
		// pills that would overflow the row are dropped so nothing spills past the card.
		const pillsBottom = trace('loan-callouts', () => {
			ctx.font = compactMediumFont;
			const availableWidth = compactCardWidth - (2 * pad);
			const callouts = getLoanCallouts(loanData);
			const labels = fitPillLabels(ctx, callouts, availableWidth, compactPillPadding, compactPillGap);
			if (!labels.length) {
				return topRowBottom;
			}
			const pillY = topRowBottom + compactSectionGap;
			let lastTagRight = pad;
			for (let i = 0; i < labels.length; i += 1) {
				const { pillWidth } = drawPill(
					ctx,
					labels[i],
					lastTagRight,
					pillY,
					compactPillPadding,
					compactColors.textPrimary,
					compactColors.pillBg
				);
				lastTagRight += pillWidth + compactPillGap;
			}
			return pillY + compactPillHeight;
		});

		// Fundraising info: "$X to go" label above a full-width progress bar
		trace('fundraising-info', () => {
			const toGoY = pillsBottom + compactSectionGap;
			const barY = toGoY + compactToGoLineHeight + compactToGoBarGap;
			const barWidth = compactCardWidth - (2 * pad);
			const fundedAmount = loanData?.loanFundraisingInfo?.fundedAmount ?? 0;
			const loanAmountValue = numeral(loanData?.loanAmount).value() || 1;
			const fundraisingPercent = Math.min(1, fundedAmount / loanAmountValue);

			ctx.font = compactMediumFont;
			ctx.fillStyle = compactColors.textPrimary;
			ctx.fillText(buildToGoText(loanData), pad, toGoY);

			ctx.save();
			roundRect(ctx, pad, barY, barWidth, compactBarHeight, compactBarHeight / 2);
			ctx.clip();
			ctx.fillStyle = compactColors.progressTrack;
			ctx.fillRect(pad, barY, barWidth, compactBarHeight);
			ctx.fillStyle = compactColors.brand;
			ctx.fillRect(pad, barY, barWidth * fundraisingPercent, compactBarHeight);
			ctx.restore();
		});

		// Undo the card translate + clip so the pooled canvas is clean for reuse
		ctx.restore();

		const buffer = trace('export-jpeg', () => canvas.toBuffer('image/jpeg', { quality: 0.5 }));
		trace('compactCanvasPool.recycle', () => compactCanvasPool.recycle(canvas));
		return { buffer, hasBorrowerImage };
	} catch (e) {
		if (canvas) {
			trace('compactCanvasPool.recycle', () => compactCanvasPool.recycle(canvas));
		}
		throw e;
	}
}

export default async function draw(loanData, style) {
	switch (style) {
		case 'bundle':
			return drawClassic(loanData, { skipButton: true });
		case 'compact-bundle':
			return drawCompact(loanData);
		case 'classic':
			return drawClassic(loanData);
		case 'bundle-legacy':
			return drawLegacy(loanData, { skipButton: true });
		case 'legacy':
		default:
			return drawLegacy(loanData);
	}
}
