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
	line-height: 2rem;
}

</style>
