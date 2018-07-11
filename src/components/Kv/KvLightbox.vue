<template>
	<transition name="fade">
		<div v-show="isShown" class="kv-lightbox">
			<div class="row">
				<div class="columns small=12">
					<div class="lightbox-content" :class="removeContentBg">
						<a @click.stop.prevent="closeLightbox" class="close-lightbox" aria-label="Close">
							<kv-icon name="x" />
						</a>
						<slot name="title"></slot>
						<slot>Lightbox content</slot>
						<br>
						<slot name="controls">
							<kv-button v-if="showCloseButton" @click.native="closeLightbox">
								Close
							</kv-button>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvIcon,
		KvButton
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
		},
		showCloseButton: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		removeContentBg() {
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
		padding: 1.875rem 1rem;

		@include breakpoint(large) {
			padding: 1.875rem;
		}

		.columns {
			position: relative;
		}
	}

	/* Content Styles */
	.lightbox-content {
		display: block;
		position: relative;
		padding: 2rem 1.5rem;
		max-width: 61rem;
		margin: 0 auto;
		background: $white;

		@include breakpoint(large) {
			padding: 2.8125rem;
		}

		&.inverted {
			background: transparent;
			color: $white;
			font-weight: normal;
		}
	}

	.close-lightbox {
		position: fixed;
		top: rem-calc(14);
		right: rem-calc(14);

		@include breakpoint(large) {
			position: absolute;
			top: rem-calc(10);
			right: rem-calc(10);
		}

		&.inverted {
			position: fixed;
			top: rem-calc(14);
			right: rem-calc(14);
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
</style>
