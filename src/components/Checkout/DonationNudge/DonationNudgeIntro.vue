<template functional>
	<div id="donation-nudge-intro">
		<div id="nudge-donation-top-header" class="impact-text">
			{{ props.header }}
		</div>
		<div class="row" id="nudge-donation-top-content-row">
			<div class="small-10 small-offset-1 columns" v-html="props.description"></div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		header: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#donation-nudge-intro {
	.nudge-lightbox-row-padding {
		padding-left: 2.5rem;
		padding-right: 2.5rem;
	}

	#nudge-donation-top-header {
		@extend .nudge-lightbox-row-padding;

		font-size: rem-calc(20);
		font-weight: 500;
		color: #64B365;
		line-height: 1.9rem;

		@include breakpoint(medium) {
			font-size: 1.6rem;
		}
	}

	#nudge-donation-top-content-row {
		@extend .nudge-lightbox-row-padding;

		margin: 1.4rem auto;
		max-width: 47rem;
		font-size: rem-calc(14);
		line-height: rem-calc(24);

		@include breakpoint(medium) {
			font-size: 1rem;
		}
	}
}
</style>
