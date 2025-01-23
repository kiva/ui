import SupportedByLenders from '#src/components/BorrowerProfile/SupportedByLenders';
import activities from '../mock-data/activity-feed-data-mock';
import { KvUserAvatar } from '@kiva/kv-components';

export default {
	title: 'Components/SupportedByLenders',
	component: SupportedByLenders,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { SupportedByLenders, KvUserAvatar },
		setup() { return args; },
		template: `
			<supported-by-lenders
				:participants="participants"
			/>
		`,
	});
	return template;
};

export const Default = story({
	participants: activities.lend.loan.lendingActions,
});
