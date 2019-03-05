<template functional>
	<div
		id="donation-nudge-intro"
		:class="{'hide-header-on-mobile': props.hideHeaderOnMobile, 'no-description': !props.description}"
	>
		<div
			id="nudge-donation-top-header"
			class="impact-text"
		>
			{{ props.header }}
		</div>
		<div
			v-if="props.mobileImageUrl"
			id="borrower-image-mobile-container"
			class="hide-for-large"
			:class="{'has-description': props.description}"
		>
			<img id="nudge-donation-borrower-image-mobile" :src="props.mobileImageUrl">
		</div>
		<div class="row" id="nudge-donation-top-content-row" v-if="props.description">
			<div v-if="props.noPaddingDescription" class="nudge-donation-top-content" v-html="props.description"></div>
			<div v-else class="small-10 small-offset-1 columns" v-html="props.description"></div>
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
		noPaddingDescription: {
			type: Boolean,
			default: false,
		},
		mobileImageUrl: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#donation-nudge-intro {
	margin-bottom: 0.5rem;

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

		@include breakpoint(large) {
			&.hide-header-on-mobile {
				display: block;
			}
		}
	}

	#borrower-image-mobile-container {
		@extend .nudge-lightbox-row-padding;

		margin-bottom: 0.5rem;

		&.has-description {
			margin-bottom: 1rem;
		}
	}

	#nudge-donation-top-content-row {
		@extend .nudge-lightbox-row-padding;

		margin: 0.5rem auto 0 auto;
		max-width: 47rem;
		font-size: rem-calc(14);
		line-height: rem-calc(24);

		.nudge-donation-top-content {
			width: 100%;
		}

		@include breakpoint(medium) {
			font-size: 1rem;
		}

		@include breakpoint(large) {
			margin: 1rem auto 0 auto;
		}
	}

	&.hide-header-on-mobile {
		#nudge-donation-top-header {
			display: none;

			@include breakpoint(large) {
				display: block;
			}
		}

		&.no-description {
			@include breakpoint(medium down) {
				margin-bottom: 0;
			}
		}
	}
}
</style>
