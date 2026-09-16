/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import { globalOptions, routerLinkStub } from '../../../specUtils';

function mountSummaryCard({ anonymizationLevel, distributionModel, geocode } = {}) {
	const openDefinition = vi.fn();
	const wrapper = mount(SummaryCard, {
		props: {
			loan: {
				id: 12345,
				name: 'Test Borrower',
				fullLoanUse: 'A loan of $600 helps...',
				anonymizationLevel,
				distributionModel,
				geocode,
			},
		},
		global: {
			...globalOptions,
			stubs: { RouterLink: routerLinkStub },
			mocks: {
				...globalOptions.mocks,
				$route: { params: { id: '12345' } },
			},
			provide: {
				...globalOptions.provide,
				openDefinition,
			},
		},
	});
	return { wrapper, openDefinition };
}

describe('SummaryCard anonymization affordances', () => {
	it('opens the anonymized-loan definition when the PII info icon is clicked', async () => {
		const { wrapper, openDefinition } = mountSummaryCard({ anonymizationLevel: 'pii' });

		await wrapper.find('[data-testid="bp-summary-pii-info"]').trigger('click');

		expect(openDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-anonymized-loan',
			sfid: '501US00000NRTYa',
		});
	});

	it('opens the anonymous-description definition when "Learn more" is clicked', async () => {
		const { wrapper, openDefinition } = mountSummaryCard({ anonymizationLevel: 'full' });

		await wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').trigger('click');

		expect(openDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-anonymous-description',
			sfid: '50150000000SXVz',
		});
	});

	it('renders neither affordance for a non-anonymized loan', () => {
		const { wrapper } = mountSummaryCard({ anonymizationLevel: '' });

		expect(wrapper.find('[data-testid="bp-summary-pii-info"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').exists()).toBe(false);
	});

	it('shows the PII icon only for pii loans, not full anonymization', () => {
		const { wrapper } = mountSummaryCard({ anonymizationLevel: 'full' });

		expect(wrapper.find('[data-testid="bp-summary-pii-info"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').exists()).toBe(true);
	});
});

describe('SummaryCard location line', () => {
	it.each([
		{
			case: 'partner loan with a city',
			distributionModel: 'partner',
			geocode: { city: 'Nyamira', state: '', country: { name: 'Kenya' } },
			expected: 'Nyamira, Kenya',
		},
		{
			case: 'partner loan with no city',
			distributionModel: 'partner',
			geocode: { city: '', state: '', country: { name: 'Kenya' } },
			expected: 'Kenya',
		},
		{
			case: 'direct loan',
			distributionModel: 'direct',
			geocode: { city: 'Portland', state: 'Oregon', country: { name: 'United States' } },
			expected: 'Portland, Oregon, United States',
		},
		{
			case: 'Puerto Rico partner loan',
			distributionModel: 'partner',
			geocode: { city: 'San Juan', state: 'PR', country: { name: 'Puerto Rico' } },
			expected: 'San Juan, PR',
		},
	])('formats the location of a $case as $expected', ({ distributionModel, geocode, expected }) => {
		const { wrapper } = mountSummaryCard({ distributionModel, geocode });

		expect(wrapper.find('[data-testid="bp-summary-country-tag"]').text()).toBe(expected);
	});
});
