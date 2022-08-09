<template>
	<div :style="cssVars">
		<!-- Removed for v3 of experiment
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
		</div> -->

		<div class="tw-w-full tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<div class="tw-mt-2">
				<p class="tw-text-small">
					<router-link to="/lend-by-category">
						All Loans
					</router-link> >
					<span class="show-for-large">{{ targetedCategory.title }}</span>
				</p>
				<h1>
					{{ targetedCategory.title }}
				</h1>
				<p
					class="tw-pr-6 tw-mt-2 tw-mb-4 tw-max-w-3xl"
				>
					{{ targetedCategory.description }}
				</p>
			</div>

			<div
				class="tw-flex tw-justify-start md:tw-justify-center
			md:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"
			>
				<kv-button
					class="tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap"
					v-for="category in subCategories" :key="category.name"
					:variant="selectedSubCategory.name === category.name ? 'link' : 'secondary'"
					@click="handleFilterClick(category)"
				>
					{{ category.name }}
				</kv-button>
				<kv-button
					class="tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap"
					variant="secondary"
					:href="targetedCategory.filterLink"
				>
					More...
				</kv-button>
			</div>

			<div
				class="tw-text-center tw-my-4"
			>
				<kv-loading-spinner v-if="loading" />
			</div>

			<!-- TODO -->
			<!-- This block is also repeated in src/pages/Lend/LoanChannelCategoryControl.vue
			Should be extracted to it's own component -->
			<div v-if="!loading">
				<div v-if="loans.length > 0">
					<div class="tw-mt-4 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-0">
						<loan-card-controller
							v-for="loan in firstLoan"
							:items-in-basket="loanIdsInBasket"
							:is-visitor="isVisitor"
							:key="loan.id"
							:loan="loan"
							loan-card-type="GridLoanCard"
						/>
						<div class="column column-block" v-if="mgTargetCategory">
							<promo-grid-loan-card
								v-if="mgTargetCategory"
								:category-url="mgTargetCategory.url"
								:category-label="mgTargetCategory.label"
							/>
						</div>
						<loan-card-controller
							v-for="loan in remainingLoans"
							:items-in-basket="loanIdsInBasket"
							:is-visitor="isVisitor"
							:key="loan.id"
							:loan="loan"
							loan-card-type="GridLoanCard"
						/>
					</div>
					<kv-pagination
						v-if="totalCount > 0"
						:total="totalCount"
						:limit="limit"
						:offset="offset"
						@page-changed="pageChange"
					/>
					<div v-if="totalCount > 0" class="tw-mb-2 tw-text-center tw-text-tertiary">
						{{ totalCount }} loans
					</div>
				</div>

				<div v-if="loans.length === 0">
					<div class="tw-w-full tw-text-center tw-mb-10 tw-mt-10">
						<p>
							<!-- eslint-disable-next-line max-len -->
							There aren’t any loans in this category right now. Don’t worry there are other people to help <router-link to="/lend-by-category">
								here.
							</router-link>
						</p>
					</div>
				</div>
			</div>
			<!-- end block -->
		</div>
	</div>
</template>

<script>
// TODO some of these computed properties are the same as src/pages/Lend/LoanChannelCategoryControl.vue
/** TODO - V3 of this experimental layout removed the hero background.
 * @/assets/images/lend-by-category-page/ are currently unused */
import gql from 'graphql-tag';
import numeral from 'numeral';

import basicLoanQuery from '@/graphql/query/basicLoanData.graphql';
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvPagination from '@/components/Kv/KvPagination';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const imageRequire = require.context('@/assets/images/lend-by-category-page/', true);
const loansPerPage = 12;

// A map of functions to transform url query parameters to/from graphql variables.
// Each key in urlParamTransform is a url query parameter (e.g. the 'page' in ?page=2).
// Each value is then an object with the to/from functions to write/read the url parameter.
const urlParamTransform = {
	page: {
		to({ offset }) {
			const page = Math.floor(offset / loansPerPage) + 1;
			return page > 1 ? String(page) : undefined;
		},
		from({ page }) {
			const pagenum = numeral(page).value() - 1;
			return { offset: pagenum > 0 ? loansPerPage * pagenum : 0 };
		}
	},
};
// Turn an object of graphql variables into an object of url query parameters
function toUrlParams(variables) {
	return { page: urlParamTransform.page.to(variables) };
}

