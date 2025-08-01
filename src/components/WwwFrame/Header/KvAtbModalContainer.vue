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
import useBadgeData, {
	CATEGORY_TARGETS,
} from '#src/composables/useBadgeData';
import basketItemsQuery from '#src/graphql/query/basketItems.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import { splitAchievements, filterAchievementData, getOneLoanAwayAchievement } from '#src/util/atbAchievementUtils';

const BASKET_LIMIT_SIZE_FOR_EXP = 3;
const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

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

const basketCount = computed(() => {
	return addedLoan.value?.basketSize ?? 0;
});

const isGuest = computed(() => !userData.value?.my);
const hasUserBalance = computed(() => Boolean(Math.floor(userData.value?.my?.userAccount?.balance)));

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
	}).catch(e => {
		logFormatter(e, 'Modal ATB Basket Data');
	});
};

const loansIdsInBasket = computed(() => {
	// eslint-disable-next-line no-underscore-dangle
	return basketData.value.filter(item => item.__typename === 'LoanReservation').map(item => item.id);
});

const isFirstLoan = computed(() => {
	return myKivaExperimentEnabled.value
		&& ((isGuest.value && !hasEverLoggedIn.value) || (!isGuest.value && !userData.value?.my?.loans?.totalCount))
		&& basketCount.value === 1;
});

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
	await apollo.query({
		query: postCheckoutAchievementsQuery,
		variables: { loanIds }
	}).then(({ data }) => {
		const loanAchievements = data.postCheckoutAchievements?.overallProgress ?? [];
		// eslint-disable-next-line max-len
		const { contributingLoanAchievements, nonContributingAchievements } = splitAchievements(loanAchievements, tierTable.value);
		contributingAchievements.value = [...contributingLoanAchievements];

		const { id: addedLoanId, basketSize } = addedLoan.value;
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
		} else if ((basketSize < BASKET_LIMIT_SIZE_FOR_EXP || achievementReached) && !hasUserBalance.value) {
			showModalContent.value = !!contributingAchievements.value.length;
			modalVisible.value = true;
		}
		updateTierTable();
	}).catch(e => {
		logFormatter(e, 'Modal ATB Post Checkout Achievements Query');
	});
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

watch(addedLoan, async () => {
	if (myKivaExperimentEnabled.value && !isGuest.value) {
		await fetchBasketData();
		fetchPostCheckoutAchievements(loansIdsInBasket.value);
	} else if (addedLoan.value?.basketSize < BASKET_LIMIT_SIZE_FOR_EXP && !hasUserBalance.value) {
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
