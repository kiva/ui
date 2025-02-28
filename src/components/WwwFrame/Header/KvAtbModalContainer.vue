<template>
	<KvCartModal
		v-if="addedLoan"
		:style="{
			'--modal-right': `${modalPosition.right}px`,
			'--modal-top': `${modalPosition.top}px`
		}"
		class="cart-modal !tw-top-0"
		:added-loan="addedLoan"
		:visible="cartModalVisible"
		:photo-path="PHOTO_PATH"
		:basket-count="basketCount"
		@cart-modal-closed="closeCartModal"
	/>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { KvCartModal } from '@kiva/kv-components';

const PHOTO_PATH = 'https://www-kiva-org.freetls.fastly.net/img/';

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();
const emit = defineEmits(['close-cart-modal']);

const props = defineProps({
	addedLoan: {
		type: Object,
		default: () => ({}),
	},
	cartModalVisible: {
		type: Boolean,
		default: () => false,
	},
});

const basketCount = computed(() => {
	return props.addedLoan?.basketSize ?? 0;
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
</script>

<style lang="postcss" scoped>
@screen md {
	.cart-modal:deep(div.container) {
		right: var(--modal-right) !important;
		top: var(--modal-top) !important;
	}
}
</style>
