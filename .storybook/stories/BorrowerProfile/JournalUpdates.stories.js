import JournalUpdates from '#src/components/BorrowerProfile/JournalUpdates';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	fundraisingPartnerLoan,
	createMockLoan,
	createQueryResult,
} from './mockLoanFixtures';

const noUpdatesLoan = createMockLoan({
	id: 2000099,
	updates: { totalCount: 0, values: [], __typename: 'UpdateCollection' },
});

export default {
	title: 'Components/BorrowerProfile/JournalUpdates',
	component: JournalUpdates,
};

export const Default = () => ({
	components: { JournalUpdates },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<journal-updates :loan-id="${fundraisingPartnerLoan.id}" />`,
});

export const NoUpdates = () => ({
	components: { JournalUpdates },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(noUpdatesLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<journal-updates :loan-id="${noUpdatesLoan.id}" />`,
});
