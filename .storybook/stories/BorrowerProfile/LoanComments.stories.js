import LoanComments from '#src/components/BorrowerProfile/LoanComments';

import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';

// Authors are a nested CommentAuthor with a lowercase CommentAuthorRole, matching
// what the loanCommentsFullList query returns. The flat authorName /
// authorImageUrl fields are deprecated in the schema and are not read here.
const AVATAR_URL = 'https://www.kiva.org/img/s100/9673d0722a7675b9b8d11f90849d9b44.jpg';

const mockComments = Array.from({ length: 20 }, (_, i) => ({
	id: i + 1,
	author: {
		name: i === 3 ? 'Aisha' : `Lender ${i + 1}`,
		imageUrl: i < 5 ? AVATAR_URL : null,
		role: i === 3 ? 'borrower' : 'lender',
		__typename: 'CommentAuthor',
	},
	body: i === 3
		? 'Thank you so much for your support! My dairy business is growing and I can now sell more milk.'
		: `This is a wonderful loan. I'm happy to support this borrower. Comment #${i + 1}.`,
	date: new Date(2025, 2, 15 - i).toISOString(),
	timeFlagged: null,
}));

function commentsMixin(comments, opts = {}) {
	const { isAdmin = false, subscribed = false } = opts;
	const mockData = {
		data: {
			lend: {
				loan: {
					id: 123,
					comments: { values: comments },
					userProperties: { subscribed },
				},
			},
			my: { id: 123, isAdmin },
		},
	};
	return {
		provide: {
			apollo: {
				mutate: () => Promise.resolve({}),
				readQuery: () => ({}),
				watchQuery: () => ({ subscribe: ({ next }) => next(mockData), setVariables() {} }),
				query: () => Promise.resolve(mockData),
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
	template: '<loan-comments :loan-id="123" />',
});

export const WithCommentsAdmin = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments, { isAdmin: true }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" />',
});
WithCommentsAdmin.storyName = 'With Comments (Admin)';

export const FewComments = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments.slice(0, 3)),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" />',
});

export const Subscribed = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin(mockComments.slice(0, 5), { subscribed: true }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" />',
});

export const Empty = () => ({
	components: { LoanComments },
	mixins: [
		commentsMixin([]),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<loan-comments :loan-id="123" />',
});
