import salesforceQuery from '#src/graphql/query/salesforceQuery.graphql';

// Fetches a Salesforce solution and maps it to the { title, content } shape that
// ContentLightbox.open() expects (Salesforce calls them `name` and `note`).
// Returns null when no solution comes back, so callers can avoid opening an empty lightbox.
export async function fetchSalesforceSolution(apollo, id) {
	const { data } = await apollo.query({ query: salesforceQuery, variables: { id } });
	const solution = data?.general?.salesforceSolution ?? null;
	if (!solution) {
		return null;
	}
	return {
		title: solution.name ?? '',
		content: solution.note ?? '',
	};
}

export default fetchSalesforceSolution;
