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
	}
};
