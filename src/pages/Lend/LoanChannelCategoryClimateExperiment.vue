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
					{{ loanChannelName }} <span v-if="isEcoChallengeExpShown">October Challenge</span>
				</h1>
				<p
					v-if="!isEcoChallengeExpShown"
					class="tw-text-subhead tw-w-full show-for-large tw-mb-4 lg:tw-w-3/4"
				>
					{{ loanChannelDescription }}
				</p>
				<div v-else>
					<transition appear name="kvfastfade" mode="out-in">
						<div class="tw-bg-brand-50 tw-rounded tw-px-4 tw-py-2" v-if="showHowItWorks">
							<div class="tw-w-full tw-flex tw-justify-between tw-items-center tw-mb-1">
								<h2>How this works</h2>
								<button
									class="tw-h-3"
									@click="showHowItWorks = false"
								>
									<kv-material-icon
										class="tw-w-3"
										:icon="mdiClose"
									/>
								</button>
							</div>

							<p class="tw-text-subhead">
								Welcome to the Eco-friendly October Challenge!
								Complete the challenge by lending to 1 Solar Energy,
								1 Sustainable Agriculture, and 1 Recycling loan.
							</p>
							<div class="tw-flex tw-justify-between tw-items-center tw-mt-1">
								<div class="tw-flex tw-items-center">
									<icon-calendar class="tw-h-6 tw-w-6 tw-mr-2" />
									<h4>for a limited time</h4>
								</div>
							</div>
						</div>
						<kv-text-link
							v-else
							@click="showHowItWorks = true"
						>
							How this challenge works
						</kv-text-link>
					</transition>
				</div>
			</div>
		</kv-page-container>
		<kv-page-container v-if="secondaryChannels.length > 0">
			<div v-for="(channel, index) in secondaryChannels" :key="index" class="tw-mt-6">
				<kiva-classic-single-category-carousel
					:id="`carousel-${channel.name}` | changeCase('paramCase')"
					:prefetched-selected-channel="channel"
					:climate-challenge="isEcoChallengeExpShown"
					:loan-display-settings="loanDisplaySettings"
					:lend-now-button="true"
					:query-context="ecoExpQueryContext"
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
import { FLSS_ORIGIN_CATEGORY } from '@/util/flssUtils';
import {
	preFetchChannel,
	getCachedChannel
} from '@/util/loanChannelUtils';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experimentUtils';
import {
	mdiClose
} from '@mdi/js';
import IconCalendar from '@/assets/icons/inline/eco-challenge/calendar.svg';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

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
		KvMaterialIcon,
		KvPageContainer,
		KvTextLink,
		ViewToggle,
		IconCalendar,
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
			showHowItWorks: true,
			mdiClose,
			ecoExpQueryContext: FLSS_ORIGIN_CATEGORY
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
				{
					ids: [...secondaryEcoLoanChannelIds, targetedLoanChannelID],
					limit,
					offset,
					origin: FLSS_ORIGIN_CATEGORY
				},
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
				origin: FLSS_ORIGIN_CATEGORY
			}
		);
		this.loanChannel = baseData?.lend?.loanChannelsById.find(channel => channel.id === this.targetedLoanChannelID);

		this.secondaryEcoLoanChannelsResponse = baseData?.lend?.loanChannelsById
			.filter(channel => channel.id !== this.targetedLoanChannelID) ?? [];

		// filter out any secondary channels that do not have loans
		this.secondaryEcoLoanChannelsResponse = this.secondaryEcoLoanChannelsResponse
			.filter(channel => channel.loans.totalCount > 0);

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
