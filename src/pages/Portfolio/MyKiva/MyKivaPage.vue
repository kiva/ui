<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden tw-relative" class="tw-relative">
		<MyKivaNavigation
			:visible="showNavigation"
			:user-info="userInfo"
			:user-balance="userBalance"
			@navigation-closed="showNavigation = false"
		/>
		<MyKivaHero
			:user-info="userInfo"
			:is-loading="isLoading"
			@show-navigation="handleShowNavigation"
		/>
		<MyKivaProfile
			:lender="lender"
			:user-info="userInfo"
			:is-loading="isLoading"
		/>
		<MyKivaContainer>
			<section v-if="!allBadgesCompleted" class="tw-pt-2">
				<BadgeTile
					:user-info="userInfo"
					:badges-data="badgeData"
					@badge-clicked="handleBadgeTileClicked"
				/>
			</section>
			<section class="tw-py-2">
				<div
					class="tw-w-full tw-text-center tw-border-t tw-border-eco-green-3 tw-my-3"
					style="line-height: 0;"
				>
					<span
						class="tw-bg-secondary tw-text-primary tw-px-1 tw-text-h4"
						style="line-height: 0; font-weight: 600;"
					>
						MY IMPACT
					</span>
				</div>
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
						:is-loading="isLoading"
						@selected-loan="handleSelectedLoan"
					/>
					<JournalUpdatesCarousel
						:loan="activeLoan"
						:updates="loanUpdates"
						:lender="lender"
						:total-updates="totalUpdates"
						@load-more-updates="loadMoreUpdates"
					/>
				</div>
			</section>
		</MyKivaContainer>
		<template v-if="isAchievementDataLoaded">
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
			<MyKivaContainer>
				<section class="tw-py-2">
					<div
						class="tw-w-full tw-text-center tw-border-t tw-border-eco-green-3 tw-my-3"
						style="line-height: 0;"
					>
						<span
							class="tw-bg-secondary tw-text-primary tw-px-1 tw-text-h4"
							style="line-height: 0; font-weight: 600;"
						>
							BADGES AND ACHIEVEMENTS
						</span>
					</div>
					<div :id="MY_IMPACT_JOURNEYS_ID" class="tw-mt-3">
						<h3
							class="tw-text-center tw-mb-2"
						>
							My impact journeys
						</h3>
						<BadgesSection
							:badge-data="badgeData"
							@badge-clicked="handleBadgeSectionClicked"
						/>

						<BadgeModal
							v-if="selectedBadgeData"
							:show="showBadgeModal"
							:badge="selectedBadgeData"
							:lender="lender"
							:state="state"
							:tier="tier"
							:is-earned-section="isEarnedSectionModal"
							@badge-modal-closed="handleBadgeModalClosed"
							@badge-level-clicked="handleBadgeJourneyLevelClicked"
							@back-to-journey="handleBackToJourney"
						/>
					</div>
				</section>
			</MyKivaContainer>
			<EarnedBadgesSection
				:id="MY_ACHIEVEMENTS_ID"
				:badges-data="badgeData"
				@badge-clicked="handleEarnedBadgeClicked"
			/>
		</template>
		<div v-if="showLoanFootnote" class="tw-bg-white tw-text-small tw-py-4 md:tw-py-2.5">
			<MyKivaContainer>
				<section>
					*Borrowers of Kiva Lending Partners surveyed by 60 Decibels.
				</section>
			</MyKivaContainer>
		</div>
	</www-page>
</template>

