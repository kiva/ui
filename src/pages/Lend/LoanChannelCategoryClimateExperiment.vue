<template>
	<div
		class="tw-mb-4"
	>
		<kv-page-container>
			<div class="heading-region">
				<view-toggle browse-url="/lend-by-category" :filter-url="filterUrl" />
				<p class="tw-text-small">
					<router-link to="/lend-by-category">
						All Loans
					</router-link> >
					<span class="show-for-large">{{ loanChannelName }}</span>
				</p>
				<h1 class="tw-mb-2">
					{{ loanChannelName }}
				</h1>
				<p
					class="tw-w-full show-for-large tw-mb-4 lg:tw-w-2/3"
				>
					{{ loanChannelDescription }}
				</p>
			</div>
		</kv-page-container>
		<kv-page-container v-if="secondaryLoanChannelIds.length > 0">
			<div v-for="(channel, index) in secondaryLoanChannelIds" :key="index" class="tw-mt-4">
				<kiva-classic-single-category-carousel
					:loan-channel-id="channel.id"
					:loan-channel-name="channel.name"
					:loan-channel-description="channel.description"
					:loan-display-settings="loanDisplaySettings"
					:lend-now-button="true"
				/>
			</div>
		</kv-page-container>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import logReadQueryError from '@/util/logReadQueryError';
import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import lendFilterExpMixin from '@/plugins/lend-filter-page-exp-mixin';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import KivaClassicSingleCategoryCarousel from '@/components/LoanCollections/KivaClassicSingleCategoryCarousel';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

// TODO modernize and make a util function
function getTargetedChannel(targetedRoute, allChannels) {
	const loanChannels = allChannels?.lend?.loanChannels?.values;
	// map id from loan channels
	const targetedLoanChannel = _filter(
		loanChannels,
		loanChannel => {
			return loanChannel.url.split('/').pop() === targetedRoute;
		}
	);
	// return all the props for this loan channel
	return targetedLoanChannel[0] ?? null;
}

// This is the same as: loanChannelPage.graphql except description & name has been added
const ecoCategoryPageQuery = gql`
	query ecoCategoryPageQuery {
		lend {
			loanChannels(offset:0, limit:1000) {
				totalCount
				values {
					id
					url
					description
					name
				}
			}
		}
	}
`;

const secondaryEcoLoanChannels = [
	'solar-energy',
	'sustainable-agriculture',
	'recycle-and-re-use',
	'responsible-water-collection-and-storage',
	'other-eco-friendly-loans',
];

export default {
	name: 'LoanChannelCategoryClimateExperiment',
	components: {
		KivaClassicSingleCategoryCarousel,
		KvPageContainer,
		ViewToggle,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		lendFilterExpMixin,
		loanChannelQueryMapMixin,
	],
	data() {
		return {
			targetedLoanChannelURL: null,
			targetedLoanChannelID: null,
			loanChannel: () => {},
			loading: false,
			lendFilterExpVersion: '',
			secondaryLoanChannelIds: [],
			loanDisplaySettings: {
				loanLimit: 9,
				showViewMoreCard: true,
				showCheckBackMessage: true
			}
		};
	},
	computed: {
		loanChannelName() {
			return this.loanChannel?.name ?? '';
		},
		loanChannelDescription() {
			return this.loanChannel?.description ?? '';
		},
		loanQueryVars() {
			return {
				basketId: this.cookieStore.get('kvbskt'),
			};
		},
		filterUrl() {
			// process eligible filter url
			return this.getFilterUrl();
		},
	},
	apollo: {
		preFetch: true,
		query: ecoCategoryPageQuery
	},
	created() {
		let allChannelsData = {};

		try {
			allChannelsData = this.apollo.readQuery({
				query: ecoCategoryPageQuery,
				variables: { basketId: this.loanQueryVars.basketId }
			});
		} catch (e) {
			logReadQueryError(e, 'LoanChannelCategoryControl created ecoCategoryPageQuery');
		}

		// Filter routes on param.category to get current path
		this.targetedLoanChannelURL = this.$route?.params?.category;

		// Isolate targeted loan channel id
		this.targetedLoanChannelID = getTargetedChannel(this.targetedLoanChannelURL, allChannelsData)?.id;

		// Get secondary loan channel id's
		this.secondaryLoanChannelIds = secondaryEcoLoanChannels
			.map(secondaryLoanChannelURL => {
				return getTargetedChannel(secondaryLoanChannelURL, allChannelsData);
			});

		// Assign our initial loan channel based on the route
		this.loanChannel = allChannelsData?.lend?.loanChannels?.values
			.filter(channel => channel.id === this.targetedLoanChannelID)?.[0];

		/*
		 * Experiment Initializations
		*/

		// Lend Filter Redirects
		this.initializeLendFilterRedirects();
	},
	mounted() {
		this.updateLendFilterExp();
		// check for newly assigned bounceback
		const redirectFromUiCookie = this.cookieStore.get('redirectFromUi') || '';
		if (redirectFromUiCookie === 'true') {
			this.cookieStore.remove('redirectFromUi');
			this.$router.push(this.getFilterUrl());
		}
	},
	methods: {
		getFilterUrl() {
			// get match channel data
			const matchedUrls = _filter(
				this.loanChannelQueryMap,
				channel => {
					return channel.url === this.$route.params.category;
				}
			);
			// check for fallback url
			const fallback = _get(matchedUrls, '[0]fallbackUrl');
			if (typeof fallback !== 'undefined') {
				return fallback;
			}
			// use query params if available
			const queryParams = _get(matchedUrls, '[0]queryParams') || '';
			if (queryParams !== '') {
				return `/lend?${queryParams}`;
			}
			// use default
			return '/lend/filter';
		},
		initializeLendFilterRedirects() {
			const lendFilterEXP = this.apollo.readFragment({
				id: 'Experiment:lend_filter_v2',
				fragment: experimentVersionFragment,
			}) || {};
			this.lendFilterExpVersion = lendFilterEXP.version;

			// Update Lend Filter Exp CASH-545
			this.getLendFilterExpVersion();
		},
	},
	beforeRouteLeave(to, from, next) {
		if (typeof window !== 'undefined'
			&& to.path.indexOf('/lend/') !== -1
			&& to.path.indexOf('/lend/filter') === -1) {
			// set cookie to signify redirect
			this.cookieStore.set('redirectFromUi', true);
		}
		next();
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.heading-region {
	margin: 1.25rem 0;

	.view-toggle {
		margin: 0.125rem 0 0 0.375rem;
		float: right;
		display: flex;

		@include breakpoint(large) {
			margin: 0.375rem 0 0.375rem 0.375rem;
		}
	}
}
</style>
