const { Path2D } = require('path2d-polyfill');

module.exports = {
	/**
	 * Returns a single line of text. Adds ellipsis if text overflows the desired canvas width
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {String} str The text to draw
	 * @param {Number} maxWidth The width in pixels of the line
	 */
	ellipsisLine(ctx, str, maxWidth) {
		let { width } = ctx.measureText(str);
		const ellipsis = '…';
		const ellipsisWidth = ctx.measureText(ellipsis).width;
		if (width <= maxWidth || width <= ellipsisWidth) {
			return str;
		}
		let len = str.length;
		while (width >= maxWidth - ellipsisWidth && len-- > 0) {
			str = str.substring(0, len);
			width = ctx.measureText(str).width;
		}
		return str + ellipsis;
	},

	/**
	 * Draws a rounded rectangle to the current state of the canvas.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} width The width of the rectangle
	 * @param {Number} height The height of the rectangle
	 * @param {Number} [radius = 0] The corner radius;
	 */
	roundRect(ctx, x, y, w, h, r) {
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
	},

	/**
	 * Draws multiple lines of text to the current state of the canvas.
	 * Adds an ellispsis if the text overflows.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {String} text The st
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} maxWidth The width of the rectangle
	 * @param {Number} maxLines The max number of lines in the paragraph
	 * @param {Number} lineHeight The lineHeight in px of the text
	 */
	wrapText(ctx, text, x, y, maxWidth, maxLines, lineHeight) {
		const words = text.split(' ');
		let line = '';
		let numLines = 1;

		for (let n = 0; n < words.length; n++) {
			const testLine = `${line + words[n]} `;
			const metrics = ctx.measureText(testLine);
			const testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				if (numLines < maxLines) {
					ctx.fillText(line, x, y);
					line = `${words[n]} `;
					y += lineHeight;
					numLines += 1;
				} else if (numLines === maxLines) {
					line = module.exports.ellipsisLine(ctx, testLine, maxWidth);
				}
			} else {
				line = testLine;
			}
		}
		ctx.fillText(line, x, y);
	},

	/**
	 * Draws a Material Design Icon at the given x,y position (top left corner).
	 * Scales the icon to a square of side length `size`.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {String} icon Icon path string from `@mdi/js` export
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} size The size to scale the icon to
	 */
	drawMDIcon(ctx, icon, x, y, size) {
		const iconScale = size / 24; // Material Design icons are defined in 24x24 view boxes
		ctx.save();
		ctx.translate(x, y);
		ctx.scale(iconScale, iconScale);
		ctx.fill(new Path2D(icon));
		ctx.restore();
	},

	/**
	 * Draws a pill with text and an optional left-aligned icon.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {String} text The text of the pill
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} padding The inner padding of the pill
	 * @param {String} color Fill style for the pill icon and text
	 * @param {String} bgColor Fill style for the pill background
	 * @param {String} icon Material Design Icon path string from `@mdi/js` export
	 * @returns Rendered size of the pill { pillHeight, pillWidth }
	 */
	drawPill(ctx, text, x, y, padding, color, bgColor, icon) {
		const metrics = ctx.measureText(text);
		const textHeight = metrics.emHeightAscent + metrics.emHeightDescent;
		const textWidth = metrics.width;
		const iconSize = icon ? textHeight : 0;
		const pillHeight = (2 * padding) + textHeight;
		const pillWidth = (3 * padding) + iconSize + textWidth;
		const radius = pillHeight / 2;
		module.exports.roundRect(ctx, x, y, pillWidth, pillHeight, radius);
		ctx.fillStyle = bgColor;
		ctx.fill();
		ctx.fillStyle = color;
		if (icon) {
			module.exports.drawMDIcon(ctx, icon, x + padding, y + padding, iconSize);
		}
		ctx.fillText(text, x + iconSize + (padding * 1.5), y + padding);

		return {
			pillHeight,
			pillWidth,
		};
	},
};
