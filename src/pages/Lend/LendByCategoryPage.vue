<template>
	<www-page
		class="lend-by-category-page"
	>
		<lend-header :filter-url="leadHeaderFilterLink" :side-arrows-padding="true" />

		<!-- MFI Recommendations Section -->
		<div v-if="mfiRecommendationsExp" class="tw-max-w-5xl tw-mx-auto lg:tw-px-6">
			<m-f-i-hero />

			<mfi-loans-wrapper
				v-if="selectedChannelLoanIds.length > 0"
				:selected-channel-loan-ids="selectedChannelLoanIds"
				:selected-channel="selectedChannel"
				class="tw-my-4"
			/>
		</div>

		<featured-hero-loan-wrapper
			v-if="showFeaturedHeroLoan"
			ref="featured"
			:is-logged-in="isLoggedIn"
			:items-in-basket="itemsInBasket"
			:show-category-description="showCategoryDescription"
			:use-category-service="categoryServiceExpActive"
			@loaded="trackFeaturedLoan"
		/>

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
					:show-expandable-loan-cards="false"
					ref="categoryRow"
					@add-to-basket="handleAddToBasket"
				/>
			</div>
		</div>

		<div class="row pre-footer" ref="bottom">
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

		<add-to-basket-interstitial />

		<m-g-lightbox />
		<m-g-digest-lightbox v-if="showMGDigestLightbox" />
	</www-page>
</template>

<script>
import _each from 'lodash/each';
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _uniqBy from 'lodash/uniqBy';
import _without from 'lodash/without';
import { addCustomChannelInfo } from '@/util/categoryUtils';
import logReadQueryError from '@/util/logReadQueryError';
import { readJSONSetting } from '@/util/settingsUtils';
import { indexIn } from '@/util/comparators';
import { isLoanFundraising } from '@/util/loanUtils';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import basketItems from '@/graphql/query/basketItems.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import lendByCategoryQuery from '@/graphql/query/lendByCategory/lendByCategory.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import categoryServiceRowsQuery from '@/graphql/query/lendByCategory/categoryServiceLoanChannels.graphql';
import recommendedLoansQuery from '@/graphql/query/lendByCategory/recommendedLoans.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import mlOrderedLoanChannels from '@/graphql/query/lendByCategory/mlOrderedLoanChannels.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import CategoryRowHover from '@/components/LoansByCategory/CategoryRowHover';
import FeaturedHeroLoanWrapper from '@/components/LoansByCategory/FeaturedHeroLoanWrapper';
import MGDigestLightbox from '@/components/LoansByCategory/MGDigestLightbox';
import MGLightbox from '@/components/LoansByCategory/MGLightbox';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';
import LendHeader from '@/pages/Lend/LendHeader';
import AddToBasketInterstitial from '@/components/Lightboxes/AddToBasketInterstitial';
import FavoriteCountryLoans from '@/components/LoansByCategory/FavoriteCountryLoans';
import { createIntersectionObserver } from '@/util/observerUtils';
import MFIHero from '@/components/LoansByCategory/MFIRecommendations/MFIHero';
import MfiLoansWrapper from '@/components/LoansByCategory/MFIRecommendations/MfiLoansWrapper';
import mfiRecommendationsLoans from '@/graphql/query/lendByCategory/mfiRecommendationsLoans.graphql';

