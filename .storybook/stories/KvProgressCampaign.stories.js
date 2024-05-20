import KvProgressCampaign from '#src/components/Kv/KvProgressCampaign';

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
					:funded-amount="fundedAmount"
					:total-amount="totalAmount"
					:days-left="daysLeft"
					:minimal-stats="minimalStats"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	daysLeft: 29, totalAmount: 4000, fundedAmount: 462,
});

export const MinimalStats = story({
	daysLeft: 29, totalAmount: 4000, fundedAmount: 462, minimalStats: true
});
