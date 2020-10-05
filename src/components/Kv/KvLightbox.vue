<template>
	<transition name="kvfade">
		<div
			v-show="isShown"
			class="kv-lightbox-wrap"
			:class="{'inverted': inverted}"
			ref="kvlightbox"
			@keyup.esc="closeLightbox"
			@click.stop.prevent="closeLightbox"
			role="dialog"
			:aria-labelledby="title ? 'lightbox-title' : null"
		>
			<focus-lock :disabled="!isShown">
				<div
					class="kv-lightbox"
					:class="{'full-width': fullWidth}"
					role="document"
				>
					<div class="row lightbox-row">
						<div class="columns lightbox-columns">
							<div
								class="lightbox-content"
								:class="{
									'inverted': inverted,
									'no-padding-top': noPaddingTop,
									'no-padding-bottom': noPaddingBottom,
									'no-padding-sides': noPaddingSides,
								}"
								@click.stop
							>
								<h2 v-if="title"
									class="lightbox-title"
									id="lightbox-title"
								>
									{{ title }}
								</h2>
								<button
									@click.stop.prevent="closeLightbox"
									class="close-lightbox"
									aria-label="Close"
								>
									<kv-icon class="icon-small-x" name="small-x" :from-sprite="true" />
								</button>
								<slot>Lightbox content</slot>

								<div class="lightbox-controls">
									<slot name="controls"></slot>
								</div>
							</div>
						</div>
					</div>
				</div>
			</focus-lock>
		</div>
	</transition>
</template>

<script>
import FocusLock from 'vue-focus-lock';
import KvIcon from '@/components/Kv/KvIcon';
import lockScrollUtils from '@/plugins/lock-scroll';

export default {
	components: {
		FocusLock,
		KvIcon,
	},
	mixins: [
		lockScrollUtils,
	],
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
		title: {
			type: String,
			default: '',
		},
		inverted: {
			type: Boolean,
			default: false
		},
		fullWidth: {
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
	watch: {
		// Create and set our internal visibility property
		visible() {
			this.isShown = this.visible;
			if (this.isShown) {
				this.$nextTick(() => {
					this.lockScroll();
				});
			} else {
				this.unlockScroll();
			}
		}
	},
	mounted() {
		this.isShown = this.visible;
	},
	beforeDestroy() {
		this.closeLightbox();
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
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-lightbox-wrap {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: rem-calc(1);
	overflow-y: auto;
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

		&.full-width {
			.lightbox-columns {
				width: 100%;
			}
		}

		.lightbox-row {
			padding: 0;
			align-items: center;
			flex-direction: column;

			.lightbox-columns {
				position: relative;
				max-width: rem-calc(900);
				padding-right: 0.0625rem;
				padding-left: 0.0625rem;
			}
		}

		/* Content Styles */
		.lightbox-content {
			display: block;
			position: relative;
			padding: 1.5rem;
			margin: 1rem;
			max-width: 61rem;
			background: $white;
			border-radius: rem-calc(4);

			@include breakpoint(medium) {
				padding: 2.8125rem;
			}

			.lightbox-title {
				color: inherit;
				color: var(--kv-lightbox-title-color, inherit);
				padding-right: 1rem;
			}

			.close-lightbox {
				width: 2.5rem;
				height: 2.5rem;
				padding-left: 0.25rem;
				padding-top: 0.375rem;
				position: absolute;
				top: 0.75rem;
				right: 0.75rem;

				.icon-small-x {
					height: 1.5rem;
					width: 1.5rem;
					fill: $subtle-gray;
					transition: fill 0.16s linear;
				}

				&:hover {
					.icon-small-x {
						fill: $charcoal;
					}
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
					.icon-small-x {
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

	.lightbox-controls ::v-deep button {
		margin-bottom: 0;
	}
}
</style>
