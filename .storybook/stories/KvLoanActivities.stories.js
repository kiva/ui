import KvLoanActivities from '@/components/Kv/KvLoanActivities.vue';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
    title: 'Kv/KvLoanActivities',
    component: KvLoanActivities,
};

const loan = {
	id: 1998250,
	distributionModel: 'partner', // direct, partner, both
	geocode: {
		city: "Cranston",
		state: "RI",
		country: {
			name: "Malawi",
			isoCode: "MW"
		}
	},
	image: {
		hash: "d5ad26cd7acc24317edc1c04c6250074"
	},
	name: "Microloan Foundation Malawi",
	sector: {
		name: "Services"
	},
	whySpecial: "It helps Lending Partners withstand negative economic impacts of the COVID-19 pandemic.",
	userProperties: {
		lentTo: null
	},
	use: "this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",
	status: "fundraising",
	loanAmount: "250000.00",
	borrowerCount: 1,
	anonymizationLevel: "none",
	fullLoanUse: "A loan of $250,000 helps this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",
	fundraisingPercent: 0.75,
	unreservedAmount: '600',
	loanFundraisingInfo: {
		fundedAmount: "218950.00",
		reservedAmount: "0.00",
		isExpiringSoon: false
	},
	plannedExpirationDate: "2020-09-10T19:30:13Z",
	matchingText: "LISC",
	matchRatio: 2,
};

const activities = {
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

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		mixins: [cookieStoreStoryMixin()],
		props: Object.keys(argTypes),
		components: { KvLoanActivities },
		template: `
		<div style="max-width: 400px;">
			<kv-loan-activities
				:loan="loan"
				:activities="activities" />
		</div>`,
	})
	template.args = args;
	return template;
};

export const Default = story({ loan, activities });