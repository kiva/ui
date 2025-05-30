<template>
	<MyKivaNavigation
		:visible="showNavigation"
		:user-info="userInfo"
		:user-balance="userBalance"
		@navigation-closed="showNavigation = false"
	/>
	<MyKivaHero
		:user-info="userInfo"
		:user-in-homepage="userInHomepage"
		@show-navigation="handleShowNavigation"
	/>
	<MyKivaProfile
		:lender="lender"
		:user-info="userInfo"
		:user-in-homepage="userInHomepage"
	/>
	<MyKivaContainer>
		<section v-if="isHeroEnabled" class="tw-mt-2">
			<JourneyCardCarousel
				:slides="heroSlides"
				:lender="lender"
				:user-in-homepage="userInHomepage"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				@update-journey="updateJourney"
			/>
		</section>
		<section v-if="!allBadgesCompleted && !isHeroEnabled" class="tw-pt-2">
			<BadgeTile
				:user-info="userInfo"
				:badges-data="badgeData"
				@badge-clicked="handleBadgeTileClicked"
			/>
		</section>
		<section class="tw-py-2">
			<div
				:class="[
					'tw-flex',
					{ 'tw-flex-col': !showSingleArray },
					{ 'tw-flex-col lg:tw-flex-row lg:tw-gap-3': showSingleArray }
				]"
			>
				<MyKivaBorrowerCarousel
					:loans="loans"
					:total-loans="totalLoans"
				/>
				<JournalUpdatesCarousel
					:updates="loanUpdates"
					:lender="lender"
					:total-updates="totalUpdates"
					@load-more-updates="loadMoreUpdates"
				/>
			</div>
		</section>
	</MyKivaContainer>
	<section class="tw-my-2">
		<MyKivaStats :user-achievements="badgeAchievementData" />
		<MyKivaContainer>
			<div class="tw-flex tw-flex-col tw-w-full lg:tw-hidden tw-mt-2">
				<router-link
					v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
					to="/portfolio/lending-stats"
					class="tw-text-action tw-mx-auto tw-mb-2 hover:tw-text-action tw-font-medium"
				>
					See all lending stats
				</router-link>
				<button
					class="tw-w-full tw-rounded tw-min-h-6 tw-border tw-font-medium tw-text-center tw-text-white
							tw-bg-action hover:tw-bg-secondary tw-border-tertiary hover:tw-border-primary"
					v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
					@click="$router.push('/lend-by-category')"
					variant="secondary"
				>
					Make a loan
				</button>
			</div>
		</MyKivaContainer>
	</section>
	<template v-if="isAchievementDataLoaded">
		<MyKivaContainer>
			<section class="tw-pt-2 tw-pb-4">
				<h3
					class="tw-text-center tw-mb-2"
				>
					<span
						class="tw-bg-secondary tw-text-primary tw-px-1 tw-text-h4"
						style="line-height: 0; font-weight: 600;"
					>
						Your Achievements
					</span>
				</h3>
				<div class="tw-mt-3">
					<h3
						ref="triggerButton"
						class="tw-text-center tw-mb-2"
					>
						My impact journeys
					</h3>
					<BadgesSection
						:badge-data="badgeData"
						:selected-journey="selectedJourney"
						@badge-clicked="handleBadgeSectionClicked"
					/>
					<KvSideSheet
						:visible="showSideSheet"
						:show-back-button="false"
						:show-headline-border="false"
						:headline="computedHeadLine"
						:show-go-to-link="false"
						:kv-track-function="$kvTrackEvent"
						:animation-source-element="triggerButton"
						@side-sheet-closed="handleComponentClosed"
						:width-dimensions="{ default: '100%', lg: '480px', md: '460px', sm:'100%' }"
					>
						<template #default>
							<BadgeModalContentJourney
								:key="selectedBadgeData.id"
								:badge="selectedBadgeData"
								:loans="loans"
								@badge-level-clicked="handleBadgeJourneyLevelClicked"
							/>
							<div
								class="
									tw-w-full tw-bg-red tw-absolute
									tw-left-0 tw-bg-white tw-opacity-50
									tw-pointer-events-none tw-z-sticky
								"
								style="
									background: linear-gradient(to top, rgb(255 255 255), rgb(255 255 255 / 0%));
									bottom: 81px;
									height: 124px;
								"
							>
							</div>
						</template>
						<template #controls>
							<div
								class="tw-bg-white tw-border-t tw-w-full tw-border-tertiary"
							>
								<div class="tw-flex tw-justify-end tw-bg-white">
									<kv-button
										class="tw-mb-2 tw-pt-2 tw-px-4 tw-w-full md:tw-w-auto md:tw-max-w-xs"
										@click="handleContinueJourneyClicked"
									>
										Continue this journey
									</kv-button>
								</div>
							</div>
						</template>
					</KvSideSheet>
					<BadgeModal
						v-if="selectedBadgeData"
						:show="showBadgeModal"
						:badge="selectedBadgeData"
						:lender="lender"
						:state="state"
						:tier="tier"
						:is-earned-section="isEarnedSectionModal"
						:loans="loans"
						@badge-modal-closed="handleComponentClosed"
						@badge-level-clicked="handleBadgeJourneyLevelClicked"
					/>
				</div>
			</section>
		</MyKivaContainer>
	</template>
	<div
		v-if="showLoanFootnote && isAchievementDataLoaded"
		class="tw-bg-white tw-text-small tw-py-4 md:tw-py-2.5"
	>
		<MyKivaContainer>
			<section>
				*Borrowers of Kiva Lending Partners surveyed by 60 Decibels.
			</section>
		</MyKivaContainer>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import logReadQueryError from '#src/util/logReadQueryError';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import userUpdatesQuery from '#src/graphql/query/userUpdates.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import BadgeModalContentJourney from '#src/components/MyKiva/BadgeModalContentJourney';
