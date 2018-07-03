<template functional>
	<span
		class="small-text matching-text"
		:class="{'has-match': props.matchingText, 'is-funded': props.isFunded }"
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

	&.has-match.is-funded {
		visibility: hidden;
	}
}
</style>
