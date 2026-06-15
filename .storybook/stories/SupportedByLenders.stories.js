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

export const Empty = story({
	participants: {
		values: [],
		__typename: 'LendingActionCollection',
	},
});

export const CurrentUserHighlighted = story({
	participants: {
		values: [
			{
				latestSharePurchaseDate: '2023-11-15T08:00:00Z',
				lender: {
					name: 'You',
					image: {
						url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
					},
					publicId: 'current-user',
				},
				shareAmount: '50.00',
				isCurrentUser: true,
				__typename: 'LendingAction',
			},
			...activities.lend.loan.lendingActions.values,
		],
		__typename: 'LendingActionCollection',
	},
});
