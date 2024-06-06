import KvLoanActivities from '#src/components/Kv/KvLoanActivities.vue';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import activities from '../mock-data/activity-feed-data-mock';

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

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		mixins: [cookieStoreStoryMixin()],
		props: Object.keys(argTypes),
		components: { KvLoanActivities },
		setup() { return args; },
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
