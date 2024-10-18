<template>
	<KvLightbox
		:visible="isLightboxVisible"
		:title="title"
		@lightbox-closed="closeLightbox"
	>
		Badge Modal Content
	</KvLightbox>
</template>

<script setup>
import KvLightbox from '@kiva/kv-components/vue/KvLightbox';
import {
	ref,
	toRefs,
	defineProps,
	inject,
	watch,
	computed
} from 'vue';

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['badge-modal-closed']);

const props = defineProps({
	badge: {
		type: Object,
		default: () => ({}),
	},
	showLightbox: {
		type: Boolean,
		default: false,
	},
});
const { showLightbox } = toRefs(props);

const isLightboxVisible = ref(false);

const title = computed(() => {
	return 'Badge Modal Title';
});

const closeLightbox = () => {
	emit('badge-modal-closed');
	$kvTrackEvent('portfolio', 'click', 'badge-modal-closed');
};

watch(showLightbox, newVal => {
	isLightboxVisible.value = newVal;
});

</script>
