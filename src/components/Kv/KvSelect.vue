<template>
	<div class="dropdown-wrapper">
		<select
			class="dropdown"
			v-model="inputValue"
			v-on="inputListeners"
			v-bind="$attrs"
		>
			<slot></slot>
		</select>
	</div>
</template>

<script>
import inputWrapperMixin from '@/plugins/input-wrapper-mixin';

export default {
	mixins: [inputWrapperMixin]
};
</script>

<style lang="scss" scoped>
@import 'settings';

.dropdown-wrapper {
	white-space: nowrap;

	.dropdown {
		max-width: 100%;
		border: 1px solid $charcoal;
		width: inherit;
		border-radius: $button-radius;
		line-height: 1.125;
		background-image: url('~@/assets/images/customDropdown.png');
		background-size: rem-calc(23) rem-calc(20);
		color: $charcoal;
		font-size: $medium-text-font-size;
		font-weight: $global-weight-highlight;
		cursor: pointer;
		padding-right: 2.5rem;
		background-position: right -1.9rem center;
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