<script setup>
import logReadQueryError from '#src/util/logReadQueryError';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import updatesQuery from '#src/graphql/query/loanUpdates.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import BadgesSection from '#src/components/MyKiva/BadgesSection';
import MyKivaStats from '#src/components/MyKiva/MyKivaStats';
import BadgeTile from '#src/components/MyKiva/BadgeTile';
import useBadgeData, { MY_IMPACT_JOURNEYS_ID, MY_ACHIEVEMENTS_ID } from '#src/composables/useBadgeData';
import EarnedBadgesSection from '#src/components/MyKiva/EarnedBadgesSection';
import { STATE_JOURNEY, STATE_EARNED, STATE_IN_PROGRESS } from '#src/composables/useBadgeModal';
import useUserPreferences from '#src/composables/useUserPreferences';
import { hasLoanFunFactFootnote, isFirstLogin } from '#src/util/myKivaUtils';
import {
	ref,
	computed,
	inject,
	onMounted,
	watch,
	nextTick,
} from 'vue';
import { defaultBadges } from '#src/util/achievementUtils';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const kvAuth0 = inject('kvAuth0');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeAchievementData,
	badgeData,
} = useBadgeData(apollo);

const { saveUserPreferences } = useUserPreferences(apollo);

const lender = ref(null);
const showNavigation = ref(false);
const userInfo = ref({});
const loans = ref([]);
const activeLoan = ref({});
const loanUpdates = ref([]);
const totalUpdates = ref(0);
const showBadgeModal = ref(false);
const selectedBadgeData = ref();
const state = ref(STATE_JOURNEY);
const tier = ref(null);
const isEarnedSectionModal = ref(false);
const showLoanFootnote = ref(false);
const totalLoans = ref(0);
const updatesLimit = ref(3);
const updatesOffset = ref(0);

const isLoading = computed(() => !lender.value);
const isAchievementDataLoaded = computed(() => !!badgeAchievementData.value);
const userBalance = computed(() => userInfo.value?.userAccount?.balance ?? '');

const allBadgesCompleted = computed(() => {
	const tieredBadges = badgeData.value?.filter(b => defaultBadges.includes(b?.id));
	return tieredBadges.every(b => !b.achievementData?.tiers?.find(t => !t?.completedDate));
});

const handleShowNavigation = () => {
	showNavigation.value = true;
	$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
};

const handleBadgeTileClicked = selectedTier => {
	state.value = STATE_IN_PROGRESS;
	selectedBadgeData.value = selectedTier.badge;
	tier.value = selectedTier.tier;
	isEarnedSectionModal.value = false;
	showBadgeModal.value = true;
};

const handleBadgeSectionClicked = badge => {
	state.value = STATE_JOURNEY;
	selectedBadgeData.value = badge;
	isEarnedSectionModal.value = false;
	showBadgeModal.value = true;
};

const handleEarnedBadgeClicked = badge => {
	const selectedTier = badge.achievementData?.tiers?.find(tierEl => tierEl.level === badge.level) ?? null;
	state.value = STATE_EARNED;
	tier.value = selectedTier;
	selectedBadgeData.value = badge;
	isEarnedSectionModal.value = true;
	showBadgeModal.value = true;
};

const handleBadgeJourneyLevelClicked = payload => {
	const { challengeName, tier: clickedTier } = payload;

	tier.value = clickedTier;
	state.value = clickedTier?.completedDate ? STATE_EARNED : STATE_IN_PROGRESS;

	$kvTrackEvent(
		'portfolio',
		'click',
		state.value === STATE_EARNED ? 'Already earned badge modal' : 'Earn a badge - within badge journey map modal',
		challengeName,
		clickedTier.level,
	);
};

const handleBadgeModalClosed = () => {
	selectedBadgeData.value = undefined;
	showBadgeModal.value = false;
};

const handleBackToJourney = () => {
	state.value = STATE_JOURNEY;
};

const fetchLoanUpdates = loanId => {
	apollo.query({
		query: updatesQuery,
		variables: {
			loanId,
			limit: updatesLimit.value,
			offset: updatesOffset.value
		}
	})
		.then(result => {
			totalUpdates.value = result.data?.lend?.loan?.updates?.totalCount ?? 0;
			const updates = result.data?.lend?.loan?.updates?.values ?? [];
			loanUpdates.value = loanUpdates.value.concat(updates);
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage updatesQuery');
		});
};

