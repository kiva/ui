import { render } from '@testing-library/vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import numeralFilter from '#src/plugins/numeral-filter';
import ImpactStat from '#src/components/Portfolio/ImpactStats/ImpactStat';

const KvTooltip = {
	props: ['controller'],
	template: '<div data-testid="tooltip" :data-controller="controller"><slot></slot></div>',
};

const global = {
	...globalOptions,
	stubs: { KvTooltip },
	mocks: { ...globalOptions.mocks, $filters: { numeral: numeralFilter } },
};

const renderStat = (props = {}, slots = {}) => render(ImpactStat, {
	props: {
		label: 'Lives touched',
		tooltip: 'The number of borrowers you\'ve lent to.',
		valueTestId: 'impact-lives-touched',
		value: 1284,
		...props,
	},
	slots,
	global,
});

const valueOf = getByTestId => getByTestId('impact-lives-touched').textContent.trim();

describe('ImpactStat', () => {
	it('shows the label and the formatted value', () => {
		const { getByText, getByTestId } = renderStat();

		getByText('Lives touched');
		expect(valueOf(getByTestId)).toBe('1,284');
	});

	it('formats money with the given format', () => {
		const { getByTestId } = renderStat({ value: 4240, format: '$0,0[.]00' });

		expect(valueOf(getByTestId)).toBe('$4,240');
	});

	it('shows zero', () => {
		const { getByTestId } = renderStat({ value: 0 });

		expect(valueOf(getByTestId)).toBe('0');
	});

	it('shows a dash when the value is unknown', () => {
		const { getByTestId } = renderStat({ value: null });

		expect(valueOf(getByTestId)).toBe('—');
	});

	it('shows loading text while loading', () => {
		const { getByTestId } = renderStat({ loading: true });
		const value = getByTestId('impact-lives-touched');

		expect(value.querySelector('.kv-loading-text')).not.toBeNull();
		expect(value.textContent).not.toMatch(/\d/);
	});

	it('opens its tooltip from the info button', () => {
		const { getByRole, getByTestId } = renderStat();
		const button = getByRole('button', { name: 'About Lives touched' });
		const tooltip = getByTestId('tooltip');

		expect(button.id).not.toBe('');
		expect(tooltip.dataset.controller).toBe(button.id);
		expect(tooltip.textContent.trim()).toBe('The number of borrowers you\'ve lent to.');
	});

	it('gives each cell its own tooltip', () => {
		const TwoStats = {
			components: { ImpactStat },
			template: `
				<ImpactStat label="Donations" tooltip="a" value-test-id="a" />
				<ImpactStat label="Total impact" tooltip="b" value-test-id="b" />
			`,
		};
		const { getAllByRole } = render(TwoStats, { global });
		const [first, second] = getAllByRole('button').map(button => button.id);

		expect(first).not.toBe(second);
	});

	it('renders the slot under the value', () => {
		const { getByTestId, getByText } = renderStat({}, { default: '<a href="/portfolio/loans">View my loans</a>' });
		const value = getByTestId('impact-lives-touched');
		const link = getByText('View my loans');

		expect(value.compareDocumentPosition(link)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});
});
