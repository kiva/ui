<template>
	<KvCartModal
		v-if="modalVisible"
		:style="{
			'--modal-right': `${modalPosition.right}px`,
			'--modal-top': `${modalPosition.top}px`
		}"
		class="cart-modal !tw-top-0"
		:visible="modalVisible"
		:photo-path="PHOTO_PATH"
		:basket-count="basketCount"
		:category-name="oneLoanAwayCategory"
		@cart-modal-closed="closeCartModal"
	>
		<template #content>
			<div
				v-if="showModalContent || isFirstLoan"
				class="tw-w-full tw-mx-2.5 tw-border-t tw-border-tertiary tw-py-2"
			>
				<KvCartPill
					class="!tw-w-full tw-justify-center"
					:borrower-name="borrowerName"
					:milestones-number="contributingAchievements.length"
					:is-close-next-milestone="showOneAway"
					:custom-message="pillMsg"
				>
					<template #icon>
						<div
							:class="{
								// eslint-disable-next-line max-len
								'tw-flex tw-items-center tw-justify-center tw-bg-gray-100 tw-p-0.5 tw-rounded tw-whitespace-nowrap'
									: showOneAway,
							}"
						>
							<EquityBadge v-if="isFirstLoan" class="tw-min-w-3" />
							<IconChoice
								v-else
								class="tw-min-w-3"
							/>
							<div
								v-if="showOneAway"
								class="tw-text-h5"
							>
								{{ oneAwayText }}
							</div>
						</div>
					</template>
				</KvCartPill>
			</div>
		</template>
	</KvCartModal>
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
	watch,
	toRefs,
	onUnmounted,
} from 'vue';
import { useRouter } from 'vue-router';
import logFormatter from '#src/util/logFormatter';
import { getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import userAtbModalQuery from '#src/graphql/query/userAtbModal.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import { KvCartModal, KvCartPill } from '@kiva/kv-components';
import useBadgeData, {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
} from '#src/composables/useBadgeData';
import IconChoice from '#src/assets/icons/inline/achievements/icon_choice.svg';
import _throttle from 'lodash/throttle';
import EquityBadge from '#src/assets/icons/inline/achievements/equity-badge.svg';
import basketItemsQuery from '#src/graphql/query/basketItems.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import { splitAchievements, filterAchievementData, getOneLoanAwayAchievement } from '#src/util/atbAchievementUtils';

const BASKET_LIMIT_SIZE_FOR_EXP = 3;
const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

const categoryNames = {
	[ID_WOMENS_EQUALITY]: 'woman',
	[ID_US_ECONOMIC_EQUALITY]: 'entrepreneur',
	[ID_CLIMATE_ACTION]: 'person',
	[ID_REFUGEE_EQUALITY]: 'refugee',
	[ID_BASIC_NEEDS]: 'person',
};

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
const headerBottomPosition = ref(0);
const headerLeftPosition = ref(0);
const oneLoanAwayCategory = ref('');
const oneLoanAwayFilteredUrl = ref('');
const modalVisible = ref(false);
const oneAwayText = ref('');
const achievementsFromBasket = ref([]);
const myKivaFlagEnabled = ref(false);
const tierTable = ref({});

const basketCount = computed(() => {
	return addedLoan.value?.basketSize ?? 0;
});

const isGuest = computed(() => !userData.value?.my);

const borrowerName = computed(() => addedLoan.value?.name);

const updateHeaderPosition = () => {
	const header = document.getElementsByTagName('header')[0];
	const headerPosition = header?.getBoundingClientRect() ?? null;

	let targets = [...document.querySelectorAll('[data-testid="header-basket"]')];
	let target = targets.find(t => t?.clientHeight);

	if (!target) {
		// No basket found, using About as the closest position
		targets = [...document.querySelectorAll('[data-testid="header-about"]')];
		target = targets.find(t => t?.clientHeight);
	}

	const basketPosition = target?.getBoundingClientRect() ?? null;
	if (basketPosition && basketPosition?.right !== headerLeftPosition.value) {
		headerLeftPosition.value = basketPosition?.right;
	}

	if (headerPosition && headerPosition?.bottom !== headerBottomPosition.value) {
		headerBottomPosition.value = headerPosition?.bottom;
	}
};

const updateHeaderPositionThrottled = _throttle(updateHeaderPosition, 100);

const modalPosition = computed(() => {
	const right = `${window.innerWidth - headerLeftPosition.value - 200}`; // 200 to be in the middle of the basket
	const top = `${headerBottomPosition.value}`;
	return { right, top };
});

const resetModal = () => {
	showModalContent.value = false;
	oneLoanAwayFilteredUrl.value = '';
	oneLoanAwayCategory.value = '';
	modalVisible.value = false;
};

const handleRedirect = type => {
	if (type === 'view-basket') {
		router.push({ path: '/basket' });
	} else if (type === 'support-another' && oneLoanAwayFilteredUrl.value) {
		router.push(oneLoanAwayFilteredUrl.value);
	} else {
		resetModal();
	}
};

const closeCartModal = closedBy => {
	const { type } = closedBy;
	if (type) {
		$kvTrackEvent('basket', 'dismiss', 'basket-modal', type);
		handleRedirect(type);
	}
	resetModal();
};

const fetchUserData = async () => {
	await apollo.query({
		query: userAtbModalQuery,
	}).then(({ data }) => {
		userData.value = data;
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
	return basketData.value.map(item => item.id);
});

const isFirstLoan = computed(() => {
	return myKivaExperimentEnabled.value && (isGuest.value || !userData.value?.my?.loans?.totalCount);
});

const numberOfMilestones = computed(() => {
	return achievementsFromBasket.value.reduce(
		(total, achievement) => {
			const achievementProgress = achievement.postCheckoutTier - achievement.preCheckoutTier;

			return total + (achievementProgress > 0 ? achievementProgress : 0);
		},
		0
	);
});

const showOneAway = computed(() => oneLoanAwayCategory.value && oneLoanAwayFilteredUrl.value && !isFirstLoan.value);

const pillMsg = computed(() => {
	if (isFirstLoan.value) {
		const initialHeading = `Supporting ${borrowerName.value} helps`;
		if (addedLoan.value?.borrowerCount > 1 || addedLoan.value?.themes.includes('Social Enterprise')) {
			return `${initialHeading} them invest in themselves.`;
		}
		if (addedLoan.value?.gender === 'male') {
			return `${initialHeading} him invest in himself.`;
		}

		return `${initialHeading} her invest in herself.`;
	}
	if (showOneAway.value) {
		return 'You’re close to your next milestone!';
	}

	const milestonesCopy = numberOfMilestones.value > 1
		? `${numberOfMilestones.value} of your milestones`
		: 'your next milestone';

	return borrowerName.value
		? `Supporting ${borrowerName.value} will hit ${milestonesCopy}!`
		: 'Supporting this loan achieves a milestone!';
});

const updateTierTable = () => {
	achievementsFromBasket.value.forEach(achievement => {
		tierTable.value[achievement.achievementId] = achievement.postCheckoutTier;
	});
};

const newAchivementReached = () => {
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
		const achievementReached = newAchivementReached();

		if (oneLoanAwayAchievement?.id && !isFirstLoan.value && !achievementReached) {
			const loanUrl = getLoanFindingUrl(oneLoanAwayAchievement.id, router.currentRoute.value);
			oneLoanAwayFilteredUrl.value = !loanUrl ? router.currentRoute.value.path : loanUrl;
			oneLoanAwayCategory.value = categoryNames[oneLoanAwayAchievement.id];
			const { target } = oneLoanAwayAchievement;
			oneAwayText.value = `${target - 1} of ${target}`;
			showModalContent.value = true;
			modalVisible.value = true;
		} else if (basketSize < BASKET_LIMIT_SIZE_FOR_EXP || achievementReached) {
			showModalContent.value = !!contributingAchievements.value.length;
			modalVisible.value = true;
		}
		achievementsFromBasket.value = [...contributingAchievements.value];
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
		achievementsFromBasket.value = loanAchievements.filter(achievement => achievement.postCheckoutTier !== achievement.preCheckoutTier); // eslint-disable-line max-len
		updateTierTable();
	}).catch(e => {
		logFormatter(e, 'Modal ATB Basket Achievements Query ');
	});
};

