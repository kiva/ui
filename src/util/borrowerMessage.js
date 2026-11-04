import { htmlToText } from '#src/util/limitedHtml';
import { formatPossessiveName } from '#src/util/stringParserUtils';

/**
 * The name a borrower message is posted under: the loan name, falling back to the partner name.
 * The update's own authorName is the poster's raw username, which is not fit to show.
 *
 * @param {object} message - Update with its loan
 * @returns {string}
 */
export function getBorrowerMessageAuthor(message) {
	return message?.loan?.name || message?.loan?.partner?.name || '';
}

/**
 * "Update for {Name}'s Loan", as the monolith titled update pages.
 *
 * @param {object} message - Update with its loan
 * @returns {string}
 */
export function getBorrowerMessageTitle(message) {
	const name = htmlToText(message?.loan?.name);
	if (!name) {
		return 'Borrower Message';
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
