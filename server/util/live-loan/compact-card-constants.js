// Compact (bundle) styling constants. Mirrors the on-site compact loan card:
// square borrower image on the left, use statement on the right, callout pills,
// then a "$X to go" label above a fundraising bar. No CTA button.
export const compactResizeFactor = 3;
export const compactCardWidth = 271;
export const compactCardPadding = 12;
export const compactCardRadius = 0;
export const compactImageSize = 60;
export const compactImageRadius = 8;
export const compactImageGap = 8; // between image and copy
export const compactUseLineHeight = 21; // 14px text at 1.5 line-height
export const compactMaxUseLines = 4;
export const compactSectionGap = 12; // between the top row, pills, and bottom row
export const compactPillHeight = 30;
export const compactPillPadding = 8;
export const compactPillGap = 8;
export const compactToGoLineHeight = 14;
export const compactToGoBarGap = 8;
export const compactBarHeight = 8;
// Height is fixed to the worst case (4 lines of use text) so the pooled canvas
// and the email layout stay a consistent size; shorter cards flow from the top.
export const compactTopRowHeight = Math.max(compactImageSize, compactMaxUseLines * compactUseLineHeight);
export const compactCardHeight = compactCardPadding
	+ compactTopRowHeight + compactSectionGap
	+ compactPillHeight + compactSectionGap
	+ (compactToGoLineHeight + compactToGoBarGap + compactBarHeight)
	+ compactCardPadding;
// The "$X to go" label + bar are pinned to the bottom of the fixed-height card
// so their position stays put no matter how many lines the use text wraps to.
export const compactBarY = compactCardHeight - compactCardPadding - compactBarHeight;
export const compactToGoY = compactBarY - compactToGoBarGap - compactToGoLineHeight;
// 1px card border, stroked inset from the canvas edge so it isn't clipped.
export const compactBorderWidth = 1;
export const compactCardDimensions = {
	width: compactCardWidth * compactResizeFactor,
	height: compactCardHeight * compactResizeFactor,
};

export const compactColors = {
	textPrimary: '#212121',
	brand: '#2aa967',
	pillBg: '#f5f5f5',
	progressTrack: '#d9d9d9',
	border: '#757575',
	white: '#ffffff'
};

export const compactRegularFont = '400 14px "Kiva Post Grot"';
// Bold name+country in the use text and the pills / "$X to go" label are all
// the same Medium weight in the design.
export const compactMediumFont = '500 14px "Kiva Post Grot"';
