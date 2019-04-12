<template>
	<transition name="kvfade">
		<div
			v-show="isShown"
			class="kv-lightbox-wrap"
			:class="removeContentBg"
			ref="kvlightbox"
			@keyup.esc="closeLightbox"
			@click.stop.prevent="closeLightbox"
			tabindex="500"
		>
			<div class="kv-lightbox">
				<div class="row" id="lightbox-row">
					<div class="columns" id="lightbox-columns">
						<!-- eslint-disable max-len -->
						<div
							class="lightbox-content"
							:class="`${removeContentBg} ${noPaddingTop ? 'no-padding-top': ''} ${noPaddingBottom ? 'no-padding-bottom': ''} ${noPaddingSides ? 'no-padding-sides': ''}`"
							@click.stop
						>
							<!-- eslint-enable max-len -->
							<button @click.stop.prevent="closeLightbox" class="close-lightbox" aria-label="Close">
								<kv-icon name="small-x" />
							</button>
							<slot name="title"></slot>
							<slot>Lightbox content</slot>
							<br v-if="!noPaddingBottom">
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
		},
		noPaddingTop: {
			type: Boolean,
			default: false,
		},
		noPaddingBottom: {
			type: Boolean,
			default: false,
		},
		noPaddingSides: {
			type: Boolean,
			default: false,
		},
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
			} else {
				this.unlockScroll();
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
@import 'global/transitions';

/* Background, Structure + Close Button Styles */
.kv-lightbox-wrap {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: rem-calc(1);
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	z-index: 1500;
	max-height: 100vh;
	background: rgba(72, 72, 72, 0.6);

	@include breakpoint(medium) {
		padding: 4.5rem 1rem;
	}

	.kv-lightbox {
		position: relative;
		margin: 0 auto;
		z-index: 1502;
		padding: 0;

		#lightbox-row {
			padding: 0;
			align-items: center;
			flex-direction: column;
			margin-right: -0.0625rem;
			margin-left: -0.0625rem;

			#lightbox-columns {
				position: relative;
				width: 100%;
				max-width: 900px;
				padding-right: 0.0625rem;
				padding-left: 0.0625rem;
			}
		}

		/* Content Styles */
		.lightbox-content {
			display: block;
			position: relative;
			padding: 2.625rem 1.5rem 1.5rem 1.5rem;
			max-width: 61rem;
			background: $white;
			border-radius: rem-calc(4);

			@include breakpoint(medium) {
				padding: 4rem 2.8125rem 2.8125rem 2.8125rem;
			}

			@include breakpoint(large) {
				padding: 4.75rem 2.8125rem 2.8125rem 2.8125rem;
			}

			.close-lightbox {
				position: absolute;
				top: 1rem;
				right: 1rem;

				.icon.icon-small-x {
					height: 1.5rem;
					width: 1.5rem;
					fill: $subtle-gray;
					transition: fill 0.16s linear;
				}

				&:hover {
					.icon.icon-small-x {
						fill: $charcoal;
					}
				}

				@include breakpoint(medium) {
					top: 1.5rem;
					right: 1.5rem;
				}

				@include breakpoint(large) {
					top: 2rem;
					right: 2rem;
				}
			}

			&.no-padding-top {
				padding-top: 0;
			}

			&.no-padding-bottom {
				padding-bottom: 0;
			}

			&.no-padding-sides {
				padding-left: 0;
				padding-right: 0;
			}
		}
	}

	&.inverted {
		background: rgba(0, 0, 0, 0.9);

		.kv-lightbox {
			color: $white;
			font-weight: normal;

			.lightbox-content {
				background: transparent;

				.close-lightbox {
					.icon.icon-small-x {
						fill: $kiva-green;
					}

					&:hover {
						.icon-small-x {
							fill: $kiva-accent-green;
						}
					}
				}
			}
		}
	}
}
</style>
