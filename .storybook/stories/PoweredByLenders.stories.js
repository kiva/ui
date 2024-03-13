import PoweredByLenders from '@/components/BorrowerProfile/PoweredByLenders';
import activities from '../mock-data/activity-feed-data-mock';
import KvUserAvatar from '~/@kiva/kv-components/vue/KvUserAvatar';

export default {
	title: 'Components/PoweredByLenders',
	component: PoweredByLenders,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { PoweredByLenders, KvUserAvatar },
		template: `
      <powered-by-lenders
        :participants="participants"
      />
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	participants: activities.lend.loan.lendingActions,
});
