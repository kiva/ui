import { render } from '@testing-library/vue';
import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';

describe('KvProgressCampaign', () => {
	it('should display default values', () => {
		const props = {
			daysLeft: 29, totalBorrowers: 4000, fundedBorrowers: 462,
		};
		const { getByText } = render(KvProgressCampaign, {
			props,
		});

		getByText(`${props.fundedBorrowers} funded`);
		getByText(`${props.totalBorrowers - props.fundedBorrowers} to go`);
		getByText(`${props.daysLeft} days left`);
	});

	it('should not display negative value on loans to go!', () => {
		const props = {
			daysLeft: 29, totalBorrowers: 4000, fundedBorrowers: 5000,
		};
		const { getByText } = render(KvProgressCampaign, {
			props,
		});

		getByText('0 to go');
	});
});
