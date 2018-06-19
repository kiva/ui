<template functional>
	<div class="matching-text-wrapper" v-if="props.matchingText">
		<span class="small-text">2x matching by {{ props.matchingText }}</span>
	</div>
</template>

<style lang="scss">
@import 'settings';

.matching-text-wrapper {
	text-align: center;
	color: $kiva-text-light;
	margin-bottom: rem-calc(20);
}
</style>
