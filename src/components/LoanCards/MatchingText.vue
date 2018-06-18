<template functional>
	<div class="matching-text-wrapper" v-if="props.matchingText">
		<span>2x matching by {{ props.matchingText }}</span>
	</div>
</template>

<style lang="scss">
@import 'settings';

.matching-text-wrapper {
	text-align: center;
	font-size: .875rem;
	color: $kiva-text-light;
}
</style>
