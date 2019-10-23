<template>
	<div class="styled-radio">
		<input
			type="radio"
			:value="value"
			:id="labelSet"
			v-model="inputValue"
			v-on="inputListeners"
			v-bind="$attrs"
		>
		<label :for="labelSet">
			<slot></slot>
		</label>
	</div>
</template>

<script>
import inputWrapperMixin from '@/plugins/input-wrapper-mixin';

export default {
	props: {
		labelSet: {
			type: String,
			required: true
		},
		value: {
			type: String,
			required: true
		}
	},
	mixins: [inputWrapperMixin]
};

</script>

<style lang="scss" scoped>
@import 'settings';

.styled-radio {
	display: inline-block;
	position: relative;
	padding: 0 rem-calc(6);
	margin: rem-calc(10) 0 0;

	input[type='radio'] {
		// Pushing the default radio off the page instead of using
		// display: none; for screen reader accessibilty
		position: absolute !important;
		left: rem-calc(-9999) !important;
	}

	label::before {
		content: " ";
		display: inline-block;
		position: relative;
		top: rem-calc(2);
		margin: 0 rem-calc(5) 0 0;
		width: rem-calc(15);
		height: rem-calc(15);
		border-radius: rem-calc(11);
		border: 1px solid $subtle-gray;
		background-color: transparent;
	}

	input[type=radio]:checked + label {
		font-weight: 500;

		&::after {
			border-radius: rem-calc(11);
			width: rem-calc(15);
			height: rem-calc(15);
			position: absolute;
			top: rem-calc(6);
			left: rem-calc(14);
			content: " ";
			display: block;
			border: rem-calc(5) solid $kiva-light-green;
		}
	}
}

</style>
