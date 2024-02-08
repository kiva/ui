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
					:funded-borrowers="fundedBorrowers"
					:total-borrowers="totalBorrowers"
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
	daysLeft: 29, totalBorrowers: 4000, fundedBorrowers: 462,
});

export const MinimalStats = story({
	daysLeft: 29, totalBorrowers: 4000, fundedBorrowers: 462, minimalStats: true
});
