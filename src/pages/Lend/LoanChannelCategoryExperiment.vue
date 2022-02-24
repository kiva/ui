<template>
	<div :style="cssVars">
		<div
			class="lbc-hero-wrapper"
		>
			<div class="tw-w-full tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
				<div class="tw-mt-8 tw-mb-8 tw-w-full md:tw-w-3/5 lg:tw-w-1/2">
					<h1 class="tw-text-white">
						{{ targetedCategory.title }}
					</h1>
					<h3 class="tw-text-white tw-pr-6 tw-mt-2">
						{{ targetedCategory.description }}
					</h3>
				</div>
			</div>
		</div>
		<div class="tw-w-full tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<h2 class="tw-text-center tw-mt-6">
				{{ targetedCategory.tagline }}
			</h2>
		</div>

		<!-- TODO -->
		<!-- This block is also repeated in src/pages/Lend/LoanChannelCategoryControl.vue
		Should be extracted to it's own component -->
		<div v-if="loans.length > 0">
			<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-2">
				<loan-card-controller
					v-for="loan in firstLoan"
					:items-in-basket="itemsInBasket"
					:is-visitor="isVisitor"
					:key="loan.id"
					:loan="loan"
					loan-card-type="GridLoanCard"
				/>
				<promo-grid-loan-card
					v-if="mgTargetCategory"
					:category-url="mgTargetCategory.url"
					:category-label="mgTargetCategory.label"
				/>
				<loan-card-controller
					v-for="loan in remainingLoans"
					:items-in-basket="itemsInBasket"
					:is-visitor="isVisitor"
					:key="loan.id"
					:loan="loan"
					loan-card-type="GridLoanCard"
				/>
				<kv-loading-overlay v-if="loading" />
			</div>
			<kv-pagination v-if="totalCount > 0" :total="totalCount" :limit="limit" @page-change="pageChange" />
			<div v-if="totalCount > 0" class="loan-count tw-text-tertiary">
				{{ totalCount }} loans
			</div>
		</div>
		<!-- end block -->
	</div>
</template>

<script>
// TODO some of these computed properties are the same as src/pages/Lend/LoanChannelCategoryControl.vue
import gql from 'graphql-tag';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';
import KvPagination from '@/components/Kv/KvPagination';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';

const imageRequire = require.context('@/assets/images/lend-by-category-page/', true);
const loansPerPage = 12;

