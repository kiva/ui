import JournalUpdateCard from '#src/components/MyKiva/JournalUpdateCard.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from "../mixins/cookie-store-story-mixin";

export default {
	title: 'MyKiva/JournalUpdateCard',
	component: JournalUpdateCard,
};

const update = {
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
};

const lender = {
	id: 1017469,
	public: true,
    inviterName: 'Test User',
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JournalUpdateCard },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => Promise.resolve({
				fn: () => ({}),
			}),
		},
		template: `
			<div class="tw-bg-eco-green-1 tw-p-1" style="max-width: 450px;">
				<journal-update-card
					v-bind="args"
					@read-more-clicked="onReadMoreClicked"
					@share-loan-clicked="onShareLoanClicked"
				/>
			</div>
		`,
		methods: {
			onReadMoreClicked(updateId) {
				console.log(updateId);
			},
			onShareLoanClicked() {
				console.log('share loan clicked');
			},
		},
	});
	template.args = args;
	return template;
};

export const Default = story({ update, lender });
export const Repaying = story({ update: { ...update, loan: { ...update.loan, status: 'funded' } }, lender });
export const UpdateNumber = story({ update, updateNumber: '2', lender });
export const NotTruncatedBody = story({ update: { ...update, body: 'Testing not truncated body feature.' }, lender});
