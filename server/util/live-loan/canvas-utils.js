/* eslint-disable no-param-reassign */
import { Path2D } from 'path2d-polyfill';

/**
 * Returns a single line of text. Adds ellipsis if text overflows the desired canvas width
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} str The text to draw
 * @param {Number} maxWidth The width in pixels of the line
 */
export function ellipsisLine(ctx, str, maxWidth) {
	let { width } = ctx.measureText(str);
	const ellipsis = '…';
	const ellipsisWidth = ctx.measureText(ellipsis).width;
	// If the text fits in the canvas, return it
	if (width <= maxWidth || width <= ellipsisWidth) {
		return str;
	}
	// Remove characters from the end of the string until it fits
	for (let len = str.length; width >= maxWidth - ellipsisWidth && len > 0; len -= 1) {
		str = str.substring(0, len);
		width = ctx.measureText(str).width;
	}
	return str + ellipsis;
}

/**
 * Draws a rounded rectangle to the current state of the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 0] The corner radius;
 */
export function roundRect(ctx, x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
}

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
export function wrapText(ctx, text, x, y, maxWidth, maxLines, lineHeight) {
	const words = text.split(' ');
	let line = '';
	let numLines = 1;
	for (let n = 0; n < words.length; n += 1) {
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
				line = ellipsisLine(ctx, testLine, maxWidth);
			}
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, x, y);
}

/**
 * Splits an array of styled runs into individual words, each carrying the bold
 * flag of the run it came from. Whitespace is collapsed.
 * @param {Array<{ text: String, bold: Boolean }>} runs
 * @returns {Array<{ word: String, bold: Boolean }>}
 */
export function styledRunsToWords(runs = []) {
	const words = [];
	for (let i = 0; i < runs.length; i += 1) {
		const run = runs[i];
		const parts = String(run.text).split(/\s+/).filter(Boolean);
		for (let j = 0; j < parts.length; j += 1) {
			words.push({ word: parts[j], bold: !!run.bold });
		}
	}
	return words;
}

/**
 * Draws styled (mixed regular/bold) text with word wrapping, clamping to a max
 * number of lines and appending an ellipsis when the text overflows.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{ text: String, bold: Boolean }>} runs The styled text runs
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} maxWidth The width available for the paragraph
 * @param {Number} maxLines The max number of lines to draw
 * @param {Number} lineHeight The line height in px
 * @param {Object} fonts Canvas font strings: { regularFont, boldFont }
 */
export function wrapStyledText(ctx, runs, x, y, maxWidth, maxLines, lineHeight, { regularFont, boldFont }) {
	const words = styledRunsToWords(runs);
	const fontFor = bold => (bold ? boldFont : regularFont);
	ctx.font = regularFont;
	const spaceWidth = ctx.measureText(' ').width;

	// Group words into lines, measuring each word once and only re-parsing the
	// font when the bold flag changes. A line's width counts a trailing space
	// per word, mirroring the single-font wrapText helper.
	let currentBold = null;
	const lines = [];
	let line = [];
	let lineWidth = 0;
	for (let i = 0; i < words.length; i += 1) {
		const w = words[i];
		if (w.bold !== currentBold) {
			ctx.font = fontFor(w.bold);
			currentBold = w.bold;
		}
		w.width = ctx.measureText(w.word).width;
		const nextWidth = lineWidth + w.width + spaceWidth;
		if (line.length && nextWidth > maxWidth) {
			lines.push(line);
			line = [w];
			lineWidth = w.width + spaceWidth;
		} else {
			line.push(w);
			lineWidth = nextWidth;
		}
	}
	if (line.length) {
		lines.push(line);
	}

	const truncated = lines.length > maxLines;
	const visibleLines = lines.slice(0, maxLines);

	// Append an ellipsis to the final visible word when content was dropped,
	// trimming it until the line fits. The other words' width is constant.
	if (truncated && visibleLines.length) {
		const lastLine = visibleLines[visibleLines.length - 1];
		const last = lastLine[lastLine.length - 1];
		const otherWidth = lastLine.slice(0, -1).reduce((sum, wd) => sum + wd.width + spaceWidth, 0);
		ctx.font = fontFor(last.bold);
		last.word = `${last.word}…`;
		while (last.word.length > 1 && otherWidth + ctx.measureText(last.word).width > maxWidth) {
			last.word = `${last.word.slice(0, -2)}…`;
		}
	}

	// Draw each visible line word by word, switching fonts only on change.
	currentBold = null;
	for (let i = 0; i < visibleLines.length; i += 1) {
		let cursorX = x;
		const lineY = y + (i * lineHeight);
		for (let j = 0; j < visibleLines[i].length; j += 1) {
			const w = visibleLines[i][j];
			if (w.bold !== currentBold) {
				ctx.font = fontFor(w.bold);
				currentBold = w.bold;
			}
			ctx.fillText(w.word, cursorX, lineY);
			cursorX += w.width + spaceWidth;
		}
	}

	return visibleLines.length;
}

