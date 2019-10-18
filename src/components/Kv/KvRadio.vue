<template>
	<span class="styled-radio">
		<input type="radio" id="option1" name="selectGroup" value="option1">
		<label for="option1">Styled option</label>
	</span>
</template>

<script>
import inputWrapperMixin from '@/plugins/input-wrapper-mixin';

export default {
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
}

.styled-radio input[type='radio'] {
	// pushing the default radio off the page, I didn't want to use
	// display: none; for accessibilty reasons
	position: absolute !important;
	top: rem-calc(-9999) !important;
	left: rem-calc(-9999) !important;
}

.styled-radio label {
	color: #484848;
}

.styled-radio label:before {
	content: " ";
	display: inline-block;
	position: relative;
	top: rem-calc(2);
	margin: 0 rem-calc(5) 0 0;
	width: rem-calc(15);
	height: rem-calc(15);
	border-radius: rem-calc(11);
	border: 1px solid #CCC;
	background-color: transparent;
}

.styled-radio input[type=radio]:checked + label:after {
	border-radius: rem-calc(11);
	width: rem-calc(7);
	height: rem-calc(7);
	position: absolute;
	top: rem-calc(2);
	left: rem-calc(6);
	content: " ";
	display: block;
	border: rem-calc(5) solid #8ccb8c;
}

</style>
