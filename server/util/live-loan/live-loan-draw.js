const path = require('path');
const { createCanvas, registerFont, loadImage } = require('canvas');
const { ellipsisLine, wrapText, roundRect } = require('./canvas-utils');
const loanUseFilter = require('../../../src/plugins/loan-use-filter.common'); // Duplicate of the es module version

module.exports = loanData => {
	return new Promise((resolve, reject) => {
		async function draw() {
			const resizeFactor = 3;
			const borderThickness = 2 * resizeFactor;
			const cardWidth = 300 * resizeFactor;
			const cardHeight = 525 * resizeFactor;
			const borrowerImgAspectRatio = 0.75;
			const kivaColors = {
				blue: '#118aec',
				darkBlue: '#006ed3',
				green: '#4faf4e',
				textLight: '#999999',
				strokeGrey: '#d8d8d8',
				textDark: '#484848',
				white: '#ffffff'
			};

			function fontFile(name) {
				return path.join(__dirname, '../../../src/assets/fonts', name);
			}
			registerFont(fontFile('PostGrotesk-Medium.ttf'), { family: 'Kiva Post Grot', weight: '400' });
			registerFont(fontFile('PostGrotesk-MediumItalic.ttf'), { family: 'Kiva Post Grot', weight: '400', style: 'italic' });
			registerFont(fontFile('PostGrotesk-Light.ttf'), { family: 'Kiva Post Grot', weight: '100' });
			registerFont(fontFile('PostGrotesk-Book.ttf'), { family: 'Kiva Post Grot', weight: '300' });
			registerFont(fontFile('PostGrotesk-Bold.ttf'), { family: 'Kiva Post Grot', weight: '700' });

			try {
				// Canvas prep
				const canvas = createCanvas(cardWidth, cardHeight);
				const ctx = canvas.getContext('2d');
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.fillStyle = '#fff';
				ctx.fillRect(0, 0, cardWidth, cardHeight);

				// Borrower name
				const nameXPos = cardWidth / 2;
				const nameYPos = 245 * resizeFactor;
				ctx.fillStyle = kivaColors.blue;
				ctx.font = `700 ${24 * resizeFactor}px "Kiva Post Grot"`;
				ctx.fillText(ellipsisLine(ctx, loanData.name, cardWidth * 0.95), nameXPos, nameYPos);

				// Borrower country
				const countryXPos = cardWidth / 2;
				const countryYPos = 280 * resizeFactor;
				const countryWidth = cardWidth * 0.9;
				ctx.fillStyle = kivaColors.textLight;
				ctx.font = `700 ${16 * resizeFactor}px "Kiva Post Grot"`;
				ctx.fillText(ellipsisLine(ctx, loanData.geocode.country.name, countryWidth), countryXPos, countryYPos);

				// Borrower use
				const useXPos = cardWidth / 2;
				const useYPos = 320 * resizeFactor;
				const useWidth = cardWidth * 0.9;
				const useMaxLines = 3;
				const useMaxLineHeight = 16 * 1.3 * resizeFactor;
				const useText = loanUseFilter(loanData.use, loanData.name, loanData.status, loanData.loanAmount, loanData.borrowerCount, 100);
				ctx.fillStyle = kivaColors.textDark;
				ctx.font = `400 ${16 * resizeFactor}px "Kiva Post Grot"`;
				wrapText(ctx, useText, useXPos, useYPos, useWidth, useMaxLines, useMaxLineHeight);

				// Fundraising info
				const fundingXPos = cardWidth * 0.05;
				const fundingYPos = 412 * resizeFactor;
				const fundingWidth = cardWidth * 0.9;
				const fundingHeight = 8 * resizeFactor;
				const fundingBorderRadius = 10;
				const fundingTextYPos = fundingYPos + fundingHeight + (8 * resizeFactor);
				const fundraisingPercent = loanData.loanFundraisingInfo.fundedAmount / loanData.loanAmount;
				const fundraisingRemaining = loanData.loanAmount - loanData.loanFundraisingInfo.fundedAmount;
				// Fundraising info - bar
				roundRect(ctx, fundingXPos, fundingYPos, fundingWidth, fundingHeight, fundingBorderRadius);
				ctx.fillStyle = kivaColors.strokeGrey;
				ctx.fill();
				roundRect(ctx, fundingXPos, fundingYPos, fundingWidth * fundraisingPercent, fundingHeight, fundingBorderRadius);
				ctx.fillStyle = kivaColors.green;
				ctx.fill();
				// Fundraising info - text
				ctx.font = `italic 400 ${14 * resizeFactor}px "Kiva Post Grot"`;
				ctx.fillText(`$${fundraisingRemaining} to go`, cardWidth / 2, fundingTextYPos);

				// Button
				const btnXPos = cardWidth * 0.05;
				const btnYPos = 460 * resizeFactor;
				const btnWidth = cardWidth * 0.9;
				const btnHeight = 50 * resizeFactor;
				const btnBorderRadius = 4 * resizeFactor;
				const btnFontSize = 19;
				ctx.shadowBlur = 0;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 2 * resizeFactor;
				ctx.shadowColor = kivaColors.darkBlue;
				roundRect(ctx, btnXPos, btnYPos, btnWidth, btnHeight, btnBorderRadius);
				ctx.fillStyle = kivaColors.blue;
				ctx.fill();
				ctx.shadowColor = 'transparent';
				ctx.fillStyle = kivaColors.white;
				ctx.font = `700 ${btnFontSize * resizeFactor}px "Kiva Post Grot"`;
				ctx.fillText('Learn more', cardWidth / 2, btnYPos + btnHeight / 2 - btnFontSize);

				// Borrower Image
				const borrowerImg = await loadImage(loanData.image.retina);
				ctx.drawImage(borrowerImg, 0, 0, cardWidth, cardWidth * borrowerImgAspectRatio);

				// Add a border around everything
				ctx.strokeStyle = kivaColors.strokeGrey;
				ctx.lineWidth = borderThickness;
				ctx.strokeRect(
					borderThickness / 2,
					borderThickness / 2,
					cardWidth - borderThickness,
					cardHeight - borderThickness
				);

				// export it
				const buffer = canvas.toBuffer('image/jpeg', { quality: 0.7 });
				resolve(buffer);
			} catch (err) {
				reject(err);
			}
		}
		draw();
	});
};
