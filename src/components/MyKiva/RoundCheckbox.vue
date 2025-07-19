<template>
	<div
		class="kv-checkbox"
		:class="{ 'kv-checkbox--right' : checkboxRight, 'kv-checkbox--readonly': readonly }"
	>
		<input
			class="input"
			type="checkbox"
			:id="id"
			:disabled="disabled"
			v-model="inputValue"
			v-bind="$attrs"
		>
		<label
			class="label"
			:for="id"
		>
			<div class="checkbox-indicator">
				<GreenRoundCheckbox v-if="inputValue" style="vertical-align: middle;" />
			</div>
			<div>
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import GreenRoundCheckbox from '#src/assets/icons/inline/round-green-checkbox.svg';

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

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 7px;
			height: 12px;
			border: solid transparent;
			border-width: 0 3px 3px 0;
			transform: translate(-50%, -50%) rotate(45deg);
		}
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

		&:checked + .label {
			.checkbox-indicator {
				background-color: #2AA967;
				border: none;

				&::after {
					border-color: white;
				}
			}
		}

		&[disabled] + .label {
			@include disabled();
		}

	}

	&--readonly {
		pointer-events: none;
	}
}
</style>
