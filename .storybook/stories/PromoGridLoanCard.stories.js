import StoryRouter from 'storybook-vue-router';
import { select, radios } from '@storybook/addon-knobs';
import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';

const promoCategories = {
	Women: { url: '/monthlygood?category=education', label: 'women' },
	Education: { url: '/monthlygood?category=education', label: 'students' },
	Refugees: { url: '/monthlygood?category=refugees', label: 'refugees' },
	Covid19: { url: '/covid19response', label: 'COVID-19' },
	EcoFriendly: { url: '/monthlygood?category=eco_friendly', label: 'eco-friendly loans' },
	Agriculture: { url: '/monthlygood?category=agriculture' , label: 'farmers'},
	KivaUS: { url: '/monthlygood?category=us_borrowers' , label: 'U.S. borrowers'},
};

const promoDefaultValue = { url: '/monthlygood?category=education', label: 'women' };

export default {
	title: 'Loan Cards/MG Grid Loan Card',
	component: PromoGridLoanCard,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		PromoGridLoanCard,
	},
	props: {
		categoryData: {
			type: Object,
			default() {
				return select('Promo Category', promoCategories, promoDefaultValue);
			}
		},
	},
	template: `
		<div style="height: 36rem;">
			<promo-grid-loan-card
				:category-label="categoryData.label"
				:category-url="categoryData.url"
			/>
		</div>
	`,
});

export const Compact = () => ({
	components: {
		PromoGridLoanCard,
	},
	props: {
		categoryData: {
			type: Object,
			default() {
				return select('Promo Category', promoCategories, promoDefaultValue);
			}
		},
	},
	template: `
	<div style="height: 20rem;">
		<promo-grid-loan-card
			:compact="true"
			:category-label="categoryData.label"
			:category-url="categoryData.url"
		/>
	</div>
	`,
});

export const GridView = () => ({
	components: {
		PromoGridLoanCard,
	},
	props: {
		categoryData: {
			type: Object,
			default() {
				return select('Promo Category', promoCategories, promoDefaultValue);
			}
		},
		loanCardStyle: {
			type: Object,
			default() {
			return {
				border: '1px solid #d8d8d8',
				height: '36rem',
				backgroundColor: '#3d3d3d',
			}}
		}
	},
	template: `
			<div class="row small-up-1 large-up-2 xxlarge-up-3">
				<div class="column column-block">
					<div class="grid-loan-card" :style="loanCardStyle"></div>
				</div>
				<div class="column column-block">
					<promo-grid-loan-card
						:category-label="categoryData.label"
						:category-url="categoryData.url"
					/>
				</div>
				<div class="column column-block">
					<div class="grid-loan-card" :style="loanCardStyle"></div>
				</div>
			</div>
	`,
});
