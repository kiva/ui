<template>
	<div class="dropdown-wrapper">
		<select
			class="dropdown"
			v-model="inputValue"
			v-bind="$attrs"
		>
			<slot></slot>
		</select>
	</div>
</template>

<script>
export default {
	name: 'KvSelect',
	props: {
		modelValue: {
			type: [String, Boolean, Number],
			required: true,
		},
	},
	data() {
		return {
			inputValue: this.modelValue,
		};
	},
	watch: {
		modelValue(newValue) {
			if (newValue !== this.inputValue) {
				this.inputValue = newValue;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.dropdown-wrapper {
	white-space: nowrap;

	.dropdown {
		max-width: 100%;
		border: 1px solid $charcoal;
		width: inherit;
		height: 2.6875rem;
		border-radius: $button-radius;
		line-height: 1.125;
		background-color: #fff;
		background-image: url('/src/assets/images/customDropdown.png');
		background-size: rem-calc(23) rem-calc(20);
		background-repeat: no-repeat;
		background-position: right -1.9rem center;
		background-origin: content-box;
		appearance: none;
		color: $charcoal;
		font-size: $medium-text-font-size;
		font-weight: $global-weight-highlight;
		cursor: pointer;
		margin: 0;
		padding: 0.5rem 2.5rem 0.5rem 0.5rem;
	}

	// Media query targeting IE 10+ only
	@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
		.dropdown {
			background-position: right -1.9rem center;
		}
	}

	// Media query targeting IE EDGE
	@supports (-ms-ime-align:auto) {
		.dropdown {
			background-position: right -1.2rem center;
		}
	}
}
</style>
