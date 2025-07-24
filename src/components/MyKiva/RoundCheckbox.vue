<template>
	<div
		class="tw-block tw-relative"
		:class="{
			'tw-flex-row-reverse': checkboxRight,
			'pointer-events-none': readonly
		}"
	>
		<input
			class="tw-sr-only"
			type="checkbox"
			:id="id"
			:disabled="disabled"
			v-model="inputValue"
			v-bind="$attrs"
		>
		<label
			class="tw-flex tw-items-center tw-font-normal tw-m-0"
			:for="id"
		>
			<div
				:class="[
					'tw-relative',
					inputValue ? 'tw-text-brand-550' : 'tw-bg-gray-200',
					'tw-rounded-full',
					'tw-w-2.5 tw-h-2.5',
					'tw-mr-0.5',
					'tw-transition-colors',
					'tw-flex',
					'tw-items-center',
					'tw-justify-center',
					'tw-aspect-square'
				]"
			>
				<transition name="fade">
					<KvMaterialIcon
						v-if="inputValue"
						:icon="mdiCheckCircle"
						class="check-icon"
					/>
				</transition>
			</div>
			<div class="tw-block tw-min-w-0 tw-w-full">
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { KvMaterialIcon } from '@kiva/kv-components';
import { mdiCheckCircle } from '@mdi/js';

const props = defineProps({
	id: { type: String, required: true },
	disabled: { type: Boolean, default: false },
	checked: { type: Boolean, default: false },
	checkboxRight: { type: Boolean, default: false },
	modelValue: { type: Boolean, default: undefined },
	readonly: { type: Boolean, default: false }
});

const inputValue = ref(props.modelValue ?? props.checked);

watch(() => props.modelValue, val => {
	if (val !== undefined) inputValue.value = val;
});
watch(() => props.checked, val => {
	if (val !== undefined) inputValue.value = val;
});

</script>

<style lang="postcss" scoped>

.fade-enter-active, .fade-leave-active {
	@apply tw-transition-opacity tw-duration-500;
}

.fade-enter-from, .fade-leave-to {
	@apply tw-opacity-0;
}

:deep(.check-icon svg) {
	@apply tw-w-3 tw-h-3;
}

</style>