const pageQuery = gql`
	query loanChannelPage {
		my {
			userAccount {
				id
			}
		}
		lend {
			loanChannels(offset:0, limit:1000) {
				values {
					id
					description
				}
			}
		}
	}
`;

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			imageRequire,
			limit: loansPerPage,
			description: '',
			loanChannel: () => {},
			isVisitor: true,
			itemsInBasket: [], /* TODO */
		};
	},
	components: {
		LoanCardController,
		KvPagination,
		KvLoadingOverlay,
		PromoGridLoanCard,
	},
	props: {
		targetedLoanChannel: {
			type: String,
			default: ''
		},
	},
	computed: {
		categories() {
			return {
				women: {
					title: 'Women',
					tagline: 'Support women across a variety of causes',
					image: this.imageRequire('./lbc-women.jpg'),
					loanChannelId: 5,
				},
				'loans-to-women': {
					title: 'Women',
					tagline: 'Support women across a variety of causes',
					image: this.imageRequire('./lbc-women.jpg'),
					loanChannelId: 5
				},
				'kiva-u-s': {
					title: 'Kiva U.S.',
					tagline: 'Support people across the US',
					image: this.imageRequire('./lbc-kivaus.jpg'),
					loanChannelId: 28
				},
				agriculture: {
					title: 'Agriculture',
					tagline: 'Support agriculture across a variety of areas',
					image: this.imageRequire('./lbc-agriculture.jpg'),
					loanChannelId: 8
				},
				'eco-friendly': {
					title: 'Eco-friendly',
					tagline: 'Support eco-friendly causes in multiple ways',
					image: this.imageRequire('./lbc-ecofriendly.jpg'),
					loanChannelId: 18
				},
				'refugees-and-i-d-ps': {
					title: 'Refugees and IDPs',
					tagline: 'Support refugees and IDPs in multiple ways',
					image: this.imageRequire('./lbc-refugees.jpg'),
					loanChannelId: 32
				},
				shelter: {
					title: 'Shelter',
					tagline: 'Support housing across a variety of areas',
					image: this.imageRequire('./lbc-shelter.jpg'),
					loanChannelId: 6
				},
				'conflict-zones': {
					title: 'Conflict zones',
					tagline: 'Support people in conflict zones across a variety of areas',
					image: this.imageRequire('./lbc-conflict.jpg'),
					loanChannelId: 7
				},
				'single-parents': {
					title: 'Single parents',
					tagline: 'Support single parents in multiple ways',
					image: this.imageRequire('./lbc-parents.jpg'),
					loanChannelId: 26
				},
				'ending-soon': {
					title: 'Ending soon',
					tagline: 'Find time-sensitive loans across a variety of areas',
					image: this.imageRequire('./lbc-endingsoon.jpg'),
					loanChannelId: 3
				},
			};
		},
		targetedCategory() {
			return {
				// eslint-disable-next-line max-len
				description: this.description,
				...this.categories[this.targetedLoanChannel]
			};
		},
		cssVars() {
			return {
				'--hero-background': `url(${this.targetedCategory.image})`
			};
		},
		loans() {
			return this.loanChannel?.loans?.values ?? [];
		},
		firstLoan() {
			return [this.loans[0]];
		},
		remainingLoans() {
			const [, ...rest] = this.loans;
			return rest;
		},
		mgTargetCategory() {
			const currentRoute = this.$route.path.replace('/lend-by-category/', '');
			const targetRoutes = [
				{ route: 'women', url: '/monthlygood?category=women', label: 'women' },
				{ route: 'loans-to-women', url: '/monthlygood?category=women', label: 'women' },
				{ route: 'education', url: '/monthlygood?category=education', label: 'students' },
				{ route: 'loans-for-education', url: '/monthlygood?category=education', label: 'students' },
				{ route: 'refugees-and-i-d-ps', url: '/monthlygood?category=refugees', label: 'refugees' },
				{ route: 'loans-to-refugees-and-i-d-ps', url: '/monthlygood?category=refugees', label: 'refugees' },
				{ route: 'eco-friendly', url: '/monthlygood?category=eco_friendly', label: 'eco-friendly loans' },
				{ route: 'eco-friendly-loans', url: '/monthlygood?category=eco_friendly', label: 'eco-friendly loans' },
				{ route: 'agriculture', url: '/monthlygood?category=agriculture', label: 'farmers' },
				{ route: 'loans-to-farmers', url: '/monthlygood?category=agriculture', label: 'farmers' },
				{ route: 'kiva-u-s', url: '/monthlygood?category=us_borrowers', label: 'U.S. borrowers' },
				{ route: 'loans-to-u-s-small-businesses', url: '/monthlygood?category=us_borrowers', label: 'U.S. borrowers' }, // eslint-disable-line max-len
				{ route: 'united-states-loans', url: '/monthlygood?category=us_borrowers', label: 'U.S. borrowers' },
			];
			return targetRoutes.find(route => route.route === currentRoute);
		}
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			const loanChannelValues = data?.lend?.loanChannels?.values ?? [];
			this.isVisitor = !data?.my?.userAccount?.id;
			// eslint-disable-next-line max-len
			this.description = loanChannelValues.find(channel => channel.id === this.targetedCategory.loanChannelId).description;
		},
	},
};
</script>

<style lang="postcss" scoped>
.lbc-hero-wrapper {
	@apply tw-bg-brand tw-bg-cover tw-bg-no-repeat tw-flex tw-w-full lg:tw-min-h-[320px] xl:tw-min-h-[460px];
}

/* Medium screens and above */
@media screen and (min-width: 734px) {
	.lbc-hero-wrapper {
		@apply tw-bg-transparent tw-rounded-b-lg;

		background-image: linear-gradient(90deg, #26985D 20%, rgba(0, 197, 197, 0) 75%), var(--hero-background);
		background-position: 0, top right;
		background-size: auto, cover;
	}
}
</style>
