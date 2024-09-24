<template>
	<span
		class="tw-text-small tw-text-tertiary matching-text"
		:class="{
			'has-match': matchingText && !isMatchAtRisk,
			'hide-match': isFunded || isSelectedByAnother || isExpired,
			'wrap': wrap,
		}"
	>
		{{ matchRatio + 1 }}x matching by {{ matchingText }}
	</span>
</template>

<script>
export default {
	name: 'MatchingText',
	props: {
		matchingText: {
			type: String,
			default: '',
		},
		isMatchAtRisk: {
			type: Boolean,
			default: false,
		},
		isFunded: {
			type: Boolean,
			default: false,
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false,
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		wrap: {
			type: Boolean,
			default: false,
		},
		matchRatio: {
			type: Number,
			default: 0
		},
	},
};
</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

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