export default {
	name: 'LendByCategoryPage',
	components: {
		// CategoryAdminControls: () => import('./admin/CategoryAdminControls'),
		CategoryRow,
		FeaturedHeroLoanWrapper,
		WwwPage,
		KvLoadingOverlay,
		LendHeader,
		AddToBasketInterstitial,
		FavoriteCountryLoans,
		MGDigestLightbox,
		MGLightbox,
		MFIHero,
		MfiLoansWrapper,
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
			lendFilterExpVersion: '',
			rightArrowPosition: undefined,
			leftArrowPosition: undefined,
			showHoverLoanCards: true,
			recommendedLoans: [],
			mlServiceBanditExpVersion: null,
			categoryServiceExpActive: false,
			viewportObserver: null,
			fetchCategoryIds: [],
			expResults: null,
			activatedWatchers: false,
			showMGDigestLightbox: false,
			rowTrackCounter: 0,
			mfiRecommendationsExp: false,
			mfiRecommendationsLoans: [],
			selectedChannel: {},
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
				.filter(channel => {
					// eslint-disable-next-line no-underscore-dangle
					return this.categoryServiceExpActive && channel?.__typename !== 'RecLoanChannel'
						? channel?.savedSearch?.loans?.values?.length > 0
						: _get(channel, 'loans.values.length') > 0;
				})
				// map category server category structure to standard loan channel structure
				.map(category => {
					// return standard category
					// eslint-disable-next-line no-underscore-dangle
					if (!this.categoryServiceExpActive || category?.__typename === 'RecLoanChannel') {
						return category;
					}
					// return mapped Category Service category
					return {
						id: category?.loanChannelId,
						name: category?.name ?? '',
						description: category?.description ?? '',
						url: category?.url ?? '',
						loans: category?.savedSearch?.loans ?? []
					};
				})
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
						__typename: 'RecLoanChannel',
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
		categoryRowType() {
			return this.showHoverLoanCards ? CategoryRowHover : CategoryRow;
		},
		selectedChannelLoanIds() {
			return this.mfiRecommendationsLoans?.map(element => element.id) ?? [];
		},
	},
	methods: {
		handleAddToBasket(payload) {
			if (payload.success) {
				this.apollo.query({
					query: basketItems,
					fetchPolicy: 'network-only',
				}).then(({ data }) => {
					// need to update this.itemsInBasket here.
					this.itemsInBasket = data?.shop?.basket?.items?.values.map(item => item.id);
				});
			}
		},
		// Initial set of loans (represented in the 'values' field)
		filterFundedLoans(loans) {
			// remove loans that are funded
			return _filter(loans, loan => {
				return isLoanFundraising(loan);
			});
		},
		refIsVisible() {
			const { top, bottom } = this.$refs?.bottom?.getBoundingClientRect() ?? {};
			const vHeight = (window.innerHeight || document.documentElement.clientHeight);
			return (
				(top > 0 || bottom > 0)
				&& top < vHeight
			);
		},
		trackLoansDisplayed(loansDisplayed) {
			const event = {
				// eslint-disable-next-line max-len
				schema: 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_5.json#',
				data: {
					categorySetIdentifier: this.categorySetId || 'default',
					loansDisplayed,
				},
			};
			this.$kvTrackSelfDescribingEvent(event);
		},
		trackFeaturedLoan() {
			if (this.showFeaturedHeroLoan) {
				this.trackLoansDisplayed([{
					r: 0,
					p: 1,
					c: this.$refs?.featured?.featuredCategoryIds?.[0],
					l: this.$refs?.featured?.loan?.id
				}]);
			}
		},
		trackLoanCategories(categories = []) {
			const loansDisplayed = [];
			// Add a tracking object for each loan in each category
			categories.forEach((category, catIndex) => {
				const loans = category?.loans?.values ?? category?.values ?? [];
				loans.forEach((loan, loanIndex) => {
					loansDisplayed.push({
						r: this.rowTrackCounter + catIndex + 1,
						p: loanIndex + 1,
						c: category.id,
						l: loan.id
					});
				});
			});
			if (loansDisplayed.length) {
				// Keep a count of the rows that have been shown already
				this.rowTrackCounter += categories.length;
				this.trackLoansDisplayed(loansDisplayed);
			}
		},
		setRows(data) {
			if (this.mlServiceBanditExpVersion !== null) {
				let baseData = {};
				try {
					baseData = this.apollo.readQuery({
						query: mlOrderedLoanChannels,
					});
				} catch (e) {
					logReadQueryError(e, 'LendByCategory mlOrderedLoanChannels');
				}

				// Get the array of channel objects from the ml multi-armed bandit
				this.categorySetting = _get(baseData, 'ml.orderedLoanChannels') || [];
				this.categorySetId = this.mlServiceBanditExpVersion;
			} else {
				// Get the array of channel objects from settings
				this.categorySetting = readJSONSetting(data, 'general.rows.value') || [];
				this.categorySetId = 'default';
			}
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
				query: this.categoryServiceExpActive ? categoryServiceRowsQuery : loanChannelQuery,
				variables: {
					ids: this.realCategoryIds,
					excludeIds: ssrLoanIds,
					imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
					imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
					// @todo variables for fetching data for custom channels
				},
			}).then(({ data }) => {
				// add our remaining loan channels
				this.clientCategories = this.categoryServiceExpActive
					? data?.loanCategoriesByLoanChannelIds
					: _get(data, 'lend.loanChannelsById') || [];
			});
		},
		activateWatchers() {
			// Create an observer for changes to the categories (and their loans)
			if (!this.activatedWatchers) {
				this.apollo.watchQuery({
					query: this.categoryServiceExpActive ? categoryServiceRowsQuery : loanChannelQuery,
					variables: {
						ids: this.realCategoryIds,
						imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
						imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
					},
				}).subscribe({
					next: ({ data }) => {
						this.rowLazyLoadComplete = false;
						const ssrLoanIds = [];
						_each(this.categories, category => {
							ssrLoanIds.push(category.id);
						});
						const loanChannels = this.categoryServiceExpActive
							? data?.loanCategoriesByLoanChannelIds
							: _get(data, 'lend.loanChannelsById');
						const filteredLoanChannels = loanChannels.filter(channel => {
							// TODO: fetchData method checks for loans in the channel before pushing to realCategories
							return this.categoryServiceExpActive
								? !ssrLoanIds.includes(channel.loanChannelId)
								: !ssrLoanIds.includes(channel.id);
						});

						this.realCategories = [...this.realCategories, ...filteredLoanChannels];
						this.rowLazyLoadComplete = true;
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
				this.activatedWatchers = true;
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
		initializeCategoryServiceRowExp() {
			const categoryServiceEXP = this.apollo.readFragment({
				id: 'Experiment:flss_category_service',
				fragment: experimentVersionFragment,
			}) || {};
			this.categoryServiceExpActive = categoryServiceEXP.version === 'b';

			if (categoryServiceEXP?.version && categoryServiceEXP?.version !== 'unassigned') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-VUE-1278-category-service-lbc',
					categoryServiceEXP?.version
				);
			}
		},
		initializeMLServiceBanditRowExp() {
			// experiment: GROW-330 by MultiArmed Bandit algorithm experiment
			// get assignment
			const mlServiceBandit = 0;
			const mlServiceBanditEXP = this.apollo.readFragment({
				id: 'Experiment:EXP-ML-Service-Bandit-LendByCategory',
				fragment: experimentVersionFragment,
			}) || {};
			this.mlServiceBanditExpVersion = mlServiceBanditEXP.version;

			if (this.mlServiceBanditExpVersion && this.mlServiceBanditExpVersion !== 'unassigned') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-ML-Service-Bandit-LendByCategory',
					this.mlServiceBanditExpVersion,
					this.mlServiceBanditExpVersion === 'b' ? mlServiceBandit : null,
					this.mlServiceBanditExpVersion === 'b' ? mlServiceBandit : null
				);
			}
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
		createViewportObserver() {
			// Watch for this element being in the viewport
			this.viewportObserver = createIntersectionObserver({
				targets: [this.$refs.bottom],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							// This element is in the viewport, so load the data.\
							this.fetchLoanData();
						}
					});
				}
			});
			if (!this.viewportObserver) {
				// Observer was not created, so call fetch loan data right away as a fallback.
				Promise.all([
					this.fetchRemainingLoanChannels(),
					this.fetchRecommendedLoans(20)
				]).then(() => {
					this.rowLazyLoadComplete = true;
					this.activateWatchers();
					this.trackLoanCategories(this.categories);
				});
			}
		},
		destroyViewportObserver() {
			if (this.viewportObserver) {
				this.viewportObserver.disconnect();
			}
		},
		fetchLoanData() {
			// extract loan ids currently shown on the page
			const excludeIds = this.categories?.map(category => {
				if (!category?.loans?.values) {
					return [0];
				}
				return category?.loans?.values?.map(loan => loan?.id);
			})?.reduce((allLoanIds, catLoanIds) => {
				catLoanIds?.forEach(id => {
					allLoanIds?.push(id);
				});
				return allLoanIds;
			}, [this.$refs?.featured?.loan?.id ?? 0]) ?? [0];

			const category = this.fetchCategoryIds.shift();
			if (category) {
				this.rowLazyLoadComplete = false;
				// eslint-disable-next-line no-underscore-dangle
				if (category.__typename === 'RecLoanChannel') {
					try {
						const variables = {
							ids: [category.id],
							imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
							imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
							excludeIds
						};
						return this.apollo.query({
							query: recommendedLoansQuery,
							variables,
						}).then(({ data }) => {
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
							this.recommendedLoans = [...this.recommendedLoans, ...allRecLoans];
							this.rowLazyLoadComplete = true;
							this.trackLoanCategories(allRecLoans);

							// Fetch another row if we are still at the bottom of the page
							if (this.refIsVisible()) {
								this.fetchLoanData();
							}
						});
					} catch (e) {
						logReadQueryError(e, 'LendByCategory recommendedLoansQuery');
						this.rowLazyLoadComplete = true;
					}
				} else {
					try {
						return this.apollo.query({
							query: this.categoryServiceExpActive ? categoryServiceRowsQuery : loanChannelQuery,
							variables: {
								ids: [category.id],
								imgDefaultSize: this.showHoverLoanCards ? 'w480h300' : 'w480h360',
								imgRetinaSize: this.showHoverLoanCards ? 'w960h600' : 'w960h720',
								excludeIds
							},
						}).then(({ data }) => {
							const fetchedCategory = this.categoryServiceExpActive
								? data?.loanCategoriesByLoanChannelIds?.[0]
								: data?.lend?.loanChannelsById?.[0];
							if (fetchedCategory?.loans?.values?.length
								|| fetchedCategory?.savedSearch?.loans?.values?.length) {
								this.realCategories = [...this.realCategories, fetchedCategory];
								this.rowLazyLoadComplete = true;
								this.trackLoanCategories([fetchedCategory]);

								// Fetch another row if we are still at the bottom of the page
								if (this.refIsVisible()) {
									this.fetchLoanData();
								}
							} else {
								this.fetchLoanData();
							}
						});
					} catch (e) {
						this.rowLazyLoadComplete = true;
						logReadQueryError(
							e,
							// eslint-disable-next-line max-len
							`LendByCategory ${this.categoryServiceExpActive ? 'categoryServiceRowsQuery' : 'loanChannelQuery'}`
						);
					}
				}
			} else {
				this.activateWatchers();
			}
		},
		initializeMFIRecommendationsExperiment() {
			const layoutEXP = this.apollo.readFragment({
				id: 'Experiment:mfi_recommendations',
				fragment: experimentVersionFragment,
			}) || {};

			if (layoutEXP.version) {
				if (layoutEXP.version === 'b') {
					this.mfiRecommendationsExp = true;
				}
				this.$kvTrackEvent(
					'Lending',
					'EXP-CORE-628-AUG-2022',
					layoutEXP.version
				);
			}
		},
		fetchMFILoans() {
			// Load mfi recommendations loans data
			return this.apollo.query({
				query: mfiRecommendationsLoans,
			}).then(({ data }) => {
				this.mfiRecommendationsLoans = data?.fundraisingLoans?.values ?? [];
				const numberLoans = this.mfiRecommendationsLoans.length;
				if (numberLoans > 0) {
					this.$kvTrackEvent(
						'Lending',
						'view-MFI-feature',
						'pro mujer',
						'',
						numberLoans
					);
				} else {
					this.$kvTrackEvent(
						'Lending',
						'no-featured-loan-available'
					);
				}
			});
		},
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: lendByCategoryQuery
			}).then(() => {
				// Get the array of channel objects from settings
				return Promise.all([
					// experiment: GROW-330 Machine Learning Category row
					client.query({ query: experimentQuery, variables: { id: 'EXP-ML-Service-Bandit-LendByCategory' } }),
					// experiment: CORE-698 MFI Recommendations
					client.query({ query: experimentQuery, variables: { id: 'mfi_recommendations' } }),
					// experiment: VUE- Category Service driven FLSS channels
					client.query({ query: experimentQuery, variables: { id: 'flss_category_service' } }),
				]);
			})
				.then(() => {
					return client.query({
						query: mlOrderedLoanChannels
					});
				});
		},
	},
	created() {
		// Initialize GROW-330: Machine Learning served rows
		this.initializeMLServiceBanditRowExp();

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

		// Copy basic data from query into instance variables
		this.setRows(baseData);
		this.isAdmin = !!_get(baseData, 'my.isAdmin');
		this.isLoggedIn = !!_get(baseData, 'my');
		this.userId = _get(baseData, 'my.userAccount.id') || null;
		this.firstName = _get(baseData, 'my.userAccount.firstName') || 'you';

		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');

		// Initialize VUE-1278: Category Service based FLSS rows
		this.initializeCategoryServiceRowExp();

		// Initialize CASH-794 Favorite Country Row
		// this.initializeFavoriteCountryRowExp();

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
		this.apollo.mutate({
			mutation: updateAddToBasketInterstitial,
			variables: {
				active: true,
			}
		});

		const lendFilterEXP = this.apollo.readFragment({
			id: 'Experiment:lend_filter_v2',
			fragment: experimentVersionFragment,
		}) || {};
		this.lendFilterExpVersion = lendFilterEXP.version;

		// Initialize CORE-698 MFI Recommendations Experiment
		this.initializeMFIRecommendationsExperiment();
	},
	mounted() {
		this.fetchCategoryIds = [...this.categorySetting];
		this.fetchLoanData();
		// Only allow experiment when in show-for-large (>= 1024px) screen size
		if (window.innerWidth >= 680) {
			this.showCategoryDescription = true;
		}

		// Setup observer for lazy load
		this.createViewportObserver();

		// handle tracking for email based visits
		if (this.$route?.query?.utm_campaign === 'liked_loan'
			|| this.$route?.query?.utm_campaign?.includes('liked_loan')
		) {
			this.showMGDigestLightbox = true;
			if (this.$route.query.utm_content === 'yes') {
				this.$kvTrackEvent('Monthly Digest', 'loan-feedback', 'like');
			} else if (this.$route.query.utm_content === 'no') {
				this.$kvTrackEvent('Monthly Digest', 'loan-feedback', 'dislike');
			}
		}

		// Fetching MFI Recommendations Loans
		if (this.mfiRecommendationsExp) {
			this.fetchMFILoans();
		}
	},
	beforeDestroy() {
		this.destroyViewportObserver();
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

.recommended-exp >>> .arrow {
	background: transparent !important;
}
</style>
