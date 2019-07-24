<template>
	<www-page :gray-background="true">
		<lend-header
			:side-arrows-padding="false"
			browse-url="/lend-by-category"
			filter-url="/lend/filter"
		/>

		<div class="algolia-wrap">
			<ais-instant-search
				v-if="searchClient"
				:search-client="searchClient"
				:index-name="algoliaDefaultIndex"
				:routing="routing"
			>
				<!-- eslint-disable vue/attribute-hyphenation -->
				<ais-configure
					:hitsPerPage="12"
					clickAnalytics="true"
					ref="aisConfigure"
				/>
				<div class="search-filter-and-results">
					<div class="small-12">
						<div class="search-statement-wrapper">
							<h2>
								I want to support
								<!-- documentation for reference: -->
								<!-- eslint-disable max-len -->
								<!-- https://www.algolia.com/doc/api-reference/widgets/menu-select/vue/?language=vue#customize-the-ui -->
								<br class="show-for-small-only">
								<ais-menu-select
									:attribute="'gender'"
									class="sentence-search-dropdown"
									:transform-items="transformGenders"
									aria-haspopup="true"
									aria-expanded="false"
								>
									<template
										slot="defaultOption"
										class="featured-text"
									>
										women and men
									</template>
									<template
										slot="item"
										slot-scope="{ item }"
										class="featured-text"
									>
										{{ item.label }}
									</template>
								</ais-menu-select>
								<br class="show-for-small-only">
								<span class="show-for-small-only">located</span>
								<span class="no-break"> in
									<br class="show-for-small-only">
									<ais-menu-select
										:attribute="'locationFacets.lvl0'"
										:limit="100"
										class="sentence-search-dropdown"
										aria-haspopup="true"
										aria-expanded="false"
									>
										<template
											slot="defaultOption"
											class="featured-text"
										>
											any region
										</template>
										<template
											slot="item"
											slot-scope="{ item }"
											class="featured-text"
										>
											{{ item.label }}
										</template>
									</ais-menu-select>
								</span>
								<br>
								with loans {{ toFor }}
								<ais-menu-select
									attribute="sector.name"
									:limit="100"
									class="sentence-search-dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									<select
										slot-scope="{ items, canRefine, refine }"
										:disabled="!canRefine"
										@change="toForLanguage(refine, $event.currentTarget.value)"
										class="featured-text"
									>
										<option
											value=""
										>
											improve their businesses
										</option>
										<option
											v-for="item in items"
											:key="item.value"
											:value="item.value"
											:selected="item.isRefined"
										>
											{{ item.label }}
										</option>
									</select>
								</ais-menu-select>
							</h2>
						</div>

						<ais-state-results>
							<template slot-scope="{ page, hitsPerPage, queryID, index }">
								<ais-hits
									class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3"
									:results-per-page="15"
								>
									<template slot="default" slot-scope="{ items }">
										<algolia-adapter
											v-for="(item, itemIndex) in items" :key="item.id"
											:loan="item"
											:items-in-basket="itemsInBasket"
											:is-logged-in="isLoggedIn"
											:algolia-props="{
												page, hitsPerPage, queryID, index, itemIndex, item
											}"
											loan-card-type="GridLoanCard"
											class="column-block columns"
										/>
									</template>
								</ais-hits>
							</template>
						</ais-state-results>
					</div>
				</div>

				<div class="row search-pagination-stats align-center">
					<ais-pagination :padding="2" class="columns small-12" />
					<ais-stats class="columns small-12 text-center" />
					<ais-hits-per-page class="columns small-12" :items="[
						{ label: '15', value: 15, default: true },
						{ label: '25', value: 25 },
						{ label: '50', value: 50 },
					]"
					/>
				</div>

				<ais-state-results>
					<template slot-scope="stateData">
						<algolia-track-state :state-data-hits="stateData.hits" />
					</template>
				</ais-state-results>
			</ais-instant-search>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import cookieStore from '@/util/cookieStore';
import logReadQueryError from '@/util/logReadQueryError';
import WwwPage from '@/components/WwwFrame/WwwPage';
import LendHeader from '@/pages/Lend/LendHeader';
// This mixin provides some algolia search instance initialization on mounted
import algoliaInit from '@/plugins/algolia-init-mixin';
import AlgoliaAdapter from '@/components/LoanCards/AlgoliaLoanCardAdapter';
import AlgoliaTrackState from '@/pages/Lend/Filter/FilterComponents/AlgoliaTrackState';
import itemsInBasketQuery from '@/graphql/query/basketItems.graphql';
import userStatus from '@/graphql/query/userId.graphql';
import {
	AisConfigure,
	AisInstantSearch,
	AisHits,
	AisPagination,
	AisHitsPerPage,
	AisStats,
	AisStateResults,
	AisMenuSelect,
} from 'vue-instantsearch';

