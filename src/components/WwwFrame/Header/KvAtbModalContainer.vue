<template>
	<KvCartModal
		v-if="cartModalVisible"
		:style="{
			'--modal-right': `${modalPosition.right}px`,
			'--modal-top': `${modalPosition.top}px`
		}"
		class="cart-modal !tw-top-0"
		:visible="cartModalVisible"
		:photo-path="PHOTO_PATH"
		:basket-count="basketCount"
		@cart-modal-closed="closeCartModal"
	>
		<template #content>
			<div
				v-if="showModalContent"
				class="tw-mx-2.5 tw-border-t tw-border-tertiary tw-py-2"
			>
				<KvCartPill
					class="!tw-w-full"
					:borrower-name="borrowerName"
					:milestones-number="contributingAchievements.length"
				>
					<template #icon>
						<IconChoice
							class="tw-min-w-3"
						/>
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
} from 'vue';
import { useRouter } from 'vue-router';
import logFormatter from '#src/util/logFormatter';
import { getIsMyKivaEnabled } from '#src/util/myKivaUtils';
import userAtbModalQuery from '#src/graphql/query/userAtbModal.graphql';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import { KvCartModal, KvCartPill } from '@kiva/kv-components';
import IconChoice from '#src/assets/icons/inline/achievements/icon_choice.svg';

const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const router = useRouter();
const emit = defineEmits(['close-cart-modal']);

const props = defineProps({
	cartModalVisible: {
		type: Boolean,
		default: () => false,
	},
	addedLoan: {
		type: Object,
		default: () => ({}),
	},
});

const { addedLoan } = toRefs(props);

const myKivaExperimentEnabled = ref(false);
const userData = ref({});
const contributingAchievements = ref([]);
const showModalContent = ref(false);

const basketCount = computed(() => {
	return addedLoan.value?.basketSize ?? 0;
});

const isGuest = computed(() => !userData.value?.my);

const borrowerName = computed(() => addedLoan.value?.name);

const getTargetsPosition = () => {
	const targets = [...document.querySelectorAll('[data-testid="header-basket"]')];
	const target = targets.find(t => t?.clientHeight);
	const header = document.getElementsByTagName('header')[0];
	return {
		basketPosition: target?.getBoundingClientRect(),
		headerPosition: header?.getBoundingClientRect(),
	};
};

const modalPosition = computed(() => {
	const { basketPosition, headerPosition } = getTargetsPosition();
	const right = `${window.innerWidth - basketPosition.right - 200}`; // 200 to be in the middle of the basket
	const top = `${headerPosition.bottom}`;
	return { right, top };
});

const handleRedirect = type => {
	if (type === 'view-basket') {
		router.push({ path: '/basket' });
	}
};

const closeCartModal = closedBy => {
	const { type } = closedBy;
	if (type) {
		$kvTrackEvent('basket', 'dismiss', 'basket-modal', type);
		handleRedirect(type);
	}
	showModalContent.value = false;
	emit('close-cart-modal');
};

const fetchUserData = async () => {
	await apollo.query({
		query: userAtbModalQuery,
	}).then(({ data }) => {
		userData.value = data;
	}).catch(e => {
		logFormatter(e, 'Modal ATB User Data');
	});
};

const fetchPostCheckoutAchievements = async loanIds => {
	await apollo.query({
		query: postCheckoutAchievementsQuery,
		variables: { loanIds }
	}).then(({ data }) => {
		const loanAchievements = data.postCheckoutAchievements?.overallProgress ?? [];
		contributingAchievements.value = loanAchievements.filter(achievement => achievement.postCheckoutTier !== achievement.preCheckoutTier); // eslint-disable-line max-len
		showModalContent.value = contributingAchievements.value.length;
	}).catch(e => {
		logFormatter(e, 'Modal ATB Post Checkout Achievements Query');
	});
};

watch(addedLoan, async () => {
	if (myKivaExperimentEnabled.value && !isGuest.value) {
		fetchPostCheckoutAchievements([addedLoan.value?.id]);
	}
});

onMounted(async () => {
	await fetchUserData();

	myKivaExperimentEnabled.value = getIsMyKivaEnabled(
		apollo,
		$kvTrackEvent,
		userData.value?.my?.userPreferences,
		!isGuest.value ? userData.value?.my?.loans?.totalCount : 0,
	);
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
