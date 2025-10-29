import { render } from '@testing-library/vue';
import KvProgressCampaign from '../../../../../src/components/Kv/KvProgressCampaign';
import numeral from 'numeral';

describe('KvProgressCampaign', () => {
	it('should display default values', () => {
		const props = {
			daysLeft: '29 days', totalAmount: 4000, fundedAmount: 462,
		};
		const { getByText } = render(KvProgressCampaign, {
			props,
		});

		const amountLeft = numeral(props.totalAmount - props.fundedAmount).format('$0,0');

		getByText(`${amountLeft} to go`);
		getByText(`${props.daysLeft} remaining`);
	});

	it('should not display negative value on loans to go!', () => {
		const props = {
			daysLeft: '29 days', totalAmount: 4000, fundedAmount: 5000,
		};
		const { getByText } = render(KvProgressCampaign, {
			props,
		});

		getByText('$0 to go');
	});
});
