import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from "../mixins/cookie-store-story-mixin";

export default {
	title: 'MyKiva/JournalUpdatesCarousel',
	component: JournalUpdatesCarousel,
};

const updates = [
	{
		"__typename": "Update",
		"id": 1392249,
		"body": "<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",
		"subject": "Moses is happy.",
		"date": "2025-02-07T10:16:49Z",
		"loan": {
			"__typename": "LoanPartner",
			"id": 2722925,
			"name": "Moses",
			"status": "fundraising",
			"loanAmount": "1850.00",
			"loanFundraisingInfo": {
				"__typename": "LoanFundraisingInfo",
				"fundedAmount": "150.00",
				"reservedAmount": "0.00"
			},
			"image": {
				"__typename": "Image",
				"id": 5423429,
				"hash": "093374973a7cfb1f18652d3aac5bbd05"
			},
			"geocode": {
				"__typename": "Geocode",
				"country": {
					"__typename": "Country",
					"id": 1,
					"name": "Uganda",
				}
			}
		}
	},
	{
		"__typename": "Update",
		"id": 1392249,
		"body": "<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",
		"subject": "Moses is happy.",
		"date": "2025-02-07T10:16:49Z",
		"loan": {
			"__typename": "LoanPartner",
			"id": 2722925,
			"name": "Moses",
			"status": "fundraising",
			"loanAmount": "1850.00",
			"loanFundraisingInfo": {
				"__typename": "LoanFundraisingInfo",
				"fundedAmount": "150.00",
				"reservedAmount": "0.00"
			},
			"image": {
				"__typename": "Image",
				"id": 5423429,
				"hash": "093374973a7cfb1f18652d3aac5bbd05"
			},
			"geocode": {
				"__typename": "Geocode",
				"country": {
					"__typename": "Country",
					"id": 1,
					"name": "Uganda",
				}
			}
		}
	},
	{
		"__typename": "Update",
		"id": 1392249,
		"body": "<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",
		"subject": "Moses is happy.",
		"date": "2025-02-07T10:16:49Z",
		"loan": {
			"__typename": "LoanPartner",
			"id": 2722925,
			"name": "Moses",
			"status": "fundraising",
			"loanAmount": "1850.00",
			"loanFundraisingInfo": {
				"__typename": "LoanFundraisingInfo",
				"fundedAmount": "150.00",
				"reservedAmount": "0.00"
			},
			"image": {
				"__typename": "Image",
				"id": 5423429,
				"hash": "093374973a7cfb1f18652d3aac5bbd05"
			},
			"geocode": {
				"__typename": "Geocode",
				"country": {
					"__typename": "Country",
					"id": 1,
					"name": "Uganda",
				}
			}
		}
	},
	{
		"__typename": "Update",
		"id": 1392249,
		"body": "<p>He managed to buy manure to boost his crop production, he is earning better from sales.</p>",
		"subject": "Moses is happy.",
		"date": "2025-02-07T10:16:49Z",
		"loan": {
			"__typename": "LoanPartner",
			"id": 2722925,
			"name": "Moses",
			"status": "fundraising",
			"loanAmount": "1850.00",
			"loanFundraisingInfo": {
				"__typename": "LoanFundraisingInfo",
				"fundedAmount": "150.00",
				"reservedAmount": "0.00"
			},
			"image": {
				"__typename": "Image",
				"id": 5423429,
				"hash": "093374973a7cfb1f18652d3aac5bbd05"
			},
			"geocode": {
				"__typename": "Geocode",
				"country": {
					"__typename": "Country",
					"id": 1,
					"name": "Uganda",
				}
			}
		}
	}
];

const lender = {
	id: 1017469,
	public: true,
    inviterName: 'Test User',
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JournalUpdatesCarousel },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => Promise.resolve({
				fn: () => ({}),
			}),
		},
		template: `
			<div class="tw-bg-eco-green-1 tw-p-1">
				<journal-updates-carousel v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ updates, lender, totalUpdates: 4 });
export const LoadMore = story({ updates, lender, totalUpdates: 6 });
export const SingleUpdate = story({ updates: [updates[0]], lender, totalUpdates: 1 });
