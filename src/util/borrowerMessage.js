import { htmlToText } from '#src/util/limitedHtml';
import { formatPossessiveName } from '#src/util/stringParserUtils';

/**
 * Whether the message is a partner journal: one message the partner posted to many loans at once.
 * Its loan is only the first of those loans, so only that loan's partner describes the message.
 *
 * @param {object} message - Update with its loan
 * @returns {boolean}
 */
export function isPartnerMessage(message) {
	return message?.type === 'partner';
}

const getPoster = message => (isPartnerMessage(message) ? message.loan?.partner : message?.loan) ?? {};

/**
 * The name a borrower message is posted under: the loan name, falling back to the partner name.
 * Partner messages use the partner name.
 * The update's own authorName is the poster's raw username, which is not fit to show.
 *
 * @param {object} message - Update with its loan
 * @returns {string}
 */
export function getBorrowerMessageAuthor(message) {
	if (isPartnerMessage(message)) {
		return getPoster(message).name || '';
	}
	return message?.loan?.name || message?.loan?.partner?.name || '';
}

/**
 * "Update for {Name}'s Loan", as the monolith titled update pages, or "Update from {Partner}" for partner messages.
 *
 * @param {object} message - Update with its loan
 * @returns {string}
 */
export function getBorrowerMessageTitle(message) {
	const name = htmlToText(getPoster(message).name);
	if (!name) {
		return 'Borrower Message';
	}
	if (isPartnerMessage(message)) {
		return `Update from ${name}`;
	}
	return /'s? group$/i.test(name) ? `Update for ${name} Loan` : `Update for ${formatPossessiveName(name)} Loan`;
}

/**
 * The message subject as plain text, preferring the translation and falling back to the title when it is empty.
 *
 * @param {object} message - Update with its loan
 * @returns {string}
 */
export function getBorrowerMessageSubject(message) {
	return htmlToText(message?.subjectTranslated || message?.subject) || getBorrowerMessageTitle(message);
}

/**
 * The message image, falling back to the loan image (the partner image for partner messages), with its alt text.
 *
 * @param {object} message - Update with its loan
 * @returns {object|null} The image fields plus alt, or null when there is no image
 */
export function getBorrowerMessagePhoto(message) {
	const { name, image } = getPoster(message);
	if (message?.image?.default) {
		return { ...message.image, alt: name ? `Photo from ${name}'s message` : 'Photo from this message' };
	}
	if (image?.default) {
		return { ...image, alt: name ? `Photo of ${name}` : 'Borrower photo' };
	}
	return null;
}
