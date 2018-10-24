<template functional>
	<div class="small-text matching-text">
		Matched by {{ props.matchingText }}
	</div>
</template>

<script>
export default {
	props: {
		matchingText: {
			type: String,
			default: ''
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.matching-text {
	line-height: 1rem;
	margin: rem-calc(5) 0;
	font-weight: $global-weight-normal;
	color: $gray;
}
</style>
