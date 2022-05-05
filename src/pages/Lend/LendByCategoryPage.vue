<template>
	<www-page
		class="lend-by-category-page"
	>
		<lend-header :filter-url="leadHeaderFilterLink" :side-arrows-padding="true" />

		<featured-hero-loan-wrapper
			v-if="showFeaturedHeroLoan"
			ref="featured"
			:is-logged-in="isLoggedIn"
			:items-in-basket="itemsInBasket"
			:show-category-description="showCategoryDescription"
		/>

		<div v-if="showFavoriteCountryRow">
			<favorite-country-loans
				:items-in-basket="itemsInBasket"
				ref="favoriteCountries"
				:show-category-description="showCategoryDescription"
				:is-logged-in="isLoggedIn"
				:show-expandable-loan-cards="showExpandableLoanCards"
				@scrolling-row="handleScrollingRow"
			/>
		</div>

		<div class="tw-bg-primary">
			<div
				class="loan-category-row"
				:class="{'hover-row': showHoverLoanCards}"
				v-for="(category, index) in categories"
				:key="category.id"
			>
				<component
					:is="categoryRowType"
					:loan-channel="category"
					:items-in-basket="itemsInBasket"
					:row-number="index + 1"
					:set-id="categorySetId"
					:is-logged-in="isLoggedIn"
					:show-category-description="showCategoryDescription"
					:show-expandable-loan-cards="showExpandableLoanCards"
					ref="categoryRow"
					@scrolling-row="handleScrollingRow"
				/>
			</div>
		</div>

		<div class="row pre-footer">
			<div class="column small-12">
				<div v-if="!rowLazyLoadComplete" class="cat-row-loader">
					<kv-loading-overlay id="updating-overlay" />
					<h3 class="tw-text-center">
						Loading more rows...
					</h3>
				</div>

				<h2 class="category-name">
					<router-link
						:to="{ path: '/categories'}"
						class="view-all-link"
					>
						View all categories<span class="view-all-arrow">&rsaquo;</span>
					</router-link>
				</h2>
			</div>
		</div>

		<!-- <div class="row" v-if="isAdmin">
			<div class="columns small-12">
				<category-admin-controls />
			</div>
		</div> -->

		<add-to-basket-interstitial v-show="addToBasketExpActive" />

		<expandable-loan-card-expanded
			v-if="showExpandableLoanCards"
			ref="expandableLoanCardComponent"
			:is-visitor="!isLoggedIn"
			:items-in-basket="itemsInBasket"
			:right-arrow-position="rightArrowPosition"
			:left-arrow-position="leftArrowPosition"
		/>

		<m-g-lightbox />
	</www-page>
</template>

<script>
import _each from 'lodash/each';
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _uniqBy from 'lodash/uniqBy';
import _without from 'lodash/without';
import { addCustomChannelInfo } from '@/util/categoryUtils';
import logReadQueryError from '@/util/logReadQueryError';
import { readJSONSetting } from '@/util/settingsUtils';
import { indexIn } from '@/util/comparators';
import { isLoanFundraising } from '@/util/loanUtils';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import lendByCategoryQuery from '@/graphql/query/lendByCategory/lendByCategory.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import recommendedLoansQuery from '@/graphql/query/lendByCategory/recommendedLoans.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import mlOrderedLoanChannels from '@/graphql/query/lendByCategory/mlOrderedLoanChannels.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import CategoryRowHover from '@/components/LoansByCategory/CategoryRowHover';
import FeaturedHeroLoanWrapper from '@/components/LoansByCategory/FeaturedHeroLoanWrapper';
import MGLightbox from '@/components/LoansByCategory/MGLightbox';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import LendHeader from '@/pages/Lend/LendHeader';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';
import ExpandableLoanCardExpanded from '@/components/LoanCards/ExpandableLoanCard/ExpandableLoanCardExpanded';
import FavoriteCountryLoans from '@/components/LoansByCategory/FavoriteCountryLoans';

// Row Limiter
// > This controls how may rows are loaded on the server
const ssrRowLimiter = 2;