watch(addedLoan, async () => {
	if (myKivaExperimentEnabled.value && !isGuest.value) {
		await fetchBasketData();
		fetchPostCheckoutAchievements([...loansIdsInBasket.value, addedLoan.value?.id]);
	} else if (addedLoan.value?.basketSize < BASKET_LIMIT_SIZE_FOR_EXP) {
		modalVisible.value = true;
	}
});

onMounted(async () => {
	await fetchUserData();

	myKivaExperimentEnabled.value = getIsMyKivaEnabled(
		apollo,
		$kvTrackEvent,
		userData.value?.my?.userPreferences,
		!isGuest.value ? userData.value?.my?.loans?.totalCount : 0,
		myKivaFlagEnabled.value,
		cookieStore,
	);

	if (myKivaExperimentEnabled.value && !isGuest.value) {
		fetchAchievementData(apollo);
		await fetchBasketData();
		await fetchAchievementFromBasket();
	}

	updateHeaderPosition();
	window.addEventListener('scroll', updateHeaderPositionThrottled);
	window.addEventListener('resize', updateHeaderPositionThrottled);
});

onUnmounted(() => {
	window.removeEventListener('scroll', updateHeaderPositionThrottled);
	window.removeEventListener('resize', updateHeaderPositionThrottled);
});

</script>

<style lang="postcss" scoped>
@screen md {
	.cart-modal:deep(div.container) {
		right: var(--modal-right) !important;
		top: var(--modal-top) !important;
	}
}
</style>
