import LoanComments from '#src/components/BorrowerProfile/LoanComments';

import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';

const mockComments = Array.from({ length: 20 }, (_, i) => ({
	id: i + 1,
	authorName: i === 3 ? 'Aisha' : `Lender ${i + 1}`,
	authorImageUrl: i < 5 ? 'https://www.kiva.org/img/s100/9673d0722a7675b9b8d11f90849d9b44.jpg' : null,
	authorRole: i === 3 ? 'Borrower' : 'Lender',
	body: i === 3
		? 'Thank you so much for your support! My dairy business is growing and I can now sell more milk.'
		: `This is a wonderful loan. I'm happy to support this borrower. Comment #${i + 1}.`,
	date: new Date(2025, 2, 15 - i).toISOString(),
	timeFlagged: null,
}));

function commentsMixin(comments, opts = {}) {
	const { isLoggedIn = true, lentTo = true, isSubscribed = false } = opts;
	return {
		provide: {
			apollo: {
				mutate: () => Promise.resolve({}),
				readQuery: () => ({}),
				watchQuery: () => ({ subscribe: ({ next }) => next({}), setVariables() {} }),
				query: () => Promise.resolve({
					data: {
						lend: {
							loan: {
								id: 123,
								comments: { values: comments },
								userProperties: { lentTo, subscribed: isSubscribed },
							},
						},
						my: isLoggedIn
							? { id: 'user-1', userAccount: { id: 123 } }
							: { id: null },
					},
				}),
				readFragment: () => null,
			},
		},
	};
}

export default {
	title: 'Components/BorrowerProfile/LoanComments',
	component: LoanComments,
};

export const WithComments = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" />',
});

export const WithCommentsAdmin = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" :is-admin="true" />',
});
WithCommentsAdmin.storyName = 'With Comments (Admin)';

export const FewComments = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments.slice(0, 3)),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" />',
});

export const Subscribed = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments.slice(0, 5), { isSubscribed: true }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" />',
});

export const NotLentTo = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments.slice(0, 5), { lentTo: false }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" />',
});
NotLentTo.storyName = 'Logged In, Not Lent To (No Form)';

export const Anonymous = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments.slice(0, 5), { isLoggedIn: false, lentTo: false }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" />',
});
Anonymous.storyName = 'Anonymous (No Form, No Actions)';

export const Empty = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin([]),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="true" />',
});

export const NotPrivileged = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" :is-privileged="false" />',
});
NotPrivileged.storyName = 'Not Privileged (Hidden)';