export default {
	components: {
		// CategoryAdminControls: () => import('./admin/CategoryAdminControls'),
		CategoryRow,
		FeaturedHeroLoanWrapper,
		WwwPage,
		KvLoadingOverlay,
		LendHeader,
		AddToBasketInterstitial,
		ExpandableLoanCardExpanded,
		FavoriteCountryLoans,
		MGLightbox,
	},
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	metaInfo() {
		return {
			title: 'See loans by category',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Choose a category, lend to borrowers, and make an impact. '
					+ 'Each Kiva loan helps people build a better future for themselves and their families.'
				}
			]
		};
	},
	data() {
		return {
			isAdmin: false,
			isLoggedIn: false,
			userId: null,
			firstName: 'you',
			categorySetting: [],
			categorySetId: '',
			itemsInBasket: [],
			showFeaturedHeroLoan: true,
			realCategories: [],
			clientCategories: [],
			rowLazyLoadComplete: false,
			showCategoryDescription: false,
			categoryDescriptionExperimentVersion: null,
			addToBasketExpActive: false,
			lendFilterExpVersion: '',
			showExpandableLoanCards: false,
			rightArrowPosition: undefined,
			leftArrowPosition: undefined,
			hasFavoriteCountry: false,
			favoriteCountryExpVersion: 'control',
			showHoverLoanCards: false,
			recommendedLoans: [],
			mlServiceBanditExpVersion: null,
		};
	},
	computed: {
		categoryIds() {
			return _map(this.categorySetting, 'id');
		},
		categories() {
			// merge realCategories & customCategories
			const categories = _uniqBy(this.realCategories.concat(this.customCategories, this.clientCategories), 'id');
			return categories
				// fiter our any empty categories and categories with 0 loans
				.filter(channel => _get(channel, 'loans.values.length') > 0)
				// and re-order to match the setting
				.sort(indexIn(this.categoryIds, 'id'));
		},
		customCategories() {
			if (this.recommendedLoans.length) {
				return this.recommendedLoans.map(channel => {
					const recChannel = {
						id: channel.id,
						name: channel.name,
						description: channel.description,
						loans: {
							__typename: 'LoanBasicCollection',
							values: channel.values,
						},
						url: '',
					};
					// return recomended loan channel with custom title and description added, if needed
					return addCustomChannelInfo(recChannel, { id: this.userId, firstName: this.firstName });
				});
			}
			// If there are no recommended loan channels fetched yet, return the
			// RecLoanChannel objects from the category setting instead
			return this.categorySetting.filter(setting => {
				// eslint-disable-next-line no-underscore-dangle
				return setting.__typename === 'RecLoanChannel';
			});
		},
		customCategoryIds() {
			return _map(this.customCategories, 'id');
		},
		realCategoryIds() {
			return _without(this.categoryIds, ...this.customCategoryIds);
		},
		leadHeaderFilterLink() {
			return this.lendFilterExpVersion === 'b' ? '/lend/filter' : '/lend';
		},
		showFavoriteCountryRow() {
			if (this.hasFavoriteCountry && this.isLoggedIn && this.favoriteCountryExpVersion === 'shown') {
				return true;
			}
			return false;
		},
		categoryRowType() {
			return this.showHoverLoanCards ? CategoryRowHover : CategoryRow;
		},
	},
	methods: {
		// Initial set of loans (represented in the 'values' field)
		filterFundedLoans(loans) {
			// remove loans that are funded
			return _filter(loans, loan => {
				return isLoanFundraising(loan);
			});
		},
		assemblePageViewData(categories) {
			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_4.json#';
			const loanIds = [];
			const pageViewTrackData = { schema, data: {} };
			const featuredCategoryIds = _get(this, '$refs.featured.featuredCategoryIds');

			pageViewTrackData.data.categorySetIdentifier = this.categorySetId || 'default';

			if (this.showFeaturedHeroLoan) {
				loanIds.push({
					r: 0, p: 1, c: featuredCategoryIds[0], l: _get(this, '$refs.featured.loan.id')
				});
			}

			// track cash 794 if shown
			if (this.showFavoriteCountryRow) {
				const favoriteCountryLoans = _get(this.$refs, 'favoriteCountries.favoriteCountryLoans');
				if (favoriteCountryLoans !== undefined && favoriteCountryLoans.length > 0) {
					_each(favoriteCountryLoans, (loan, loanIndex) => {
						loanIds.push({
							r: -1,
							p: loanIndex + 1,
							c: 99,
							l: loan.id
						});
					});
				}
			}
			_each(categories, (category, catIndex) => {
				_each(category.loans.values, (loan, loanIndex) => {
					loanIds.push({
						r: catIndex + 1,
						p: loanIndex + 1,
						c: category.id,
						l: loan.id
					});
				});
			});
			pageViewTrackData.data.loansDisplayed = loanIds;
			return pageViewTrackData;
		},
		setRows(data) {
			this.categorySetting = readJSONSetting(data, 'general.rows.value') || [];
			this.categorySetId = 'default';
		},
		fetchRemainingLoanChannels() {
			const ssrLoanIds = [];
			// pick loan ids from each
			_each(this.categories, category => {
				_each(category.loans.values, loan => {
					ssrLoanIds.push(loan.id);
				});
			});
			// Client Fetch the remaining category rows
			return this.apollo.query({
				query: loanChannelQuery,
				variables: {
					ids: this.realCategoryIds.slice(ssrRowLimiter),
					excludeIds: ssrLoanIds,
					imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
					imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
					// @todo variables for fetching data for custom channels
				},
			}).then(({ data }) => {
				// add our remaining loan channels
				this.clientCategories = _get(data, 'lend.loanChannelsById') || [];
			});
		},
		activateWatchers() {
			// Create an observer for changes to the categories (and their loans)
			this.apollo.watchQuery({
				query: loanChannelQuery,
				variables: {
					ids: this.realCategoryIds,
					imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
					imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
				},
			}).subscribe({
				next: ({ data }) => {
					this.realCategories = _get(data, 'lend.loanChannelsById') || this.realCategories;
				},
			});
			this.apollo.watchQuery({ query: lendByCategoryQuery }).subscribe({
				next: ({ data }) => {
					this.isAdmin = !!_get(data, 'my.isAdmin');
					this.isLoggedIn = !!_get(data, 'my');
					this.userId = _get(data, 'my.userAccount.id') || null;
					this.firstName = _get(data, 'my.userAccount.firstName') || 'you';
					this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
					// CASH-794 Favorite Country Row
					this.hasFavoriteCountry = !!_get(data, 'my.recommendations.topCountry');
				},
			});
		},
		handleScrollingRow() {
			if (this.showExpandableLoanCards && this.$refs.expandableLoanCardComponent) {
				this.$refs.expandableLoanCardComponent.collapseCardAndPauseHover(500);
			}
		},
		setRightArrowPosition() {
			if (this.$refs.categoryRow && this.$refs.categoryRow.length) {
				this.rightArrowPosition = this.$refs.categoryRow
					.find(row => row.hasRightArrow)
					.getRightArrowPosition();
			}
		},
		setLeftArrowPosition() {
			if (this.$refs.categoryRow && this.$refs.categoryRow.length) {
				this.leftArrowPosition = this.$refs.categoryRow
					.find(row => row.hasLeftArrow)
					.getLeftArrowPosition();
			}
		},
		handleResize() {
			if (this.$refs.expandableLoanCardComponent) {
				this.$refs.expandableLoanCardComponent.clearHoverLoan();
			}
			this.setRightArrowPosition();
			this.setLeftArrowPosition();
		},
		initializeFavoriteCountryRowExp() {
			// experiment: CASH-794 Favorite Country Row
			// get assignment
			const favoriteCountryRowEXP = this.apollo.readFragment({
				id: 'Experiment:favorite_country',
				fragment: experimentVersionFragment,
			}) || {};
			this.favoriteCountryExpVersion = favoriteCountryRowEXP.version;
			// Only track and activate if these conditions exist
			if (this.hasFavoriteCountry
				&& this.isLoggedIn
				&& this.favoriteCountryExpVersion
				&& this.favoriteCountryExpVersion !== 'unassigned'
			) {
				// Fire Event for Exp CASH-794
				this.$kvTrackEvent(
					'Lending',
					'EXP-CASH-794-June2019',
					this.favoriteCountryExpVersion === 'shown' ? 'b' : 'a'
				);
			}
		},
		initializeHoverLoanCard() {
			// CASH-521: Hover loan card experiment
			const hoverLoanCardExperiment = this.apollo.readFragment({
				id: 'Experiment:hover_loan_cards',
				fragment: experimentVersionFragment,
			}) || {};

			if (hoverLoanCardExperiment.version === 'variant-a') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-CASH-521-Jun2019',
					'a',
				);
			} else if (hoverLoanCardExperiment.version === 'variant-b') {
				this.showHoverLoanCards = true;
				// We shouldn't run both expandable and hover loan cards at the same time for now
				this.showExpandableLoanCards = false;
				this.$kvTrackEvent(
					'Lending',
					'EXP-CASH-521-Jun2019',
					'b',
				);
			}
		},
		initializeRecommendedLoanRows() {
			const recLoanChannels = this.categorySetting.filter(setting => {
				// eslint-disable-next-line no-underscore-dangle
				return setting.__typename === 'RecLoanChannel';
			});

			if (recLoanChannels.length) {
				// Load recommended loan data
				try {
					const variables = {
						basketId: this.cookieStore.get('kvbskt'),
						ids: recLoanChannels.map(channel => channel.id),
						imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
						imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
					};
					const data = this.apollo.readQuery({
						query: recommendedLoansQuery,
						variables,
					});

					const allRecLoanChannels = data.ml?.getOrderedChannelsByIds ?? [];

					const allRecLoans = allRecLoanChannels.map(channel => {
						const channelLoans = channel.loans?.values ?? [];
						if (channelLoans.length) {
							return {
								values: this.filterFundedLoans(channelLoans),
								id: channel.id,
								name: channel.name,
								description: channel.description,
							};
						}
						return [];
					});
					this.recommendedLoans = allRecLoans;
				} catch (e) {
					logReadQueryError(e, 'LendByCategory recommendedLoansQuery');
				}
			}
		},
		fetchRecommendedLoans(offset = 0) {
			const lengthCheck = this.recommendedLoans.map(channel => {
				const loanCount = channel.values?.length ?? 0;
				return loanCount > 6;
			});

			// If more than 6 loans are returned, do nothing
			// Otherwise proceed loading more loans for that category
			if (!lengthCheck.includes(false)) {
				return false;
			}

			const recLoanChannels = this.categorySetting.filter(setting => {
				// eslint-disable-next-line no-underscore-dangle
				return setting.__typename === 'RecLoanChannel';
			});

			if (recLoanChannels.length) {
				// Load recommended loan data
				const variables = {
					offset,
					basketId: this.cookieStore.get('kvbskt'),
					ids: recLoanChannels.map(channel => channel.id),
					imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
					imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
				};

				return this.apollo.query({
					query: recommendedLoansQuery,
					variables,
				}).then(({ data }) => {
					const allRecLoanChannels = data.ml?.getOrderedChannelsByIds ?? [];

					const allRecLoans = allRecLoanChannels.map(channel => {
						// filter and update recommended loans
						// const backfillLoanSet = _get(data, 'ml.getOrderedChannelsByIds[0].loans.values');

						const channelLoans = channel.loans?.values ?? [];
						const filteredBackfillLoans = this.filterFundedLoans(channelLoans);
						const existingChannel = this.recommendedLoans.filter(existingChannelObject => {
							return existingChannelObject.id === channel.id;
						});

						const existingLoanValues = existingChannel[0].values || [];
						if (channelLoans.length) {
							return {
								values: existingLoanValues.concat(filteredBackfillLoans),
								id: channel.id,
								name: channel.name,
								description: channel.description,
							};
						}
						return [];
					});
					this.recommendedLoans = allRecLoans;
				});
			}
			return Promise.resolve();
		},
		initializeRecommendedRowAlgoExp() {
			// experiment: VUE-937 for "recommend by others" row backing algorithm
			const experimentId = 'EXP-VUE-937-recommended-row-algo';

			// get experiment assignment
			const { version } = this.apollo.readFragment({
				id: `Experiment:${experimentId}`,
				fragment: experimentVersionFragment,
			}) || {};

			// track version if it is set
			if (version && version !== 'unassigned') {
				this.$kvTrackEvent('Lending', experimentId, version);
			}
		},
	},
	apollo: {
		preFetch(config, client) {
			let rowData;

			return client.query({
				query: lendByCategoryQuery
			}).then(({ data }) => {
				// Get the array of channel objects from settings
				rowData = readJSONSetting(data, 'general.rows.value') || [];
				return Promise.all([
					// experiment: VUE-937 for "recommend by others" row backing algorithm
					client.query({ query: experimentQuery, variables: { id: 'EXP-VUE-937-recommended-row-algo' } }),
					// experiment: category description
					client.query({ query: experimentQuery, variables: { id: 'category_description' } }),
					// experiment: add to basket interstitial
					client.query({ query: experimentQuery, variables: { id: 'add_to_basket_v2' } }),
					// experiment: // CASH-794 Favorite Country Row
					client.query({ query: experimentQuery, variables: { id: 'favorite_country' } }),
					// experiment: CASH-521 Hover Loan Card Experiment
					client.query({ query: experimentQuery, variables: { id: 'hover_loan_cards' } }),
				]);
			}).then(() => {
				// Get all channel ids for the row data
				const ids = _map(rowData, 'id');
				// Filter other channel types as custom categories
				const recChannels = _filter(rowData, { __typename: 'RecLoanChannel' });
				const recChannelIds = _map(recChannels, 'id');
				const hasRecRow = recChannels.length > 0;

				// Read hover loan card experiment version assignment
				const hoverLoanCardExperiment = client.readFragment({
					id: 'Experiment:hover_loan_cards',
					fragment: experimentVersionFragment,
				}) || {};
				const hoverCards = hoverLoanCardExperiment.version === 'variant-b';

				const imgDefaultSize = hoverCards ? 'w480h300' : 'w480h360';
				const imgRetinaSize = hoverCards ? 'w960h600' : 'w960h720';

				// Pre-fetch all the data for SSR targeted channels
				return Promise.all([
					client.query({
						query: loanChannelQuery,
						variables: {
							// exclude custom rows + limit for ssr
							ids: _take(_without(ids, ...recChannelIds), ssrRowLimiter),
							imgDefaultSize,
							imgRetinaSize,
						},
					}),
					hasRecRow ? client.query({
						query: recommendedLoansQuery,
						variables: {
							ids: recChannelIds,
							imgDefaultSize,
							imgRetinaSize,
						}
					}) : Promise.resolve(),
				]);
			});
		},
	},
	created() {
		// Initialize VUE-937: Recommended row backing algorithm experiment
		this.initializeRecommendedRowAlgoExp();

		// Read the page data from the cache
		let baseData = {};
		try {
			baseData = this.apollo.readQuery({
				query: lendByCategoryQuery,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
				},
			});
		} catch (e) {
			logReadQueryError(e, 'LendByCategory lendByCategoryQuery');
		}

		// Initialize CASH-521: Hover loan card experiment
		this.initializeHoverLoanCard();

		// Copy basic data from query into instance variables
		this.setRows(baseData);
		this.isAdmin = !!_get(baseData, 'my.isAdmin');
		this.isLoggedIn = !!_get(baseData, 'my');
		this.userId = _get(baseData, 'my.userAccount.id') || null;
		this.firstName = _get(baseData, 'my.userAccount.firstName') || 'you';

		// CASH-794 Favorite Country Row
		this.hasFavoriteCountry = !!_get(baseData, 'my.recommendations.topCountry');

		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');

		// Initialize Recommended Loan Rows
		this.initializeRecommendedLoanRows();

		// Read the SSR ready loan channels from the cache
		try {
			const categoryData = this.apollo.readQuery({
				query: loanChannelQuery,
				variables: {
					ids: _take(_without(this.categoryIds, ...this.customCategoryIds), ssrRowLimiter),
					basketId: this.cookieStore.get('kvbskt'),
					imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
					imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
				},
			});
			this.realCategories = _get(categoryData, 'lend.loanChannelsById') || [];
		} catch (e) {
			logReadQueryError(e, 'LendByCategory loanChannelQuery');
		}

		// Initialize CASH-794 Favorite Country Row
		this.initializeFavoriteCountryRowExp();

		// get assignment for add to basket interstitial
		const addToBasketPopupEXP = this.apollo.readFragment({
			id: 'Experiment:add_to_basket_v2',
			fragment: experimentVersionFragment,
		}) || {};
		this.addToBasketExpActive = addToBasketPopupEXP.version === 'shown';
		// Update @client state if interstitial exp is active
		if (this.addToBasketExpActive) {
			this.apollo.mutate({
				mutation: updateAddToBasketInterstitial,
				variables: {
					active: true,
				}
			});
		}
		// Fire Event for Exp CASH-612 Status
		if (addToBasketPopupEXP.version && addToBasketPopupEXP.version !== 'unassigned') {
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-612-Apr2019',
				this.addToBasketExpActive ? 'b' : 'a'
			);
		}

		const lendFilterEXP = this.apollo.readFragment({
			id: 'Experiment:lend_filter_v2',
			fragment: experimentVersionFragment,
		}) || {};
		this.lendFilterExpVersion = lendFilterEXP.version;

		// CASH-676: Expandable loan card experiment
		const expandableLoanCardExperiment = this.apollo.readFragment({
			id: 'Experiment:expandable_loan_cards',
			fragment: experimentVersionFragment,
		}) || {};

		if (expandableLoanCardExperiment.version === 'variant-a') {
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-676-Apr2019',
				'a',
			);
		} else if (expandableLoanCardExperiment.version === 'variant-b') {
			this.showExpandableLoanCards = true;
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-676-Apr2019',
				'b',
			);
		}
	},
	mounted() {
		Promise.all([
			this.fetchRemainingLoanChannels(),
			this.fetchRecommendedLoans(20)
		]).then(() => {
			this.rowLazyLoadComplete = true;

			this.activateWatchers();

			const pageViewTrackData = this.assemblePageViewData(this.categories);
			this.$kvTrackSelfDescribingEvent(pageViewTrackData);
		});

		// Only allow experiment when in show-for-large (>= 1024px) screen size
		if (window.innerWidth >= 680) {
			// CASH-658 : Experiment : Category description
			const categoryDescriptionExperiment = this.apollo.readFragment({
				id: 'Experiment:category_description',
				fragment: experimentVersionFragment,
			}) || {};

			this.categoryDescriptionExperimentVersion = categoryDescriptionExperiment.version;

			if (this.categoryDescriptionExperimentVersion === 'variant-a') {
				this.showCategoryDescription = false;
				this.$kvTrackEvent('Lending', 'EXP-CASH-658-Mar2019', 'a');
			} else if (this.categoryDescriptionExperimentVersion === 'variant-b') {
				this.showCategoryDescription = true;
				this.$kvTrackEvent('Lending', 'EXP-CASH-658-Mar2019', 'b');
			}
		}

		// CASH-676: Expandable Loan Card Experiment
		if (this.showExpandableLoanCards) {
			window.addEventListener('resize', this.handleResize);
			this.setRightArrowPosition();
			this.setLeftArrowPosition();
		}
	},
	beforeDestroy() {
		if (this.showExpandableLoanCards) {
			window.removeEventListener('resize', this.handleResize);
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.lend-by-category-page {
	.loan-category-row {
		margin: 0 0 rem-calc(20);

		@include breakpoint(medium) {
			margin: 0 0 rem-calc(40);
		}

		&.hover-row {
			margin: 0 0 1rem;
		}

		&:last-of-type {
			margin-bottom: 0;
		}

		@media (hover: none) {
			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}

	.pre-footer {
		margin-top: 2rem;
		margin-bottom: 2rem;

		.cat-row-loader {
			display: flex;
			justify-content: center;
			position: relative;
			z-index: 5;
			height: 9rem;
			margin: 0 0 3rem;

			// loading overlay overrides
			#updating-overlay {
				background: transparent;
				z-index: 6;
			}

			h3 {
				display: flex;
				align-items: flex-end;
			}
		}

		h2 {
			margin: 0 1.875rem;

			@include breakpoint(medium) {
				margin-left: 1.625rem;
			}
			@include breakpoint(xxlarge) {
				margin-left: 0.625rem;
			}

			@media (hover: none) {
				margin: 0;
			}
		}

		a.view-all-link {
			display: inline;
			position: relative;

			.view-all-arrow {
				position: absolute;
				top: -1rem;
				right: -1.4rem;
				padding: 0 0.3rem;
				font-weight: $global-weight-normal;
				font-size: 2.5rem;

				@include breakpoint(medium) {
					font-size: 3rem;
					right: -1.6rem;
				}
			}
		}
	}
}
</style>
