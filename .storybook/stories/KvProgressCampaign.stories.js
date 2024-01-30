import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';

export default {
	title: 'Kv/KvProgressCampaign',
	component: KvProgressCampaign,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvProgressCampaign },
		template: `
			<div>
				<kv-progress-campaign
          :funded-loans="fundedLoans"
					:total-loans="totalLoans"
          :days-left="daysLeft"
					:raised-money="raisedMoney"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	raisedMoney: 345900, daysLeft: 29, totalLoans: 4000, fundedLoans: 462,
});