// Turn an object of url query parameters into an object of graphql variables
function fromUrlParams(params) {
	return urlParamTransform.page.from(params);
}

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

const categoryProperties = {
	women: {
		title: 'Women',
		tagline: 'Support women across a variety of areas',
		image: imageRequire('./lbc-women.jpg'),
		loanChannelId: 5,
		filterLink: '/lend/filter?gender=female&sortBy=popularity',
		subCategories: [
			{
				name: 'Entrepreneurs',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						sector: [7, 4],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Africa',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						// eslint-disable-next-line max-len
						country: ['bf', 'cm', 'cd', 'eg', 'gh', 'ke', 'ls', 'lr', 'mg', 'mw', 'ml', 'mz', 'na', 'ng', 'rw', 'sn', 'sl', 'za', 'ss', 'tz', 'tg', 'ug', 'zm', 'zw'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Asia',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						// eslint-disable-next-line max-len
						country: ['il', 'jo', 'ps', 'tr', 'bd', 'bt', 'kh', 'in', 'id', 'kg', 'la', 'mm', 'np', 'pk', 'ph', 'tj', 'th', 'vn'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Latin America',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						// eslint-disable-next-line max-len
						country: ['do', 'ht', 'mx', 'pr', 'bz', 'cr', 'sv', 'gt', 'hn', 'ni', 'pa', 'bo', 'br', 'cl', 'co', 'ec', 'py', 'pe'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'United States',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						country: ['us'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			}
		]
	},
	'kiva-u-s': {
		title: 'Kiva U.S.',
		tagline: 'Support people across the US',
		image: imageRequire('./lbc-kivaus.jpg'),
		loanChannelId: 28,
		filterLink: '/lend/filter?countries=North%20America%20>%20United%20States&sortBy=popularity',
		subCategories: [
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'direct',
						country: ['us', 'gu', 'vi', 'pr'],
						gender: 'female',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Entrepreneurs',
				variables: {
					filters: {
						distributionModel: 'direct',
						country: ['us', 'gu', 'vi', 'pr'],
						sector: [7, 4],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Black owned business',
				variables: {
					filters: {
						distributionModel: 'direct',
						loanTags: [43],
						country: ['us', 'gu', 'vi', 'pr'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Minority owned business',
				variables: {
					filters: {
						distributionModel: 'direct',
						loanTags: [45, 43],
						country: ['us', 'gu', 'vi', 'pr'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'direct',
						country: ['us', 'gu', 'vi', 'pr'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
		]
	},
	agriculture: {
		title: 'Agriculture',
		tagline: 'Support agriculture across a variety of areas',
		image: imageRequire('./lbc-agriculture.jpg'),
		loanChannelId: 8,
		filterLink: '/lend/filter?sector=Agriculture&sortBy=popularity',
		subCategories: [
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						gender: 'female',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Africa',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						// eslint-disable-next-line max-len
						country: ['bf', 'cm', 'cd', 'eg', 'gh', 'ke', 'ls', 'lr', 'mg', 'mw', 'ml', 'mz', 'na', 'ng', 'rw', 'sn', 'sl', 'za', 'ss', 'tz', 'tg', 'ug', 'zm', 'zw'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Asia',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						// eslint-disable-next-line max-len
						country: ['il', 'jo', 'ps', 'tr', 'bd', 'bt', 'kh', 'in', 'id', 'kg', 'la', 'mm', 'np', 'pk', 'ph', 'tj', 'th', 'vn'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Latin America',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						// eslint-disable-next-line max-len
						country: ['do', 'ht', 'mx', 'pr', 'bz', 'cr', 'sv', 'gt', 'hn', 'ni', 'pa', 'bo', 'br', 'cl', 'co', 'ec', 'py', 'pe'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
		]
	},
	'eco-friendly': {
		title: 'Eco-friendly',
		tagline: 'Support eco-friendly causes in multiple ways',
		image: imageRequire('./lbc-ecofriendly.jpg'),
		loanChannelId: 18,
		filterLink: '/lend/filter?tags=%23Eco-friendly~%23Sustainable%20Ag&sortBy=popularity',
		subCategories: [
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [9, 8],
						gender: 'female',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Agriculture',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [9, 8],
						sector: [1],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Clothing recycling',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [9, 8],
						sector: [5],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [9, 8],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			}
		]
	},
	'refugees-and-i-d-ps': {
		title: 'Refugees and IDPs',
		tagline: 'Support refugees and IDPs in multiple ways',
		image: imageRequire('./lbc-refugees.jpg'),
		loanChannelId: 32,
		filterLink: '/lend/filter?attributes=Refugees%2FDisplaced&sortBy=popularity',
		subCategories: [
			{
				name: 'Entrepreneurs',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [7, 4],
						theme: 'Refugees/Displaced',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Agriculture',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						theme: 'Refugees/Displaced',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						theme: 'Refugees/Displaced',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						theme: 'Refugees/Displaced',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			}
		]
	},
	shelter: {
		title: 'Shelter',
		tagline: 'Support housing across a variety of areas',
		image: imageRequire('./lbc-shelter.jpg'),
		loanChannelId: 6,
		filterLink: '/lend/filter?sector=Housing&sortBy=popularity',
		subCategories: [
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						sector: [10],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Africa',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [10],
						// eslint-disable-next-line max-len
						country: ['bf', 'cm', 'cd', 'eg', 'gh', 'ke', 'ls', 'lr', 'mg', 'mw', 'ml', 'mz', 'na', 'ng', 'rw', 'sn', 'sl', 'za', 'ss', 'tz', 'tg', 'ug', 'zm', 'zw'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Asia',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [10],
						// eslint-disable-next-line max-len
						country: ['il', 'jo', 'ps', 'tr', 'bd', 'bt', 'kh', 'in', 'id', 'kg', 'la', 'mm', 'np', 'pk', 'ph', 'tj', 'th', 'vn'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Latin America',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [10],
						// eslint-disable-next-line max-len
						country: ['do', 'ht', 'mx', 'pr', 'bz', 'cr', 'sv', 'gt', 'hn', 'ni', 'pa', 'bo', 'br', 'cl', 'co', 'ec', 'py', 'pe'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [10],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			}
		]
	},
	'single-parents': {
		title: 'Single parents',
		tagline: 'Support single parents in multiple ways',
		image: imageRequire('./lbc-parents.jpg'),
		loanChannelId: 26,
		filterLink: '/lend/filter?tags=%23Single%20Parent&sortBy=popularity',
		subCategories: [
			{
				name: 'Single moms',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						loanTags: [17],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Entrepreneurs',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [7, 4],
						loanTags: [17],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Conflict zones',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [17],
						theme: 'Conflict Zones',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Underfunded areas',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [17],
						theme: 'Underfunded Areas',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						loanTags: [17],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			}
		]
	},
	'conflict-zones': {
		title: 'Conflict zones',
		tagline: 'Support people in conflict zones across a variety of areas',
		image: imageRequire('./lbc-conflict.jpg'),
		loanChannelId: 7,
		filterLink: '/lend/filter?attributes=Conflict%20Zones&sortBy=popularity',
		subCategories: [
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						theme: 'Conflict Zones',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Africa',
				variables: {
					filters: {
						distributionModel: 'both',
						theme: 'Conflict Zones',
						// eslint-disable-next-line max-len
						country: ['bf', 'cm', 'cd', 'eg', 'gh', 'ke', 'ls', 'lr', 'mg', 'mw', 'ml', 'mz', 'na', 'ng', 'rw', 'sn', 'sl', 'za', 'ss', 'tz', 'tg', 'ug', 'zm', 'zw'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Asia',
				variables: {
					filters: {
						distributionModel: 'both',
						theme: 'Conflict Zones',
						// eslint-disable-next-line max-len
						country: ['il', 'jo', 'ps', 'tr', 'bd', 'bt', 'kh', 'in', 'id', 'kg', 'la', 'mm', 'np', 'pk', 'ph', 'tj', 'th', 'vn'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'Latin America',
				variables: {
					filters: {
						distributionModel: 'both',
						theme: 'Conflict Zones',
						// eslint-disable-next-line max-len
						country: ['do', 'ht', 'mx', 'pr', 'bz', 'cr', 'sv', 'gt', 'hn', 'ni', 'pa', 'bo', 'br', 'cl', 'co', 'ec', 'py', 'pe'],
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						theme: 'Conflict Zones',
						status: 'fundraising'
					},
					sortBy: 'popularity'
				}
			}
		]
	},
	'ending-soon': {
		title: 'Ending soon',
		tagline: 'Find time-sensitive loans across a variety of areas',
		image: imageRequire('./lbc-endingsoon.jpg'),
		loanChannelId: 3,
		filterLink: '/lend/filter?sortBy=expiringSoon',
		subCategories: [
			{
				name: 'Women',
				variables: {
					filters: {
						distributionModel: 'both',
						gender: 'female',
						expiringSoon: true,
						status: 'fundraising'
					},
					sortBy: 'expiringSoon'
				}
			},
			{
				name: 'Entrepreneurs',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [7],
						expiringSoon: true,
						status: 'fundraising'
					},
					sortBy: 'expiringSoon'
				}
			},
			{
				name: 'Agriculture',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [1],
						expiringSoon: true,
						status: 'fundraising'
					},
					sortBy: 'expiringSoon'
				}
			},
			{
				name: 'Housing',
				variables: {
					filters: {
						distributionModel: 'both',
						sector: [10],
						expiringSoon: true,
						status: 'fundraising'
					},
					sortBy: 'expiringSoon'
				}
			},
			{
				name: 'All',
				variables: {
					filters: {
						distributionModel: 'both',
						expiringSoon: true,
						status: 'fundraising'
					},
					sortBy: 'expiringSoon'
				}
			}
		]
	}
};
// this category should have the same values as 'women'
categoryProperties['loans-to-women'] = categoryProperties.women;

export default {
	name: 'LoanChannelCategoryExperiment',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			offset: 0,
			description: '',
			imageRequire,
			isVisitor: true,
			loanIdsInBasket: [],
			limit: loansPerPage,
			loading: false,
			loanChannel: () => {},
			selectedSubCategory: () => {},
			targetedLoanChannel: this.$route?.params?.category,
		};
	},
	components: {
		KvButton,
		KvLoadingSpinner,
		KvPagination,
		LoanCardController,
		PromoGridLoanCard,
	},
	apollo: {
		preFetch(config, client, args) {
			return client.query({
				query: pageQuery
			}).then(() => {
				// filter routes on route.param.category to get current path
				const targetedCategory = args?.route?.params?.category;
				const selectedSubCategory = categoryProperties[targetedCategory]?.subCategories[0];

				return Promise.all([
					client.query({
						query: itemsInBasketQuery,
					}),
					...(selectedSubCategory ? [client.query({
						query: basicLoanQuery,
						variables: {
							...selectedSubCategory.variables,
							...fromUrlParams(args?.route?.query),
							limit: loansPerPage,
						}
					})] : []),
				]);
			});
		}

	},
	watch: {
		loanIds(newVal, oldVal) {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				// check for and use snowplow directly where the 4th param is a property
				if (typeof window !== 'undefined' && typeof snowplow === 'function') {
					window.snowplow('setCustomUrl', window.location.href);
					window.snowplow(
						'trackStructEvent',
						'Lending',
						newVal.length ? 'loans-shown' : 'zero-loans-shown',
						newVal.length ? 'loan-ids' : undefined,
						newVal.length ? newVal.join() : undefined
					);
				}
			}
		}
	},
	mounted() {
		// Setup Reactivity for Loan Data + Basket Status
		this.activateLoanChannelWatchQuery();
	},
	created() {
		// page data
		let pageQueryData = {};
		try {
			pageQueryData = this.apollo.readQuery({
				query: pageQuery,
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryExpPage pageQueryData');
		}

		const loanChannelValues = pageQueryData?.lend?.loanChannels?.values ?? [];
		this.description = loanChannelValues.find(channel => {
			return channel.id === this.targetedCategory.loanChannelId;
		}).description;

		// basket data
		let basketData = {};
		try {
			basketData = this.apollo.readQuery({
				query: itemsInBasketQuery,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
				},
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryExpPage itemsInBasketQuery');
		}

		const loansInBasket = basketData?.shop?.basket?.items?.values ?? [];
		// array of loan ids in basket
		this.loanIdsInBasket = loansInBasket.map(loan => loan.id);

		this.apollo.watchQuery({
			query: itemsInBasketQuery,
			variables: {
				basketId: this.cookieStore.get('kvbskt'),
			},
		}).subscribe({
			next: ({ data }) => {
				this.loanIdsInBasket = (data?.shop?.basket?.items?.values ?? []).map(loan => loan.id);
			},
		});

		// loan data
		let loanQueryData = {};
		try {
			loanQueryData = this.apollo.readQuery({
				query: pageQuery,
				variables: this.loanQueryVars
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryExpPage loanQueryData');
		}
		this.loanChannel = loanQueryData?.lend?.loans;

		// set initial sub category
		this.selectedSubCategory = this.targetedCategory?.subCategories[0] ?? {};
	},
	computed: {
		targetedCategory() {
			return {
				// eslint-disable-next-line max-len
				description: this.description,
				...categoryProperties[this.targetedLoanChannel]
			};
		},
		cssVars() {
			return {
				'--hero-background': `url(${this.targetedCategory.image})`
			};
		},
		firstLoan() {
			return [this.loans[0]];
		},
		remainingLoans() {
			const [, ...rest] = this.loans;
			return rest;
		},
		lastLoanPage() {
			return Math.ceil(this.totalCount / this.limit);
		},
		totalCount() {
			return this.loanChannel?.totalCount ?? 0;
		},
		loans() {
			return this.loanChannel?.values ?? [];
		},
		loanIds() {
			return this.loans.map(loan => loan.id);
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
		},
		subCategories() {
			return this.targetedCategory?.subCategories;
		},
		urlParams() {
			return toUrlParams({
				offset: this.offset,
			});
		},
		loanQueryVars() {
			return {
				...this.selectedSubCategory.variables,
				...fromUrlParams(this.$route.query),
				limit: this.limit,
			};
		},
	},
	methods: {
		updateFromParams(query) {
			const { offset } = fromUrlParams(query);
			this.offset = offset;
		},
		pageChange({ pageOffset }) {
			this.offset = pageOffset;
			this.pushChangesToUrl();
		},
		pushChangesToUrl() {
			// if query is not equal to urlParams, push to router
			if (JSON.stringify(this.$route.query) !== JSON.stringify(this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
		activateLoanChannelWatchQuery() {
			const observer = this.apollo.watchQuery({
				query: basicLoanQuery,
				variables: this.loanQueryVars,
			});
			this.$watch(() => this.loanQueryVars, vars => {
				observer.setVariables(vars);
			}, { deep: true });
			// Subscribe to the observer to see each result
			observer.subscribe({
				next: ({ data, loading }) => {
					if (loading) {
						this.loading = true;
					} else {
						this.loading = false;
						this.loanChannel = data?.lend?.loans;
					}
				}
			});
		},
		handleFilterClick(category) {
			this.$kvTrackEvent(
				'Lending',
				'click-quick-tabs',
				category.name
			);
			this.selectedSubCategory = category;
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.updateFromParams(to.query);
		});
	},
	beforeRouteUpdate(to, from, next) {
		this.updateFromParams(to.query);
		next();
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
		@apply tw-bg-brand tw-rounded-b-lg;

		background-image: linear-gradient(90deg, #26985D 30%, rgba(0, 197, 197, 0) 75%), var(--hero-background);
		background-position: 0, top right;
		background-size: auto, 70%;
	}
}
@media screen and (min-width: 1921px) {
	.lbc-hero-wrapper {
		background-position: 0, center top;
		background-size: 1620px, 1620px;
	}
}
</style>