/**
 * Computes how to draw a source image so it fully covers a square box without
 * distortion (object-fit: cover): scaled to the larger dimension and centered,
 * so the overflowing axis is cropped equally on both sides.
 * @param {Number} srcWidth Source image width
 * @param {Number} srcHeight Source image height
 * @param {Number} size The square box side length
 * @returns {{ width: Number, height: Number, offsetX: Number, offsetY: Number }}
 *   Draw size and top-left offset relative to the box origin
 */
export function coverRect(srcWidth, srcHeight, size) {
	const scale = Math.max(size / srcWidth, size / srcHeight);
	const width = srcWidth * scale;
	const height = srcHeight * scale;
	return {
		width,
		height,
		offsetX: (size - width) / 2,
		offsetY: (size - height) / 2,
	};
}

/**
 * Rendered width of a pill for the given text, matching drawPill's geometry.
 * ctx.font must be set to the pill font before calling.
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} text The pill text
 * @param {Number} padding The pill inner padding
 * @param {String} [icon] Optional leading icon path (adds a square icon slot)
 * @returns {Number} The pill width in px
 */
export function measurePillWidth(ctx, text, padding, icon) {
	const metrics = ctx.measureText(text);
	const iconSize = icon ? (metrics.emHeightAscent + metrics.emHeightDescent) : 0;
	return (3 * padding) + iconSize + metrics.width;
}

/**
 * Selects which pill labels fit on a single row of the given width. Any pill
 * that does not fit — including a lone pill too wide on its own — is dropped.
 * ctx.font must be set to the pill font before calling.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<String>} labels Ordered pill labels (highest priority first)
 * @param {Number} maxWidth The available row width
 * @param {Number} padding The pill inner padding (matches drawPill)
 * @param {Number} gap The gap between pills
 * @returns {Array<String>} The labels to render, in order
 */
export function fitPillLabels(ctx, labels, maxWidth, padding, gap) {
	const result = [];
	let used = 0;
	for (let i = 0; i < labels.length; i += 1) {
		const needed = (result.length ? gap : 0) + measurePillWidth(ctx, labels[i], padding);
		if (used + needed > maxWidth) {
			break;
		}
		result.push(labels[i]);
		used += needed;
	}
	return result;
}

/**
 * Draws a Material Design Icon at the given x,y position (top left corner).
 * Scales the icon to a square of side length `size`.
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} icon Icon path string from `@mdi/js` export
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} size The size to scale the icon to
 */
export function drawMDIcon(ctx, icon, x, y, size) {
	const iconScale = size / 24; // Material Design icons are defined in 24x24 view boxes
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(iconScale, iconScale);
	ctx.fill(new Path2D(icon));
	ctx.restore();
}

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
export function drawPill(ctx, text, x, y, padding, color, bgColor, icon) {
	const metrics = ctx.measureText(text);
	const textHeight = metrics.emHeightAscent + metrics.emHeightDescent;
	const iconSize = icon ? textHeight : 0;
	const pillHeight = (2 * padding) + textHeight;
	const pillWidth = measurePillWidth(ctx, text, padding, icon);
	const radius = pillHeight / 2;
	roundRect(ctx, x, y, pillWidth, pillHeight, radius);
	ctx.fillStyle = bgColor;
	ctx.fill();
	ctx.fillStyle = color;
	if (icon) {
		drawMDIcon(ctx, icon, x + padding, y + padding, iconSize);
	}
	ctx.fillText(text, x + iconSize + (padding * 1.5), y + padding);
	return {
		pillHeight,
		pillWidth,
	};
}

export default {
	ellipsisLine,
	roundRect,
	wrapText,
	styledRunsToWords,
	wrapStyledText,
	coverRect,
	measurePillWidth,
	fitPillLabels,
	drawMDIcon,
	drawPill
};
