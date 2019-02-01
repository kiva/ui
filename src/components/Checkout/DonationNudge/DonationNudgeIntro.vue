<template functional>
	<div id="donation-nudge-intro">
		<div
			id="nudge-donation-top-header"
			class="impact-text"
			:class="{'hide-header-on-mobile': props.hideHeaderOnMobile}"
		>
			{{ props.header }}
		</div>
		<div class="row" id="nudge-donation-top-content-row" v-if="props.description">
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
		hideHeaderOnMobile: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#donation-nudge-intro {
	margin-bottom: 1.4rem;

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

		&.hide-header-on-mobile {
			display: none;
		}

		@include breakpoint(medium) {
			font-size: 1.6rem;
		}

		@include breakpoint(large) {
			&.hide-header-on-mobile {
				display: block;
			}
		}
	}

	#nudge-donation-top-content-row {
		@extend .nudge-lightbox-row-padding;

		margin: 1.4rem auto 0 auto;
		max-width: 47rem;
		font-size: rem-calc(14);
		line-height: rem-calc(24);

		@include breakpoint(medium) {
			font-size: 1rem;
		}
	}
}
</style>
