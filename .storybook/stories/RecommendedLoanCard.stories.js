import RecommendedLoanCard from '@/components/LoanCards/RecommendedLoanCard';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const queryResult = {
	data: {
		lend: {
			loan: {
				id: 1998250,
				geocode: {
					country: {
						name: "Malawi",
						isoCode: "MW"
					}
				},
				image: {
					default: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w480h300/d5ad26cd7acc24317edc1c04c6250074.jpg",
					retina: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w960h600/d5ad26cd7acc24317edc1c04c6250074.jpg"
				},
				name: "Microloan Foundation Malawi",
				sector: {
					name: "Services"
				},
				whySpecial: "It helps Field Partners withstand negative economic impacts of the COVID-19 pandemic.",
				userProperties: {
					lentTo: null
				},
				use: "this Field Partner provide loans to women in rural Malawi during the COVID-19 crisis.",
				status: "fundraising",
				loanAmount: "250000.00",
				borrowerCount: 1,
				loanFundraisingInfo: {
					fundedAmount: "218950.00",
					reservedAmount: "0.00",
					isExpiringSoon: false
				},
				plannedExpirationDate: "2020-09-10T19:30:13Z"
			}
		}
	}
};

export default {
	title: 'Loan Cards/Recommended Loan Card',
	component: RecommendedLoanCard,
};

export const Default = () => ({
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
	components: { RecommendedLoanCard },
	template: `
		<div class="row">
			<div class="small-4 columns">
				<recommended-loan-card :loan-id="1998250" />
			</div>
		</div>
	`,
});

export const Loading = () => ({
	mixins: [apolloStoryMixin({ loading: true }), cookieStoreStoryMixin()],
	components: { RecommendedLoanCard },
	template: `
		<div class="row">
			<div class="small-4 columns">
				<recommended-loan-card :loan-id="1998250" />
			</div>
		</div>
	`,
});
