import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';

const promoCategories = {
	Women: { url: '/monthlygood?category=women', label: 'women' },
	Education: { url: '/monthlygood?category=education', label: 'students' },
	Refugees: { url: '/monthlygood?category=refugees', label: 'refugees' },
	EcoFriendly: { url: '/monthlygood?category=eco_friendly', label: 'eco-friendly loans' },
	Agriculture: { url: '/monthlygood?category=agriculture' , label: 'farmers'},
	KivaUS: { url: '/monthlygood?category=us_borrowers' , label: 'U.S. borrowers'},
	Covid19: { url: '/covid19response', label: 'COVID-19-affected businesses' },
};

export default {
	title: 'Loan Cards/MG Grid Loan Card',
	component: PromoGridLoanCard,
	argTypes: {
		categoryLabel:{
			control: {
				type: "select",
				options: Object.values(promoCategories).map(value => value.label)
			}
		},
		categoryUrl:{
			control: {
				type: "select",
				options: Object.values(promoCategories).map(value => value.url),
			}
		}
	},
	args: {
		loanCardStyle: {
			border: '1px solid #d8d8d8',
			height: '36rem',
			backgroundColor: '#3d3d3d',
		},
		compact: true,
		categoryLabel: 'women',
		categoryUrl: '/monthlygood?category=women',
	}
};

export const Default = (args, { argTypes }) => ({
	components: {
		PromoGridLoanCard,
	},
	props: Object.keys(argTypes),
	template: `
		<div class="row small-up-1 large-up-2 xxlarge-up-3 align-center">
			<div class="column column-block" style="height: 36rem;">
				<promo-grid-loan-card
					:category-label="categoryLabel"
					:category-url="categoryUrl"
				/>
			</div>
		</div>
	`,
});

export const Compact = (args, { argTypes }) => ({
	components: {
		PromoGridLoanCard,
	},
	props: Object.keys(argTypes),
	template: `
		<div class="row small-up-1 large-up-2 xxlarge-up-3 align-center">
			<div class="column column-block" style="height: 25rem;">
				<promo-grid-loan-card
					:compact="compact"
					:category-label="categoryLabel"
					:category-url="categoryUrl"
				/>
			</div>
		</div>
	`,
});

export const GridView = (args, { argTypes }) => ({
	components: {
		PromoGridLoanCard,
	},
	props: Object.keys(argTypes),
	template: `
		<div class="row small-up-1 large-up-2 xxlarge-up-3">
			<div class="column column-block">
				<div class="grid-loan-card" :style="loanCardStyle"></div>
			</div>
			<div class="column column-block">
				<promo-grid-loan-card
					:category-label="categoryLabel"
					:category-url="categoryUrl"
				/>
			</div>
			<div class="column column-block">
				<div class="grid-loan-card" :style="loanCardStyle"></div>
			</div>
		</div>
	`,
});
