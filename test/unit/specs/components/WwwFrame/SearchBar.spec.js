import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SearchBar from '#src/components/WwwFrame/SearchBar';
import suggestionsQuery from '#src/graphql/query/loanSearchSuggestions.graphql';
import byTextContent from '../../../helpers/byTextContent';

const suggestions = [
	{ group: 'U.S. cities', label: 'Akron, OH', query: 'cityState=Akron,OH' },
	{ group: 'U.S. cities', label: 'Anchorage, AK', query: 'cityState=Anchorage,AK' },
	{ group: 'U.S. cities', label: 'Islandia, NY', query: 'cityState=Islandia,NY' },
	{ group: 'U.S. cities', label: 'Chincoteague Island, VA', query: 'cityState=Chincoteague+Island,VA' },
	{ group: 'United States', label: 'Alaska (AK)', query: 'state=AK' },
	{ group: 'Countries and Territories', label: 'Albania', query: 'country=al' },
	{ group: 'Partners', label: 'Fundación Sartawi', query: 'partner=527' },
	{ group: 'Partners', label: 'iSchool Zambia', query: 'partner=356' },
];

// Return a mock ApolloClient instance
function getMockApollo() {
	const query = vi.fn();
	query.mockReturnValue(Promise.resolve({
		data: {
			lend: {
				loanSearchSuggestions: suggestions
			}
		}
	}));
	return { query };
}

// Render the search bar, optionally taking an ApolloClient instance to provide to the component
function renderSearchBar(apollo = getMockApollo()) {
	return render(SearchBar, {
		global: {
			provide: { apollo },
			mocks: {
				lockScrollSmallOnly: vi.fn(),
				unlockScrollSmallOnly: vi.fn(),
				$kvTrackEvent: vi.fn(),
			},
		},
	});
}

describe('SearchBar', () => {
	it('should fetch suggestions when it gains focus', async () => {
		const user = userEvent.setup();
		const apollo = getMockApollo();
		const { getByPlaceholderText } = renderSearchBar(apollo);

		const input = getByPlaceholderText('Search all loans');
		await user.click(input); // click into the search bar
		await user.tab(); // tab away from the search bar
		await user.click(input); // click into the search bar again

		// Expect apollo.query to have been called twice with the suggestions query
		expect(apollo.query.mock.calls.length).toBe(2);
		expect(apollo.query.mock.calls[0][0]).toEqual({ query: suggestionsQuery });
		expect(apollo.query.mock.calls[1][0]).toEqual({ query: suggestionsQuery });
	});

	it('should show filtered results when a search term is entered', async () => {
		const user = userEvent.setup();
		const { getByPlaceholderText, findAllByTestId, findByText } = renderSearchBar();

		// Type 'ak' in the search bar
		const input = getByPlaceholderText('Search all loans');
		await user.type(input, 'ak');

		// Expect only 3 results to be displayed
		const results = await findAllByTestId('header-search-result-item');
		expect(results.length).toBe(3);

		// Expect that these groups are displayed
		await findByText('U.S. cities');
		await findByText('United States');

		// Expect that these results are displayed
		await findByText(byTextContent('Akron, OH'));
		await findByText(byTextContent('Anchorage, AK'));
		await findByText(byTextContent('Alaska (AK)'));
	});

	it('should change the highlighted item when the up/down arrow keys are pressed', async () => {
		const user = userEvent.setup();
		const { getByPlaceholderText, findAllByTestId } = renderSearchBar();
		const isHighlighted = node => node.classList.contains('tw-bg-secondary');
		const searchTerm = 'a';

		// Type searchTerm in the search bar
		const input = getByPlaceholderText('Search all loans');
		await user.type(input, searchTerm);

		// Wait for results to be displayed
		const [first, second] = await findAllByTestId('header-search-result-item');

		// Confirm first element is not already highlighted
		expect(isHighlighted(first)).toBe(false);

		// Arrowing down should highlight the first result and fill the search input with the first result
		await user.type(input, '{arrowdown}');
		expect(isHighlighted(first)).toBe(true);
		expect(input.value).toBe(first.textContent);

		// Arrowing down again should highlight the second result, unhighlight the first result,
		// and fill the search input with the second result
		await user.type(input, '{arrowdown}');
		expect(isHighlighted(second)).toBe(true);
		expect(isHighlighted(first)).toBe(false);
		expect(input.value).toBe(second.textContent);

		// Arrowing up should highlight the first result again, unhighlight the second result,
		// and fill the search input with the first result again
		await user.type(input, '{arrowup}');
		expect(isHighlighted(first)).toBe(true);
		expect(isHighlighted(second)).toBe(false);
		expect(input.value).toBe(first.textContent);

		// Arrowing up again should unhighlight the first result and fill the search input with the original search term
		await user.type(input, '{arrowup}');
		expect(isHighlighted(first)).toBe(false);
		expect(input.value).toBe(searchTerm);
	});
});
