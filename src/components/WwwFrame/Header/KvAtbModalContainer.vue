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
		<template
			#content
			v-if="myKivaExperimentEnabled"
		>
			<!-- ATB content -->
		</template>
	</KvCartModal>
</template>

<script setup>
import {
	computed, inject, onMounted, ref
} from 'vue';
import { useRouter } from 'vue-router';
import logFormatter from '#src/util/logFormatter';
import { getIsMyKivaEnabled } from '#src/util/myKivaUtils';
import userAtbModalQuery from '#src/graphql/query/userAtbModal.graphql';
import { KvCartModal } from '@kiva/kv-components';

const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const router = useRouter();
const emit = defineEmits(['close-cart-modal']);

const props = defineProps({
	basketSize: {
		type: Number,
		default: 0,
	},
	cartModalVisible: {
		type: Boolean,
		default: () => false,
	},
});

const myKivaExperimentEnabled = ref(false);
const userData = ref({});

const basketCount = computed(() => {
	return props.basketSize ?? 0;
});

const getTargetsPosition = () => {
	const targets = [...document.querySelectorAll('[data-testid="header-basket"]')];
	const target = targets.find(t => t?.clientHeight);
	const header = document.getElementsByTagName('header')[0];
	return {
		basketPosition: target?.getBoundingClientRect(),
		headerPosition: header?.getBoundingClientRect(),
	};
};

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
	emit('close-cart-modal');
};

const modalPosition = computed(() => {
	const { basketPosition, headerPosition } = getTargetsPosition();
	const right = `${window.innerWidth - basketPosition.right - 200}`; // 200 to be in the middle of the basket
	const top = `${headerPosition.bottom}`;
	return { right, top };
});

const isGuest = computed(() => !userData.value?.my);

const fetchUserData = async () => {
	await apollo.query({
		query: userAtbModalQuery,
	}).then(({ data }) => {
		userData.value = data;
	}).catch(e => {
		logFormatter(e, 'Modal ATB User Data');
	});
};

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
