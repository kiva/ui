<template functional>
	<div class="borrower-info-header-expandable" :class="{'expanded': props.expanded}">
		<div class="name" v-if="props.name">{{ props.name }}</div>
		<div class="details" v-if="props.country || props.activity">
			{{ props.country ? `${props.country}` : '' }}
			{{ props.country && props.activity ? '|' : '' }}
			{{ props.activity ? `${props.activity}` : '' }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import 'settings';

.borrower-info-header-expandable {
	white-space: nowrap;
	margin-bottom: rem-calc(10);

	.expandable {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name {
		@extend .expandable;

		font-size: rem-calc(20);
		line-height: rem-calc(28);
		font-weight: $global-weight-highlight;
		margin-bottom: rem-calc(5);
	}

	.details {
		@extend .expandable;

		color: $kiva-text-light;
		line-height: rem-calc(20);
	}

	&.expanded {
		white-space: initial;
	}
}
</style>
