<template>
	<transition name="fade">
		<div v-show="isShown"
			class="kv-lightbox-wrap"
			ref="kvlightbox"
			@keyup.esc="closeLightbox"
			tabindex="500">
			<div class="kv-lightbox-bg" @click.stop.prevent="closeLightbox"></div>
			<div class="kv-lightbox">
				<div class="row">
					<div class="columns">
						<div class="lightbox-content" :class="removeContentBg">
							<button @click.stop.prevent="closeLightbox" class="close-lightbox" aria-label="Close">
								<kv-icon name="x" />
							</button>
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
	watch: {
		// Create and set our internal visibility property
		visible() {
			this.isShown = this.visible;
			// if the lightbox is shown give it focus
			// this ensures the esc functionality works
			if (this.isShown) {
				this.$nextTick(() => {
					this.$refs.kvlightbox.focus();
					this.lockScroll();
				});
			}
		}
	},
	methods: {
		closeLightbox() {
			this.isShown = false;
			// listen for this event in parent components
			// it gives notice of the lightbox being closed internally
			this.$emit('lightbox-closed');
			// remove scroll lock class from body
			this.unlockScroll();
		},
		lockScroll() {
			if (typeof window !== 'undefined') {
				document.body.classList.add('scroll-locked');
			}
		},
		unlockScroll() {
			if (typeof window !== 'undefined') {
				document.body.classList.remove('scroll-locked');
			}
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

body.scroll-locked {
	overflow: hidden;
}

/* Background, Structure + Close Button Styles */
.kv-lightbox-wrap {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 4.5rem 0;
	overflow-y: scroll;
}

.kv-lightbox-bg {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.9);
	z-index: 1000;
	overflow-y: scroll;

	@include breakpoint(large) {
		padding: rem-calc(32) 2rem;
	}
}

.kv-lightbox {
	position: relative;
	margin: 0 auto;
	z-index: 1000;
	padding: 0;

	.row {
		padding: 0;
		align-items: center;
		flex-direction: column;

		.columns {
			position: relative;
			max-width: 900px;
		}
	}

	/* Content Styles */
	.lightbox-content {
		display: block;
		position: relative;
		padding: 2rem 1.5rem;
		max-width: 61rem;
		margin: 0 1rem;
		background: $white;

		@include breakpoint(large) {
			padding: 2.8125rem;
		}

		&.inverted {
			background: transparent;
			color: $white;
			font-weight: normal;
			margin: 0;
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
