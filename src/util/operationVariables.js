import { isContentfulQuery } from '#src/util/contentful/isContentfulQuery';

/**
 * Build the variables for an apollo operation the same way everywhere: the
 * basket id from the cookie, the operation's own variables, and the preview
 * flag for contentful queries in preview mode. Used by the apollo plugin,
 * preFetchApolloQuery, and useApolloQuery so an operation is written and read
 * with identical variables regardless of where it is declared.
 *
 * @param {object} query - GraphQL query document
 * @param {object} [context] - { cookieStore, route }
 * @param {object} [operationVariables] - The operation's own variables
 * @returns {object} Merged variables
 */
export default function getOperationVariables(query, { cookieStore, route } = {}, operationVariables = {}) {
	const basketId = cookieStore?.get('kvbskt') ?? null;
	const isContentfulPreview = route?.query?.preview === 'true';
	return {
		...(basketId && { basketId }),
		...operationVariables,
		...(isContentfulQuery(query) && isContentfulPreview && { preview: true }),
	};
}
