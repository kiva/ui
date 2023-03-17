const path = require('path');
const { createCanvas, registerFont, loadImage } = require('canvas');
const deePool = require('deepool');
const { ellipsisLine, wrapText, roundRect } = require('./canvas-utils');
const getLoanUse = require('../../../src/util/loanUse');
const tracer = require('../ddTrace');

const resizeFactor = 3;
const borderThickness = 2 * resizeFactor;
const cardWidth = 300 * resizeFactor;
const cardHeight = 525 * resizeFactor;
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

function fontFile(name) {
	return path.join(__dirname, './fonts', name);
}

tracer.trace('registerFonts', () => {
	/* eslint-disable max-len */
	// registerFont(fontFile('PostGrotesk-Light.ttf'), { family: 'Kiva Post Grot', weight: '300' });
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
const canvasPool = deePool.create(function makeCanvas() {
	return tracer.trace('createCanvas', () => createCanvas(cardWidth, cardHeight));
});
canvasPool.grow(2);

module.exports = async function draw(loanData) {
	// Get canvas & context
	const canvas = tracer.trace('canvasPool.use', () => canvasPool.use());
	const ctx = tracer.trace('canvas.getContext', () => canvas.getContext('2d', { alpha: false }));

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
		tracer.trace('canvasPool.recycle', () => canvasPool.recycle(canvas));

		return buffer;
	} catch (e) {
		// Recycle canvas for use in other requests
		if (canvas) {
			tracer.trace('canvasPool.recycle', () => canvasPool.recycle(canvas));
		}
		throw e;
	}
};
