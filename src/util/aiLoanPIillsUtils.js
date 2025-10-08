import aiLoanPillsQuery from '#src/graphql/query/aiLoanPills.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

/**
 * Retrieves the IDs of the provided loans
 *
 * @returns The IDs of the loans
 */
export const getLoansIds = loans => {
	return loans.map(loan => loan.id);
};

/**
 * Fetches the AI loan pills for the provided loan IDs
 *
 * @param apollo The current Apollo client
 * @param loanIds The loan IDs to fetch pills
 */
export const fetchAiLoanPills = async (apollo, loanIds) => {
	try {
		const { data } = await apollo.query({
			query: aiLoanPillsQuery,
			variables: { loanIds },
		});
		return data.getLoanPills?.values ?? [];
	} catch (e) {
		logReadQueryError(e, 'aiLoanPillsUtils aiLoanPillsQuery');
	}
};

/**
 * Adds AI pills to the provided loans
 * @param {*} loans loans array to add pills to
 * @param {*} pillsLoans pills data fetched from the server
 * @returns The loans with the added pills
 */
export const addAiPillsToLoans = (loans, pillsLoans) => {
	const loansWithPills = (loans ?? []).map(loan => {
		const foundPillsLoan = pillsLoans.find(p => p.loanId === loan?.id);
		const pills = foundPillsLoan?.pills ?? [];

		return {
			...loan,
			aiPills: pills.length ? pills : [],
		};
	});

	return loansWithPills;
};
