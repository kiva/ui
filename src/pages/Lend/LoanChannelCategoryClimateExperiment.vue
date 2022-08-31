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
					{{ loanChannelName }} <span v-if="isEcoChallengeExpShown">September Challenge</span>
				</h1>
				<p
					v-if="!isEcoChallengeExpShown"
					class="tw-text-subhead tw-w-full show-for-large tw-mb-4 lg:tw-w-3/4"
				>
					{{ loanChannelDescription }}
				</p>
				<p
					v-else
					class="tw-text-subhead tw-w-full show-for-large tw-mb-4 lg:tw-w-3/4"
				>
					<!-- eslint-disable-next-line max-len -->
					There are many ways to make a positive impact. Complete the Climate Challenge now by lending to 1 Solar Energy, 1 Sustainable Agriculture, and 1 Recycling loan.
				</p>
			</div>
		</kv-page-container>
		<kv-page-container v-if="secondaryChannels.length > 0">
			<div v-for="(channel, index) in secondaryChannels" :key="index" class="tw-mt-6">
				<kiva-classic-single-category-carousel
					:climate-challenge="isEcoChallengeExpShown"
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
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import lendFilterExpMixin from '@/plugins/lend-filter-page-exp-mixin';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import KivaClassicSingleCategoryCarousel from '@/components/LoanCollections/KivaClassicSingleCategoryCarousel';
import {
	preFetchChannel,
	getCachedChannel
} from '@/util/loanChannelUtils';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const ecoChallengeExpKey = 'eco_challenge';

const secondaryEcoLoanChannelUrls = [
	'solar-energy',
	'sustainable-agriculture',
	'recycle-and-re-use',
	'responsible-water-collection-and-storage',
	'other-eco-friendly-loans',
];

const secondaryEcoLoanChannels = loanChannelQueryMapMixin.data().loanChannelQueryMap
	.filter(channel => secondaryEcoLoanChannelUrls.includes(channel.url));

const secondaryEcoLoanChannelIds = secondaryEcoLoanChannels.map(channel => channel.id);

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
			loanChannel: {},
			loading: false,
			lendFilterExpVersion: '',
			secondaryEcoLoanChannelsResponse: [],
			loanDisplaySettings: {
				loanLimit: 9,
				showViewMoreCard: true,
				showCheckBackMessage: true
			},
			isEcoChallengeExpShown: false,
		};
	},
	computed: {
		challengeChannels() {
			return [
				116, // solar energy
				117, // sustainable agriculture
				118, // recycle and reuse
			];
		},
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
		secondaryChannels() {
			// if eco challenge experiment is shown, return only the challenge channels
			if (this.isEcoChallengeExpShown) {
				return this.secondaryEcoLoanChannelsResponse
					.filter(channel => this.challengeChannels.includes(channel.id));
			}
			return this.secondaryEcoLoanChannelsResponse;
		}
	},
	apollo: {
		preFetch(config, client, args) {
			const { route } = args;
			const { params } = route;

			// Filter routes on route.param.category to get current path
			const targetedLoanChannelURL = params.category;

			// Isolate targeted loan channel id
			const targetedLoanChannelID = loanChannelQueryMapMixin.data().loanChannelQueryMap
				.find(channel => channel.url === targetedLoanChannelURL)?.id;

			// Get page limit and offset
			const limit = 9;
			const offset = 0;
			return preFetchChannel(
				client,
				// Access map directly since SSR doesn't have mixins available
				loanChannelQueryMapMixin.data().loanChannelQueryMap,
				targetedLoanChannelURL,
				// Build loanQueryVars since SSR doesn't have same context
				{ ids: [...secondaryEcoLoanChannelIds, targetedLoanChannelID], limit, offset }
			);
		}
	},
	created() {
		this.targetedLoanChannelURL = this.$route?.params?.category;
		this.targetedLoanChannelID = this.loanChannelQueryMap
			.find(channel => channel.url === this.targetedLoanChannelURL)?.id;

		// Prevent pop-in by loading data from the Apollo cache manually here instead of just using the subscription
		const baseData = getCachedChannel(
			this.apollo,
			this.loanChannelQueryMap,
			this.targetedLoanChannelURL,
			{
				ids: [...secondaryEcoLoanChannelIds, this.targetedLoanChannelID],
				limit: 9,
				offset: 0,
				basketId: this.cookieStore.get('kvbskt'),
			}
		);
		this.loanChannel = baseData?.lend?.loanChannelsById.find(channel => channel.id === this.targetedLoanChannelID);

		this.secondaryEcoLoanChannelsResponse = baseData?.lend?.loanChannelsById
			.filter(channel => channel.id !== this.targetedLoanChannelID) ?? [];

		/*
		 * Experiment Initializations
		*/

		// Lend Filter Redirects
		this.initializeLendFilterRedirects();
	},
	mounted() {
		this.updateLendFilterExp();

		const ecoChallengeExpData = getExperimentSettingCached(this.apollo, ecoChallengeExpKey);
		if (ecoChallengeExpData?.enabled) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				ecoChallengeExpKey,
				'EXP-ACK-392-Sep2022'
			);
			if (version === 'b') {
				this.isEcoChallengeExpShown = true;
			}
		}

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
