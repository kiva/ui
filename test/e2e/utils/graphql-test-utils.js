// ref. https://docs.cypress.io/guides/testing-strategies/working-with-graphql

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
	const { body } = req;
	return (
		// filter batched query for target query
		body.filter(item => item.operationName === operationName).length
	);
};

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
	if (hasOperationName(req, operationName)) {
		req.alias = `gql${operationName}Query`;
	}
};

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
	if (hasOperationName(req, operationName)) {
		req.alias = `gql${operationName}Mutation`;
	}
};
