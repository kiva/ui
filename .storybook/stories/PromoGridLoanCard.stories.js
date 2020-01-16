import StoryRouter from 'storybook-vue-router';
import { select, radios } from '@storybook/addon-knobs';
import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';

const promoCategories = {
	Women1: { route: 'women', id: 'women', label: 'women' },
	Women2: { route: 'loans-to-women', id: 'women', label: 'women' },
	Education1: { route: 'education', id: 'education', label: 'students' },
	Education2: { route: 'loans-for-education', id: 'education', label: 'students' },
	Refugees1: { route: 'refugees-and-i-d-ps', id: 'refugees', label: 'refugees' },
	Refugees2: { route: 'loans-to-refugees-and-i-d-ps', id: 'refugees', label: 'refugees' },
	Eco1: { route: 'eco-friendly', id: 'eco_friendly', label: 'eco-friendly loans' },
	Eco2: { route: 'eco-friendly-loans', id: 'eco_friendly', label: 'eco-friendly loans' },
	Agriculture1: { route: 'agriculture', id: 'agriculture', label: 'farmers' },
	Agriculture2: { route: 'loans-to-farmers', id: 'agriculture' , label: 'farmers'},
};
const promoDefaultValue = { route: 'women', id: 'women', label: 'women' };

const expOptions = {
      Shown: 'shown',
      Control: 'control'
};

export default {
	title: 'Promos/MG Grid Loan Card',
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		PromoGridLoanCard,
	},
	props: {
		experimentData: {
			type: Object,
			default() {
				return select('Promo Category', promoCategories, promoDefaultValue);
			}
		},
		experimentVersion: {
			type: String,
			default: radios('Experiment Version', expOptions, 'shown')
		},
	},
	template: `
		<promo-grid-loan-card
			:experiment-data="experimentData"
			:experiment-version="experimentVersion"
		/>
	`,
});
export const GridView = () => ({
	components: {
		PromoGridLoanCard,
	},
	props: {
		experimentData: {
			type: Object,
			default() {
				return select('Promo Category', promoCategories, promoDefaultValue);
			}
		},
		experimentVersion: {
			type: String,
			default: radios('Experiment Version', expOptions, 'shown')
		},
		loanCardStyle: {
			type: Object,
			default() {
			return {
				border: '1px solid #d8d8d8',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				minWidth: '17.5rem',
				maxWidth: '30rem',
				position: 'relative',
				margin: 'auto',
				overflow: 'hidden',
				minHeight: '30rem',
				backgroundColor: '#3d3d3d',
				marginTop: '0'
			}}
		}
	},
	template: `
		<div class="columns small-12">
			<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
				<div category-set-id="" shift-increment="0" time-left-message="Ending now!" class="column column-block loan-card-controller" :style="loanCardStyle">
					<div class="grid-loan-card">
					</div>
				</div>
				<promo-grid-loan-card
					:experiment-data="experimentData"
					:experiment-version="experimentVersion"
				/>
				<div category-set-id="" shift-increment="0" time-left-message="Ending now!" class="column column-block loan-card-controller" :style="loanCardStyle">
					<div class="grid-loan-card">
					</div>
				</div>
			</div>
		</div>
	`,
});
