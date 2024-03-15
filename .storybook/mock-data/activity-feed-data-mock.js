export default {
	lend: {
	  loan: {
		lendingActions: {
		  values: [
			{
			  latestSharePurchaseDate: '2023-11-13T10:51:10Z',
			  lender: {
				name: 'Erica',
				image: {
				  url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			  },
			  shareAmount: '5.00',
			  __typename: 'LendingAction',
			},
			{
			  latestSharePurchaseDate: '2023-11-08T02:32:20Z',
			  lender: {
				name: 'Joy',
				image: {
				  url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				},
			  },
			  shareAmount: '25.00',
			  __typename: 'LendingAction',
			},
		  ],
		  __typename: 'LendingActionCollection',
		},
		comments: {
		  values: [
			{
			  date: '2023-11-08T02:37:56Z',
			  authorName: 'Joy', // eslint-disable-next-line max-len
			  body: 'I know him and his wife and they work hard to make everything they do the best. His farm and bake goods are amazing. He just keeps working harder and harder to do more and reach out to the community in everyway.',
			  authorLendingAction: {
				lender: {
				  image: {
					url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg',
				  },
				},
			  },
			  __typename: 'Comment',
			},
		  ],
		  _typename: 'CommentCollection',
		},
		__typename: 'LoanDirect',
	  },
	  __typename: 'Lend',
	},
};
