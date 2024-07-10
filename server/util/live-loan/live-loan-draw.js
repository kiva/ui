const { mdiMapMarker } = require('@mdi/js');
const path = require('path');
const {
	createCanvas,
	CanvasRenderingContext2D,
	registerFont,
	loadImage,
} = require('canvas');
const deePool = require('deepool');
const numeral = require('numeral');
const { polyfillPath2D } = require('path2d-polyfill');
const {
	ellipsisLine,
	drawPill,
	wrapText,
	roundRect,
} = require('./canvas-utils');
const getLoanCallouts = require('../../../src/util/loanCallouts');
const getLoanUse = require('../../../src/util/loanUse');
const tracer = require('../ddTrace');

// Polyfill Path2D for material design icon support
global.CanvasRenderingContext2D = CanvasRenderingContext2D;
polyfillPath2D(global);

// Legacy styling constants
const resizeFactor = 3;
const cardWidth = 300 * resizeFactor;
const cardHeight = 525 * resizeFactor;

// Kiva Classic styling constants
const classicResizeFactor = 3;
const classicCardWidth = 440 * classicResizeFactor;
const classicCardHeight = 510 * classicResizeFactor;

function fontFile(name) {
	return path.join(__dirname, './fonts', name);
}

tracer.trace('registerFonts', () => {
	/* eslint-disable max-len */
	registerFont(fontFile('PostGrotesk-Light.ttf'), { family: 'Kiva Post Grot', weight: '300' });
	// registerFont(fontFile('PostGrotesk-LightItalic.ttf'), { family: 'Kiva Post Grot', weight: '300', style: 'italic' });
	registerFont(fontFile('PostGrotesk-Book.ttf'), { family: 'Kiva Post Grot', weight: '400' });
	// registerFont(fontFile('PostGrotesk-BookItalic.ttf'), { family: 'Kiva Post Grot', weight: '400', style: 'italic' });
	registerFont(fontFile('PostGrotesk-Medium.ttf'), { family: 'Kiva Post Grot', weight: '500' });
	registerFont(fontFile('PostGrotesk-MediumItalic.ttf'), { family: 'Kiva Post Grot', weight: '500', style: 'italic' });
	// registerFont(fontFile('PostGrotesk-Bold.ttf'), { family: 'Kiva Post Grot', weight: '700' });
	// registerFont(fontFile('PostGrotesk-BoldItalic.ttf'), { family: 'Kiva Post Grot', weight: '700', style: 'italic' });
	/* eslint-enable max-len */
});

// Use pool of canvas objects instead to avoid creating a new canvas for each request
// eslint-disable-next-line prefer-arrow-callback
const legacyCanvasPool = deePool.create(function makeCanvas() {
	return tracer.trace('createLegacyCanvas', () => createCanvas(cardWidth, cardHeight));
});
// eslint-disable-next-line prefer-arrow-callback
const classicCanvasPool = deePool.create(function makeCanvas() {
	return tracer.trace('createClassicCanvas', () => createCanvas(classicCardWidth, classicCardHeight));
});
legacyCanvasPool.grow(2);
classicCanvasPool.grow(2);