export default {
	components: {
		WwwPage,
		AisConfigure,
		AisInstantSearch,
		AisHits,
		AisPagination,
		AisHitsPerPage,
		AisStats,
		AisStateResults,
		AisMenuSelect,
		AlgoliaAdapter,
		AlgoliaTrackState,
		LendHeader
	},
	data() {
		return {
			toFor: 'to'
		};
	},
	inject: [
		'apollo',
	],
	mixins: [
		algoliaInit
	],
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: itemsInBasketQuery
			}).then(() => {
				// Pre-fetch user Status
				return client.query({ query: userStatus });
			});
		}
	},
	created() {
		let basketData = {};
		try {
			basketData = this.apollo.readQuery({
				query: itemsInBasketQuery,
				variables: {
					basketId: cookieStore.get('kvbskt'),
				},
			});
		} catch (e) {
			logReadQueryError(e);
		}
		this.itemsInBasket = _map(_get(basketData, 'shop.basket.items.values'), 'id');

		this.apollo.watchQuery({
			query: itemsInBasketQuery,
			variables: {
				basketId: cookieStore.get('kvbskt'),
			},
		}).subscribe({
			next: ({ data }) => {
				this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
			},
		});

		let userData;
		try {
			userData = this.apollo.readQuery({
				query: userStatus,
				variables: {
					basketId: cookieStore.get('kvbskt'),
				},
			});
		} catch (e) {
			logReadQueryError(e);
		}
		this.isLoggedIn = _get(userData, 'my.userAccount.id') !== undefined;
	},
	mounted() {
		const sentenceSearchRedirectExp = _get(this.$route, 'query.registration');
		if (sentenceSearchRedirectExp === 'new') {
			this.$kvTrackEvent('Lending', 'EXP-CASH-1026-Jun2019', 'b');
		}
	},
	methods: {
		toForLanguage(refine, $event) {
			if ($event !== '') {
				this.toFor = 'for';
			} else {
				this.toFor = 'to';
			}
			refine($event);
		},
		transformGenders(items) {
			return items.map(item => {
				const newItem = item;
				if (item.label === 'female') {
					newItem.label = 'women';
				}
				if (item.label === 'male') {
					newItem.label = 'men';
				}
				return newItem;
			});
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.lend-header-row .heading-region {
	margin-bottom: rem-calc(18);
}

.search-filter-and-results {
	flex-direction: column-reverse;

	@include breakpoint(medium) {
		text-align: center;
	}

	@include breakpoint(large) {
		.search-filter-and-results {
			flex-direction: initial;
		}
	}
}

.loan-card-group {
	position: relative;
}

.algolia-loan-card-adapter {
	padding-left: 0;
	padding-right: 0;
}

.search-statement-wrapper {
	background-color: $white;
	margin-bottom: rem-calc(44);
	padding: 1.8125rem 2.5rem 0.8rem 2.5rem;
	border-top: 1px solid $kiva-bg-darkgray;
	border-bottom: 1px solid $kiva-bg-darkgray;

	@include breakpoint(medium) {
		padding-bottom: 1rem;
	}
}

.search-statement-wrapper h2 {
	@include breakpoint(medium) {
		line-height: 1.7;
	}
}

.sentence-search-dropdown {
	background-image: url('~@/assets/images/medium-chevron2x.png');
	background-repeat: no-repeat;
	background-position: right rem-calc(20);
	background-size: rem-calc(12);
	margin-right: rem-calc(8);
	margin-bottom: rem-calc(10);
	height: rem-calc(36);

	@include breakpoint(medium) {
		margin-bottom: unset;
		height: rem-calc(42);
		background-position: right rem-calc(23);
	}
}

.no-break {
	white-space: nowrap;
}

.ais-MenuSelect {
	display: inline-block;
	border-bottom: 1px dashed #118aec;
	margin-bottom: rem-calc(24);

	@include breakpoint(large) {
		margin-bottom: rem-calc(16);
	}
}

.ais-MenuSelect select {
	border: none;
	background-color: transparent;
	color: $kiva-accent-blue;
	font-size: 1.375rem;
	line-height: 2.25rem;
	height: rem-calc(43);
	margin-bottom: 0;
	background-image: none;
	padding-top: 0;
	padding-bottom: 0;
	padding-left: 0;

	@include breakpoint(medium) {
		text-align-last: center;
		font-size: 1.75rem;
		padding-left: unset;
		height: rem-calc(47);
		padding-top: unset;
	}
}

.ais-MenuSelect select:focus {
	-webkit-box-shadow: none;
	box-shadow: none;
}

.ais-Pagination-list {
	list-style: none;
	text-align: center;
	display: flex;
	margin: 0.75rem auto;
	justify-content: center;
	align-items: center;
	max-width: 25rem;

	.ais-Pagination-item {
		color: $kiva-text-light;
	}

	.ais-Pagination-item--active,
	.ais-Pagination-item--disabled {
		a {
			color: $kiva-text-light;
		}
	}

	.ais-Pagination-link {
		padding: 0.5rem 0.8rem;
		border-radius: 0.3rem;
		background-color: rgba(0, 0, 0, 0.03);
		margin: 0 0.2rem;

		&:hover {
			background-color: rgba(110, 176, 252, 0.05);
		}
	}

	.ais-Pagination-item--first,
	.ais-Pagination-item--previous,
	.ais-Pagination-item--next,
	.ais-Pagination-item--last {
		font-weight: bold;

		a:hover,
		a:visited {
			text-decoration: none;
		}
	}
}

.ais-HitsPerPage {
	max-width: 13rem;
}

</style>
