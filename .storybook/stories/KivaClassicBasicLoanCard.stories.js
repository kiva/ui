import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const queryResult = {
	data: {
		lend: {
			loan: {
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
			}
		}
	}
};

export default {
	title: 'Loan Cards/Kiva Classic Basic Loan Card',
	component: KivaClassicBasicLoanCard,
};

export const Default = () => ({
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
	components: { KivaClassicBasicLoanCard },
	template: `
		<div class="kv-tailwind">
			<kiva-classic-basic-loan-card :loan-id="1998250" />
		</div>
	`,
});

export const Loading = () => ({
	mixins: [apolloStoryMixin({ loading: true }), cookieStoreStoryMixin()],
	components: { KivaClassicBasicLoanCard },
	template: `
		<div class="kv-tailwind">
			<kiva-classic-basic-loan-card :loan-id="1998250" />
		</div>
	`,
});