async function drawLegacy(loanData) {
	// Get canvas & context
	const canvas = tracer.trace('legacyCanvasPool.use', () => legacyCanvasPool.use());
	const ctx = tracer.trace('canvas.getContext', () => canvas.getContext('2d', { alpha: false }));

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
		tracer.trace('canvas-prep', () => {
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, cardWidth, cardHeight);
		});

		// Borrower name
		tracer.trace('borrower-name', () => {
			const nameXPos = cardWidth / 2;
			const nameYPos = 242 * resizeFactor;
			ctx.fillStyle = kivaColors.action;
			ctx.font = `500 ${24 * resizeFactor}px "Kiva Post Grot"`;
			ctx.fillText(ellipsisLine(ctx, loanData.name, bodyWidth), nameXPos, nameYPos);
		});

		// Borrower country
		tracer.trace('borrower-country', () => {
			const countryXPos = cardWidth / 2;
			const countryYPos = 275 * resizeFactor;
			ctx.fillStyle = kivaColors.textLight;
			ctx.font = `500 ${16 * resizeFactor}px "Kiva Post Grot"`;
			ctx.fillText(ellipsisLine(ctx, loanData.geocode.country.name, bodyWidth), countryXPos, countryYPos);
		});

		// Borrower use
		tracer.trace('borrower-use', () => {
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
		tracer.trace('fundraising-info', () => {
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
		tracer.trace('button', () => {
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

		// Borrower Image
		await tracer.trace('borrower-image', async () => {
			const borrowerImg = await tracer.trace('loadImage', async () => loadImage(loanData.image.retina));
			ctx.drawImage(borrowerImg, 0, 0, cardWidth, cardWidth * borrowerImgAspectRatio);
		});

		// Add a border around everything
		tracer.trace('border', () => {
			ctx.strokeStyle = kivaColors.strokeGrey;
			ctx.lineWidth = borderThickness;
			ctx.strokeRect(
				borderThickness / 2,
				borderThickness / 2,
				cardWidth - borderThickness,
				cardHeight - borderThickness
			);
		});

		// Export to jpeg
		const buffer = tracer.trace('export-jpeg', () => canvas.toBuffer('image/jpeg', { quality: 0.5 }));

		// Recycle canvas for use in other requests
		tracer.trace('legacyCanvasPool.recycle', () => legacyCanvasPool.recycle(canvas));

		return buffer;
	} catch (e) {
		// Recycle canvas for use in other requests
		if (canvas) {
			tracer.trace('legacyCanvasPool.recycle', () => legacyCanvasPool.recycle(canvas));
		}
		throw e;
	}
}

async function drawClassic(loanData) {
	// Get canvas & context
	const canvas = tracer.trace('classicCanvasPool.use', () => classicCanvasPool.use());
	const ctx = tracer.trace('canvas.getContext', () => canvas.getContext('2d', { alpha: false }));

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
		tracer.trace('canvas-prep', () => {
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillStyle = kivaColors.white;
			ctx.fillRect(0, 0, classicCardWidth, classicCardHeight);
		});

		// Borrower Image
		await tracer.trace('borrower-image', async () => {
			const borrowerImg = await tracer.trace('loadImage', async () => loadImage(loanData.image.retina));
			ctx.save();
			// eslint-disable-next-line max-len
			roundRect(ctx, borrowerImgMargin, borrowerImgMargin, borrowerImgWidth, borrowerImgHeight, 16 * classicResizeFactor);
			ctx.clip();
			ctx.drawImage(borrowerImg, borrowerImgMargin, borrowerImgMargin, borrowerImgWidth, borrowerImgHeight);
			ctx.restore();
		});

		// Borrower country
		tracer.trace('borrower-country', () => {
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
				mdiMapMarker,
			);
		});

		// Borrower use
		tracer.trace('borrower-use', () => {
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
		tracer.trace('loan-callouts', () => {
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
					kivaColors.bgSecondary,
				);
				lastTagRight = xPos + pillWidth;
			}
		});

		// Fundraising info
		tracer.trace('fundraising-info', () => {
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
		tracer.trace('button', () => {
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

		// Export to jpeg
		const buffer = tracer.trace('export-jpeg', () => canvas.toBuffer('image/jpeg', { quality: 0.25 }));

		// Recycle canvas for use in other requests
		tracer.trace('classicCanvasPool.recycle', () => classicCanvasPool.recycle(canvas));

		return buffer;
	} catch (e) {
		// Recycle canvas for use in other requests
		if (canvas) {
			tracer.trace('classicCanvasPool.recycle', () => classicCanvasPool.recycle(canvas));
		}
		throw e;
	}
}

module.exports = async function draw(loanData, style) {
	switch (style) {
		case 'classic':
			return drawClassic(loanData);
		case 'legacy':
		default:
			return drawLegacy(loanData);
	}
};