import BadgesSection from '#src/components/MyKiva/BadgesSection';
import MyKivaStats from '#src/components/MyKiva/MyKivaStats';
import BadgeTile from '#src/components/MyKiva/BadgeTile';
import useBadgeData from '#src/composables/useBadgeData';
import { STATE_JOURNEY, STATE_EARNED } from '#src/composables/useBadgeModal';
import { hasLoanFunFactFootnote } from '#src/util/myKivaUtils';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import {
	ref,
	computed,
	inject,
	onMounted,
} from 'vue';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import { defaultBadges } from '#src/util/achievementUtils';
import { KvButton, KvSideSheet } from '@kiva/kv-components';

const { getBadgeWithVisibleTiers } = useBadgeData();

const router = useRouter();
const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeAchievementData,
	badgeData,
	getLoanFindingUrl,
} = useBadgeData(apollo);

const props = defineProps({
	isHeroEnabled: {
		type: Boolean,
		default: false,
	},
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	lender: {
		type: Object,
		default: null,
	},
	heroSlides: {
		type: Array,
		default: () => ([]),
	},
	heroContentfulData: {
		type: Array,
		default: () => ([]),
	},
	heroTieredAchievements: {
		type: Array,
		default: () => ([]),
	},
});

const isEarnedSectionModal = ref(false);
const loanUpdates = ref([]);
const selectedBadgeData = ref();
const selectedJourney = ref('');
const showBadgeModal = ref(false);
const showNavigation = ref(false);
const showSideSheet = ref(false);
const state = ref(STATE_JOURNEY);
const tier = ref(null);
const totalUpdates = ref(0);
const triggerButton = ref(null);
const updatesLimit = ref(3);
const updatesOffset = ref(0);

const isAchievementDataLoaded = computed(() => !!badgeAchievementData.value);
const userBalance = computed(() => props.userInfo.userAccount?.balance ?? '');

const allBadgesCompleted = computed(() => {
	const tieredBadges = badgeData.value?.filter(b => defaultBadges.includes(b?.id));
	return tieredBadges?.every(b => !b.achievementData?.tiers?.find(t => !t?.completedDate));
});

const computedHeadLine = computed(() => `${selectedBadgeData.value?.challengeName} impact journey`);

const handleShowNavigation = () => {
	showNavigation.value = true;
	$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
};

const handleBadgeTileClicked = selectedTier => {
	router.push(getLoanFindingUrl(selectedTier.badge.id, router.currentRoute.value));
};

const handleBadgeSectionClicked = badge => {
	if (!badge.hasStarted) {
		router.push(getLoanFindingUrl(badge.id, router.currentRoute.value));
	} else {
		state.value = STATE_JOURNEY;
		selectedBadgeData.value = badge;
		isEarnedSectionModal.value = false;
		showSideSheet.value = true;
	}
};

const handleContinueJourneyClicked = () => {
	const badgeWithVisibleTiers = getBadgeWithVisibleTiers(selectedBadgeData.value);
	const { id, challengeName } = badgeWithVisibleTiers;
	$kvTrackEvent(
		'portfolio',
		'click',
		`${challengeName} Continue Journey Clicked`,
		challengeName,
	);
	router.push(getLoanFindingUrl(id, router.currentRoute.value));
};

const handleBadgeJourneyLevelClicked = payload => {
	const { id, challengeName, tier: clickedTier } = payload;

	$kvTrackEvent(
		'portfolio',
		'click',
		state.value === STATE_EARNED ? 'Already earned badge modal' : 'Earn a badge - within badge journey map modal',
		challengeName,
		clickedTier.level,
	);

	router.push(getLoanFindingUrl(id, router.currentRoute.value));
};

const handleComponentClosed = () => {
	selectedJourney.value = '';
	const queryParams = { ...router.currentRoute?.value?.query };
	if (queryParams.journey) {
		delete queryParams.journey;
		router.push({ ...router.currentRoute.value, query: queryParams });
	}
	selectedBadgeData.value = undefined;
	showSideSheet.value = false;
	showBadgeModal.value = false;
};

const fetchUserUpdates = loadMore => {
	apollo.query({
		query: userUpdatesQuery,
		variables: {
			limit: updatesLimit.value,
			offset: updatesOffset.value
		}
	})
		.then(result => {
			totalUpdates.value = result.data?.my?.updates?.totalCount ?? 0;
			const updates = result.data?.my?.updates?.values ?? [];
			if (loadMore) {
				loanUpdates.value = loanUpdates.value.concat(updates);
			} else {
				loanUpdates.value = updates;
			}
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage updatesQuery');
		});
};

const loadMoreUpdates = () => {
	updatesOffset.value += updatesLimit.value;
	fetchUserUpdates(true);
};

const showSingleArray = computed(() => props.loans.length === 1 && loanUpdates.value.length === 1);

const showLoanFootnote = computed(() => props.loans.some(l => hasLoanFunFactFootnote(l)));

const updateJourney = journey => {
	selectedJourney.value = journey;
};

const userInHomepage = computed(() => {
	return router.currentRoute.value?.path === '/mykiva';
});

onMounted(() => {
	$kvTrackEvent('portfolio', 'view', 'New My Kiva');
	fireHotJarEvent('my_kiva_viewed');
	fetchUserUpdates();
	fetchAchievementData(apollo);
	fetchContentfulData(apollo);
});
</script>
