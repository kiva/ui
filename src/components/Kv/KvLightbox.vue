<template>
	<transition name="fade">
		<div v-show="isShown" class="kv-lightbox">
			<div class="row">
				<div class="columns small=12">
					<a @click="closeLightbox" class="close-lightbox" aria-label="Close" :class="whiteContentBg">
						<kv-icon name="x" />
					</a>
					<div class="lightbox-content" :class="whiteContentBg">
						<slot name="title"></slot>
						<slot>Lightbox content</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	data() {
		return {
			isShown: false
		};
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		inverted: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		whiteContentBg() {
			return this.inverted ? 'inverted' : '';
		}
	},
	// Create and set our internal visibility property
	watch: {
		// eslint-disable-next-line object-shorthand
		'visible'() {
			this.isShown = this.visible;
		}
	},
	methods: {
		closeLightbox() {
			this.isShown = false;
			// listen for this event for notice of lightbox being closed internally
			this.$emit('lightboxClosed');
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

/* Background, Structure + Close Button Styles */
.kv-lightbox {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.9);
	padding: rem-calc(32) 0;
	z-index: 1000;
	overflow-y: scroll;

	@include breakpoint(large) {
		padding: rem-calc(32) 2rem;
	}

	.row {
		padding: 1.875rem;

		.columns {
			position: relative;
		}
	}

	.close-lightbox {
		position: fixed;
		top: rem-calc(10);
		right: rem-calc(10);

		@include breakpoint(large) {
			position: absolute;
			top: 0;
			right: 0;

			&.inverted {
				position: fixed;
				top: rem-calc(10);
				right: rem-calc(10);
			}
		}

		.icon.icon-x {
			stroke: $kiva-green;
			height: 2.5rem;
			width: 2.5rem;
			margin-top: rem-calc(2);
		}

		&:hover {
			.icon-x {
				stroke: $kiva-accent-green;
			}
		}
	}
}

/* @include breakpoint(large) { */

/* Content Styles */
.lightbox-content {
	display: block;
	padding-top: 2.8125rem;
	max-width: 61rem;
	margin: 0 auto;
	color: $white;

	&.inverted {
		background: $white;
		padding: 2.8125rem 1.5rem;
		color: $kiva-text-dark;
	}
}
</style>
