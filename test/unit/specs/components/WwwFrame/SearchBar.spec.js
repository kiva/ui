import { shallowMount } from '@vue/test-utils';
import SearchBar from '@/components/WwwFrame/SearchBar';
import suggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';

const suggestions = [
	{ group: 'U.S. cities', label: 'Akron, OH', query: 'city_state=Akron,OH' },
	{ group: 'U.S. cities', label: 'Anchorage, AK', query: 'city_state=Anchorage,AK' },
	{ group: 'U.S. cities', label: 'Islandia, NY', query: 'city_state=Islandia,NY' },
	{ group: 'U.S. cities', label: 'Chincoteague Island, VA', query: 'city_state=Chincoteague+Island,VA' },
	{ group: 'United States', label: 'Alaska (AK)', query: 'state=AK' },
	{ group: 'Countries and Territories', label: 'Albania', query: 'country=al' },
	{ group: 'Partners', label: 'Fundación Sartawi', query: 'partner=527' },
	{ group: 'Partners', label: 'iSchool Zambia', query: 'partner=356' },
];

describe('SearchBar', () => {
	let wrapper;
	let apollo = {};

	beforeEach(() => {
		const query = jest.fn();
		query.mockReturnValue(Promise.resolve({
			data: {
				lend: {
					loanSearchSuggestions: suggestions
				}
			}
		}));
		apollo = { query };
		wrapper = shallowMount(SearchBar, {
			provide: { apollo }
		});
	});

	it('should fetch suggestions when it gains focus', () => {
		const input = wrapper.find({ ref: 'input' });
		input.trigger('focus');
		input.trigger('blur');
		wrapper.vm.focus();
		expect(apollo.query.mock.calls.length).toBe(2);
		expect(apollo.query.mock.calls[0][0]).toEqual({ query: suggestionsQuery });
		expect(apollo.query.mock.calls[1][0]).toEqual({ query: suggestionsQuery });
	});

	it('should show filtered results when a serch term is entered', done => {
		const input = wrapper.find({ ref: 'input' });
		input.trigger('focus');
		input.element.value = 'ak';
		input.trigger('input');

		// $nextTick, setImmediate, and timeouts <2ms all execute too early to test these assertions
		setTimeout(() => {
			expect(wrapper.vm.term).toBe('ak');
			expect(wrapper.vm.showResults).toBe(true);
			expect(wrapper.vm.rawResults.length).toBe(3);
			expect(wrapper.vm.sections.length).toBe(2);
			done();
		}, 2);
	});

	it('should change the highlighted item when the up/down arrow keys are pressed', () => {
		const input = wrapper.find({ ref: 'input' });
		wrapper.vm.rawResults = suggestions;
		expect(wrapper.find('.highlighted').exists()).toBe(false);

		input.trigger('keydown.down');
		const first = wrapper.find('.highlighted').html();

		input.trigger('keydown.down');
		const second = wrapper.find('.highlighted').html();
		expect(second).not.toBe(first);

		input.trigger('keydown.up');
		const third = wrapper.find('.highlighted').html();
		expect(third).toBe(first);
	});
});
