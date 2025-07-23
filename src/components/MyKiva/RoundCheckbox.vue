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
					'tw-w-3.5',
					'tw-h-3.5',
					'tw-rounded-full',
					'tw-mr-2',
					'tw-transition-colors',
					'tw-flex',
					'tw-items-center',
					'tw-justify-center',
					'tw-aspect-square',
					inputValue ? 'tw-bg-transparent' : 'tw-bg-gray-200'
				]"
			>
				<KvMaterialIcon
					v-if="inputValue"
					:icon="mdiCheckCircle"
					class="tw-w-3.5 tw-h-3.5 tw-text-brand-550"
				/>
			</div>
			<div class="tw-block tw-min-w-0 tw-w-full md:max-w-xs">
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

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.kv-checkbox {
	display: block;
	position: relative;

	.label {
		display: flex;
		align-items: center;
		font-size: 1em;
		line-height: inherit;
		margin: 0;
	}

	.checkbox-indicator {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #e5e7eb;
		border: none;
		margin-right: 0.5em;
		position: relative;
		box-shadow: none;
		transition: background-color 200ms ease-in-out;
	}

	&--right {
		.checkbox-indicator {
			order: 1;
			margin-right: 0;
			margin-left: 0.5em;
		}
	}

	.input {
		@include visually-hidden();

		&[disabled] + .label {
			@include disabled();
		}

	}

	&--readonly {
		pointer-events: none;
	}
}
</style>