const loadMoreUpdates = () => {
	updatesOffset.value += updatesLimit.value;
	fetchLoanUpdates(activeLoan.value.id);
};

const showSingleArray = computed(() => loans.value.length === 1 && loanUpdates.value.length === 1);

const handleSelectedLoan = loan => {
	updatesOffset.value = 0;
	activeLoan.value = loan;
	fetchLoanUpdates(activeLoan.value.id);
};

const fetchMyKivaData = () => {
	return apollo.query({ query: myKivaQuery })
		.then(result => {
			userInfo.value = result.data?.my ?? {};
			lender.value = result.data?.my?.lender ?? null;
			loans.value = result.data?.my?.loans?.values ?? [];
			totalLoans.value = result.data?.my?.loans?.totalCount ?? 0;
			if (loans.value.length > 0) {
				showLoanFootnote.value = loans.value.some(l => hasLoanFunFactFootnote(l));
				// eslint-disable-next-line prefer-destructuring
				activeLoan.value = loans.value[0];
				fetchLoanUpdates(activeLoan.value.id);
			}
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage myKivaQuery');
		});
};

const saveMyKivaToUserPreferences = () => {
	const preferences = userInfo.value?.userPreferences?.preferences;
	const formattedPreference = typeof preferences === 'string'
		? JSON.parse(userInfo.value?.userPreferences?.preferences)
		: preferences;

	if (!formattedPreference?.myKivaPageExp) {
		saveUserPreferences({
			userPreferences: userInfo.value?.userPreferences ?? null,
			newPreference: {
				myKivaPageExp: 1,
			}
		});
	}
};

const badgesAchieved = computed(() => {
	const completedBadgesArr = [];

	badgeData.value.forEach(badge => {
		if (badge.achievementData?.tiers?.length) {
			const { tiers } = badge.achievementData;
			tiers.forEach(tierObj => {
				if (tierObj.completedDate) {
					completedBadgesArr.push(badge);
				}
			});
		}
		if (badge.achievementData?.milestoneProgress?.length) {
			const earnedAtDate = badge.achievementData?.milestoneProgress?.[0]?.earnedAtDate;
			if (earnedAtDate) {
				completedBadgesArr.push(badge);
			}
		}
	});

	return completedBadgesArr;
});

const scrollToTarget = target => {
	const targetElement = document.getElementById(target);
	if (targetElement) {
		targetElement.scrollIntoView({ behavior: 'smooth' });
	}
};

const checkGuestAchievementsToScroll = () => {
	const lastLogin = kvAuth0.user?.exp;
	const memberSince = lender.value?.memberSince;
	if (isFirstLogin(lastLogin, memberSince)) {
		const numberOfBadges = badgesAchieved.value.length;
		const sectionToScrollTo = numberOfBadges.value === 1 ? MY_IMPACT_JOURNEYS_ID : MY_ACHIEVEMENTS_ID;
		scrollToTarget(sectionToScrollTo);
	}
};

onMounted(async () => {
	trackExperimentVersion(
		apollo,
		$kvTrackEvent,
		'event-tracking',
		MY_KIVA_EXP_KEY,
		'EXP-MP-623-Sept2024'
	);

	$kvTrackEvent('portfolio', 'view', 'New My Kiva');

	await fetchMyKivaData();
	fetchAchievementData(apollo);
	fetchContentfulData(apollo);
	saveMyKivaToUserPreferences();
});

watch(isAchievementDataLoaded, () => {
	if (isAchievementDataLoaded.value) {
		nextTick(() => {
			// Scroll to section once async data is loaded
			const targetId = window?.location?.hash?.replace('#', '');
			if (targetId) scrollToTarget(targetId);
			checkGuestAchievementsToScroll();
		});
	}
});
</script>
