<template>
	<div ref="menuRef" class="tw-relative tw-inline-flex">
		<!-- Trigger -->
		<button
			type="button"
			class="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full"
			@click="toggle"
			aria-haspopup="menu"
			:aria-expanded="isOpen ? 'true' : 'false'"
		>
			<span class="tw-sr-only">Open menu</span>
			<KvMaterialIcon
				:icon="mdiDotsVertical"
				class="tw-w-4"
			/>
		</button>

		<!-- Dropdown -->
		<transition
			enter-active-class="tw-transition tw-ease-out tw-duration-150"
			enter-from-class="tw-opacity-0 -tw-translate-y-1"
			enter-to-class="tw-opacity-100 tw-translate-y-0"
			leave-active-class="tw-transition tw-ease-in tw-duration-100"
			leave-from-class="tw-opacity-100 tw-translate-y-0"
			leave-to-class="tw-opacity-0 -tw-translate-y-1"
		>
			<div
				v-if="isOpen"
				style="min-width: 215px;"
				class="tw-absolute tw-right-0 tw-top-0 tw-z-docked
          tw-overflow-hidden tw-rounded-md tw-bg-white tw-border tw-border-secondary tw-shadow-lg"
				role="menu"
			>
				<button
					v-for="(action, idx) in actions"
					:key="action.value ?? idx"
					type="button"
					class="tw-flex tw-w-full tw-items-center tw-gap-0.5 tw-px-3 tw-py-1.5"
					role="menuitem"
					@click="select(action)"
				>
					<span class="tw-font-medium">{{ action.label }}</span>
				</button>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { mdiDotsVertical } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

/**
 * Props:
 * actions: [{ label: "Delete goal", value: "delete", icon?: Component }]
 */
defineProps({
	actions: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(['select']);

const isOpen = ref(false);
const menuRef = ref(null);

const toggle = () => {
	isOpen.value = !isOpen.value;
};

const close = () => {
	isOpen.value = false;
};

const select = action => {
	emit('select', action);
	close();
};

const onClickOutside = e => {
	if (!menuRef.value) return;
	if (!menuRef.value.contains(e.target)) close();
};

const onKeyDown = e => {
	if (e.key === 'Escape') close();
};

onMounted(() => {
	document.addEventListener('click', onClickOutside);
	document.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', onClickOutside);
	document.removeEventListener('keydown', onKeyDown);
});
</script>
