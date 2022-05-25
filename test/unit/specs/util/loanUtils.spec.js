import { fetchLoanFacets } from '@/util/loanUtils';
import loanFacetsQuery from '@/graphql/query/loanFacetsQuery.graphql';

describe('loanUtils.js', () => {
	describe('fetchLoanFacets', () => {
		const dataObj = { data: { lend: { countryFacets: [], sector: [] } } };
		const apollo = { query: jest.fn(() => Promise.resolve(dataObj)) };
		const apolloVariables = { query: loanFacetsQuery, fetchPolicy: 'network-only' };

		it('should pass the correct query variables to apollo', async () => {
			await fetchLoanFacets(apollo);
			expect(apollo.query).toHaveBeenCalledWith(apolloVariables);
		});

		it('should return the facets data', async () => {
			const data = await fetchLoanFacets(apollo);
			expect(data).toEqual({ countryFacets: [], sectorFacets: [] });
		});
	});
});
