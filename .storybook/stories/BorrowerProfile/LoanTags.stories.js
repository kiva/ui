import LoanTags from '#src/components/BorrowerProfile/LoanTags';

import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';

const mockAvailableTags = [
	{ id: 1, name: 'Education', description: 'Loans for education purposes', status: 'active', vocabularyId: 2 },
	{ id: 2, name: 'Sustainable Agriculture', description: 'Farming practices that are environmentally friendly', status: 'active', vocabularyId: 2 },
	{ id: 3, name: 'Women-Owned Business', description: 'Businesses owned and operated by women', status: 'active', vocabularyId: 2 },
	{ id: 4, name: 'First-Time Borrower', description: 'Borrower applying for their first loan', status: 'active', vocabularyId: 2 },
	{ id: 5, name: 'Rural Area', description: 'Located in a rural community', status: 'active', vocabularyId: 2 },
];

/**
 * Creates a mock apollo provider where query() returns different data
 * depending on whether the query has a loanId variable (loan tags query)
 * or not (available tags query).
 */
function loanTagsMixin(appliedTagNames = []) {
	return {
		provide: {
			apollo: {
				mutate() {
					return Promise.resolve({});
				},
				readQuery() {
					return {};
				},
				watchQuery() {
					return {
						subscribe: ({ next }) => { next({}); },
						setVariables() {},
					};
				},
				query({ variables } = {}) {
					if (variables?.loanId) {
						// Loan tags query
						return Promise.resolve({
							data: {
								lend: {
									loan: {
										id: variables.loanId,
										tags: appliedTagNames,
									},
								},
							},
						});
					}
					// Available tags query
					return Promise.resolve({
						data: {
							lend: {
								tag: mockAvailableTags,
							},
						},
					});
				},
				readFragment() {
					return null;
				},
			},
		},
	};
}

export default {
	title: 'Components/BorrowerProfile/LoanTags',
	component: LoanTags,
};

export const WithTags = () => ({
	components: { LoanTags },
	mixins: [
		loanTagsMixin(['Education', 'Sustainable Agriculture', 'Women-Owned Business']),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<loan-tags :loan-id="12345" />`,
});

export const WithTagsLoggedIn = () => ({
	components: { LoanTags },
	mixins: [
		loanTagsMixin(['Education', 'Sustainable Agriculture']),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<loan-tags :loan-id="12345" :is-logged-in="true" />`,
});

export const NoTags = () => ({
	components: { LoanTags },
	mixins: [
		loanTagsMixin([]),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<loan-tags :loan-id="23456" />`,
});
NoTags.storyName = 'No Tags (Anonymous)';

export const NoTagsLoggedIn = () => ({
	components: { LoanTags },
	mixins: [
		loanTagsMixin([]),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<loan-tags :loan-id="23456" :is-logged-in="true" />`,
});
NoTagsLoggedIn.storyName = 'No Tags (Logged In)';

export const MaxTagsReached = () => ({
	components: { LoanTags },
	mixins: [
		loanTagsMixin(['Education', 'Sustainable Agriculture', 'Women-Owned Business', 'First-Time Borrower', 'Rural Area']),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<loan-tags :loan-id="34567" :is-logged-in="true" />`,
});
