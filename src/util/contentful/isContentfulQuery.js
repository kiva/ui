/* eslint-disable import/prefer-default-export */
/**
 * Returns true if contentful query
 *
 * @param {object} GraphQL Query AST Object
 * @returns {Boolean} Is this a GQL query which looks like:
 * {
 * 	contentful {}
 * }
 */
export function isContentfulQuery(queryAST = {}) {
	try {
		const operation = queryAST.definitions?.[0]?.operation;
		const name = queryAST.definitions?.[0]?.selectionSet?.selections?.[0]?.name?.value;

		return operation === 'query' && name === 'contentful';
	} catch {
		return false;
	}
}
