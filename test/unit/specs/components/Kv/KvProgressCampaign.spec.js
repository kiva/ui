import { render } from '@testing-library/vue';
import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';

describe('KvProgressCampaign', () => {
	it('should display default values', () => {
		const props = {
			raisedMoney: 345900, daysLeft: 29, totalLoans: 4000, fundedLoans: 462,
		};
		const { getByText } = render(KvProgressCampaign, {
			props,
		});

		getByText(`${props.fundedLoans} loans funded`);
		getByText('$345,900 raised');
		getByText(`${props.totalLoans - props.fundedLoans} to go!`);
		getByText(`${props.daysLeft} days remaining`);
	});

	it('should not display negative value on loans to go!', () => {
		const props = {
			raisedMoney: 345900, daysLeft: 29, totalLoans: 4000, fundedLoans: 5000,
		};
		const { getByText } = render(KvProgressCampaign, {
			props,
		});

		getByText(`${props.fundedLoans} loans funded`);
		getByText('$345,900 raised');
		getByText('0 to go!');
	});
});
