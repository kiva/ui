<template functional>
	<span
		class="tw-text-small tw-text-tertiary matching-text"
		:class="{
			'has-match': props.matchingText && !props.isMatchAtRisk,
			'hide-match': props.isFunded || props.isSelectedByAnother || props.isExpired,
			'wrap': props.wrap,
		}"
	>
		{{ props.matchRatio + 1 }}x matching by {{ props.matchingText }}
	</span>
</template>

<style lang="scss" scoped>
@import 'settings';

.matching-text {
	display: block;
	visibility: hidden;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&.has-match {
		visibility: visible;
	}

	&.has-match.hide-match {
		visibility: hidden;
	}

	&.wrap {
		white-space: normal;
		line-height: rem-calc(18);
	}
}
</style>
