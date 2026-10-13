/* eslint-disable import/no-extraneous-dependencies */
import { enableAutoUnmount, mount } from '@vue/test-utils';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import LoanActionLinks from '#src/components/BorrowerProfile/LoanActionLinks';
import LoanActionsMenu from '#src/components/BorrowerProfile/LoanActionsMenu';
import { globalOptions, routerLinkStub } from '../../../specUtils';

enableAutoUnmount(afterEach);

function mountSummaryCard({
	anonymizationLevel, distributionModel, geocode, showActions = false,
} = {}) {
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
			showActions,
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

describe('SummaryCard loan actions (new user version)', () => {
	it('renders neither the kebab nor the action links by default', () => {
		const { wrapper } = mountSummaryCard();

		expect(wrapper.find('[data-testid="bp-summary-actions-menu"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-actions"]').exists()).toBe(false);
		expect(wrapper.findComponent(LoanActionsMenu).exists()).toBe(false);
		expect(wrapper.findComponent(LoanActionLinks).exists()).toBe(false);
	});

	it('renders the kebab in the name row and the action links below the tags when showActions is on', () => {
		const { wrapper } = mountSummaryCard({ showActions: true });

		const menuWrapper = wrapper.find('[data-testid="bp-summary-actions-menu"]');
		const linksWrapper = wrapper.find('[data-testid="bp-summary-actions"]');

		expect(menuWrapper.classes()).toContain('md:tw-hidden');
		expect(menuWrapper.findComponent(LoanActionsMenu).exists()).toBe(true);
		expect(linksWrapper.classes()).toEqual(expect.arrayContaining(['tw-hidden', 'md:tw-block']));
		expect(linksWrapper.findComponent(LoanActionLinks).exists()).toBe(true);
	});

	describe.each([
		['action links', LoanActionLinks],
		['kebab menu', LoanActionsMenu],
	])('re-emits from the %s', (_, component) => {
		it.each(['share', 'loan-details'])('%s', event => {
			const { wrapper } = mountSummaryCard({ showActions: true });

			wrapper.findComponent(component).vm.$emit(event);

			expect(wrapper.emitted(event)).toHaveLength(1);
		});
	});
});
