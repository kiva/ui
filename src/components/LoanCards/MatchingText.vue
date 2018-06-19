<template functional>
	<span
		class="small-text matching-text"
		:class="{'has-match': props.matchingText }"
	>
		2x matching by {{ props.matchingText }}
	</span>
</template>

<style lang="scss" scoped>
@import 'settings';

.matching-text {
	display: block;
	color: $kiva-text-light;
	visibility: hidden;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&.has-match {
		visibility: visible;
	}
}
</style>
