<template>
	<div class="borrower-info-header-expandable" :class="{'expanded': expanded}">
		<div class="name" v-if="name">
			{{ name }}
		</div>
		<div class="details" v-if="country || activity">
			{{ country ? `${country}` : '' }}
			{{ country && activity ? '|' : '' }}
			{{ activity ? `${activity}` : '' }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'BorrowerInfoHeaderExpandable',
	props: {
		expanded: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			default: '',
		},
		country: {
			type: String,
			default: '',
		},
		activity: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

.borrower-info-header-expandable {
	white-space: nowrap;
	margin-bottom: rem-calc(12);

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
