<template>
	<KvAtbModal
		:modal-visible="modalVisible"
		:user-data="userData"
		:added-loan="addedLoan"
		:my-kiva-experiment-enabled="myKivaExperimentEnabled"
		:show-modal-content="showModalContent"
		:photo-path="PHOTO_PATH"
		:one-loan-away-category="oneLoanAwayCategory"
		:one-loan-away-filtered-url="oneLoanAwayFilteredUrl"
		:one-away-text="oneAwayText"
		:milestones-number="contributingAchievements.length"
		:milestones-progress="milestonesProgress"
		:has-ever-logged-in="hasEverLoggedIn"
		:is-loan-goal="isLoanGoal"
		:is-completing-goal="isCompletingGoal"
		@close-redirect="handleRedirect"
		@reset-modal="resetModal"
	/>
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
	watch,
	toRefs,
} from 'vue';
import { useRouter } from 'vue-router';
import logFormatter from '#src/util/logFormatter';
import { getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import userAtbModalQuery from '#src/graphql/query/userAtbModal.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import { KvAtbModal } from '@kiva/kv-components';
import useBadgeData, { CATEGORY_TARGETS } from '#src/composables/useBadgeData';
import basketItemsQuery from '#src/graphql/query/basketItems.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import { splitAchievements, filterAchievementData, getOneLoanAwayAchievement } from '#src/util/atbAchievementUtils';
import useGoalData from '#src/composables/useGoalData';
import userLentToQuery from '#src/graphql/query/userLentTo.graphql';

const BASKET_LIMIT_SIZE_FOR_EXP = 3;
const PHOTO_PATH = 'https://www.kiva.org/img/';

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const cookieStore = inject('cookieStore');
const router = useRouter();

const {
	fetchAchievementData,
	badgeAchievementData,
	getLoanFindingUrl,
} = useBadgeData(apollo);

const props = defineProps({
	addedLoan: {
		type: Object,
		default: () => ({}),
	},
});

const { addedLoan } = toRefs(props);

const {
	userGoal,
	loadGoalData,
	getPostCheckoutProgressByLoans,
	isProgressCompletingGoal,
} = useGoalData({ apollo });

const myKivaExperimentEnabled = ref(false);
const userData = ref({});
const basketData = ref([]);
const contributingAchievements = ref([]);
const showModalContent = ref(false);
const oneLoanAwayCategory = ref('');
const oneLoanAwayFilteredUrl = ref('');
const modalVisible = ref(false);
const oneAwayText = ref('');
const myKivaFlagEnabled = ref(false);
const tierTable = ref({});
const milestonesProgress = ref({});
const hasEverLoggedIn = ref(false);
const basketTotal = ref(0);
const loanGoalProgress = ref(0);

const basketCount = computed(() => {
	return addedLoan.value?.basketSize ?? 0;
});

const isGuest = computed(() => !userData.value?.my);

const resetModal = () => {
	showModalContent.value = false;
	oneLoanAwayFilteredUrl.value = '';
	oneLoanAwayCategory.value = '';
	modalVisible.value = false;
};

const handleRedirect = payload => {
	$kvTrackEvent('basket', 'dismiss', 'basket-modal', payload.type);
	router.push(payload.path);
	resetModal();
};

const fetchUserData = async () => {
	await apollo.query({
		query: userAtbModalQuery,
	}).then(({ data }) => {
		userData.value = data ?? null;
		hasEverLoggedIn.value = data?.hasEverLoggedIn ?? false;
		myKivaFlagEnabled.value = readBoolSetting(data, MY_KIVA_FOR_ALL_USERS_KEY);
	}).catch(e => {
		logFormatter(e, 'Modal ATB User Data');
	});
};

const fetchBasketData = async () => {
	await apollo.query({
		query: basketItemsQuery,
		variables: {
			basketId: cookieStore.get('kvbskt') || null,
		},
	}).then(({ data }) => {
		basketData.value = data?.shop?.basket?.items?.values ?? [];
		basketTotal.value = basketData.value.reduce((total, item) => {
			return total + (parseFloat(item.price) || 0);
		}, 0);
	}).catch(e => {
		logFormatter(e, 'Modal ATB Basket Data');
	});
};

const loansInBasket = computed(() => {
	// eslint-disable-next-line no-underscore-dangle
	return basketData.value.filter(item => item.__typename === 'LoanReservation') ?? [];
});

const loansIdsInBasket = computed(() => loansInBasket.value.map(item => item.id));

const showBasedOnUserBalance = computed(() => {
	const userBalance = Math.floor(userData.value?.my?.userAccount?.balance ?? 0);
	return userBalance - basketTotal.value < 25;
});

const isFirstLoan = computed(() => {
	return myKivaExperimentEnabled.value
		&& ((isGuest.value && !hasEverLoggedIn.value) || (!isGuest.value && !userData.value?.my?.loans?.totalCount))
		&& basketCount.value === 1;
});

// eslint-disable-next-line max-len
const isLoanGoal = computed(() => loanGoalProgress.value > 0 && userGoal.value?.status === 'in-progress' && loanGoalProgress.value <= userGoal.value?.target);

const isCompletingGoal = computed(() => isProgressCompletingGoal(loanGoalProgress.value));

const updateTierTable = () => {
	contributingAchievements.value.forEach(achievement => {
		const { achievementId } = achievement;
		tierTable.value[achievementId] = achievement.postCheckoutTier;
		milestonesProgress.value[achievementId] = achievement.postCheckoutTier - achievement.preCheckoutTier;
	});
};

const newAchievementReached = () => {
	return contributingAchievements.value.some(achievement => {
		const hasTierChanged = tierTable.value[achievement.achievementId] !== achievement.postCheckoutTier;
		if (hasTierChanged) {
			tierTable.value[achievement.achievementId] = achievement.postCheckoutTier;
		}
		return hasTierChanged;
	});
};

const fetchPostCheckoutAchievements = async loanIds => {
	// Reset modal state to clear previous messages
	resetModal();
	const { id: addedLoanId, basketSize } = addedLoan.value;
	let showAtbGoalMsg = false;
	await loadGoalData({
		supportAllCounterLoans: loansInBasket.value,
		yearlyProgress: true,
	});
	// Use yearly progress with current year
	const year = new Date().getFullYear();
	// Increment counter per add-to-basket action
	const { totalProgress } = await getPostCheckoutProgressByLoans({
		loans: loanIds.map(id => ({ id })),
		year,
		increment: true,
	});
	loanGoalProgress.value = totalProgress;
	const userTarget = userGoal.value?.target || 0;
	const isOneLoanAwayFromGoal = userTarget - totalProgress === 1;
	const goalAchieved = loanGoalProgress.value === userTarget;
	showAtbGoalMsg = isLoanGoal.value && (basketSize < BASKET_LIMIT_SIZE_FOR_EXP
			|| isOneLoanAwayFromGoal || goalAchieved);
	if (showAtbGoalMsg) {
		if (isOneLoanAwayFromGoal) {
			const loanUrl = getLoanFindingUrl(userGoal.value?.category, router.currentRoute.value);
			oneLoanAwayFilteredUrl.value = !loanUrl ? router.currentRoute.value.path : loanUrl;
			oneLoanAwayCategory.value = CATEGORY_TARGETS[userGoal.value?.category];
			oneAwayText.value = `${userTarget - 1} of ${userTarget}`;
		}
		showModalContent.value = true;
		modalVisible.value = true;
		return;
	}

	// If added loan is not related to user goal, proceed with achievements logic.
	// This condition will prevent any conflict between goal and achievement messages.
	if (!isLoanGoal.value) {
		await apollo.query({
			query: postCheckoutAchievementsQuery,
			variables: { loanIds }
		}).then(({ data }) => {
			const loanAchievements = data.postCheckoutAchievements?.overallProgress ?? [];
			// eslint-disable-next-line max-len
			const { contributingLoanAchievements, nonContributingAchievements } = splitAchievements(loanAchievements, tierTable.value);
			contributingAchievements.value = [...contributingLoanAchievements];

			// eslint-disable-next-line max-len
			const filteredAchievementsData = filterAchievementData(nonContributingAchievements, badgeAchievementData.value);
			// eslint-disable-next-line max-len
			const oneLoanAwayAchievement = getOneLoanAwayAchievement(addedLoanId, filteredAchievementsData, loanAchievements);
			const achievementReached = newAchievementReached();

			if (oneLoanAwayAchievement?.id && !isFirstLoan.value && !achievementReached) {
				const loanUrl = getLoanFindingUrl(oneLoanAwayAchievement.id, router.currentRoute.value);
				oneLoanAwayFilteredUrl.value = !loanUrl ? router.currentRoute.value.path : loanUrl;
				oneLoanAwayCategory.value = CATEGORY_TARGETS[oneLoanAwayAchievement.id];
				const { target } = oneLoanAwayAchievement;
				oneAwayText.value = `${target - 1} of ${target}`;
				showModalContent.value = true;
				modalVisible.value = true;
			} else if ((basketSize < BASKET_LIMIT_SIZE_FOR_EXP || achievementReached) && showBasedOnUserBalance.value) {
				showModalContent.value = !!contributingAchievements.value.length;
				modalVisible.value = true;
			}
			updateTierTable();
		}).catch(e => {
			logFormatter(e, 'Modal ATB Post Checkout Achievements Query');
		});
	}
};

const fetchAchievementFromBasket = async () => {
	await apollo.query({
		query: postCheckoutAchievementsQuery,
		variables: { loanIds: loansIdsInBasket.value },
	}).then(({ data }) => {
		const loanAchievements = data.postCheckoutAchievements?.overallProgress ?? [];
		const { contributingLoanAchievements } = splitAchievements(loanAchievements, tierTable.value);
		contributingAchievements.value = [...contributingLoanAchievements];
		updateTierTable();
	}).catch(e => {
		logFormatter(e, 'Modal ATB Basket Achievements Query ');
	});
};

const hasUserLentToAddedLoan = async loanId => {
	return apollo.query({
		query: userLentToQuery,
		variables: { loanId },
	}).then(({ data }) => {
		const hasLentToLoan = data?.lend?.loan?.userProperties?.lentTo ?? false;
		return hasLentToLoan;
	}).catch(e => {
		logFormatter(e, 'Modal ATB User Lent To Loan Query');
		return false;
	});
};

watch(addedLoan, async () => {
	if (myKivaExperimentEnabled.value && !isGuest.value && !(await hasUserLentToAddedLoan(addedLoan.value?.id))) {
		await fetchBasketData();
		fetchPostCheckoutAchievements(loansIdsInBasket.value);
	} else if (addedLoan.value?.basketSize < BASKET_LIMIT_SIZE_FOR_EXP) {
		modalVisible.value = true;
	}
});

onMounted(async () => {
	await fetchUserData();

	myKivaExperimentEnabled.value = getIsMyKivaEnabled(
		apollo,
		$kvTrackEvent,
		myKivaFlagEnabled.value,
		cookieStore,
	);

	if (myKivaExperimentEnabled.value && !isGuest.value) {
		fetchAchievementData(apollo);
		await fetchBasketData();
		await fetchAchievementFromBasket();
	}
});

</script>
