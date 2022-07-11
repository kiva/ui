<template>
	<transition name="kvfade">
		<div
			class="kv-lightbox"
			:class="{
				'kv-lightbox--inverted': inverted,
				'kv-lightbox--no-padding-top': noPaddingTop,
				'kv-lightbox--no-padding-bottom': noPaddingBottom,
				'kv-lightbox--no-padding-sides': noPaddingSides,
			}"
			@click.stop.prevent="closeLightbox"
			v-show="isShown"
		>
			<focus-lock
				:disabled="!isShown"
				class="kv-lightbox__focus-lock"
				:return-focus="true"
			>
				<div
					class="kv-lightbox__container tw-bg-primary"
					@click.stop
					tabindex="-1"
					ref="kvLightbox"
					role="dialog"
					data-testid="kv-lightbox"
					:aria-labelledby="title ? 'lightbox-title' : null"
					aria-modal="true"
				>
					<div class="kv-lightbox__header">
						<h2
							v-if="title"
							class="kv-lightbox__title tw-mb-1"
							id="lightbox-title"
						>
							{{ title }}
						</h2>
						<button
							v-if="!preventClose"
							class="kv-lightbox__close-btn"
							@click.stop.prevent="closeLightbox"
							aria-label="Close"
						>
							<kv-icon
								class="kv-lightbox__close-btn-icon"
								name="small-x"
								:from-sprite="true"
							/>
						</button>
					</div>
					<div
						class="kv-lightbox__body"
						ref="kvLightboxBody"
					>
						<!-- gives lightbox content foundation grids the correct margins -->
						<div class="kv-lightbox__body-row row">
							<div class="kv-lightbox__body-columns columns">
								<slot>Lightbox body</slot>
							</div>
						</div>
					</div>
					<div class="kv-lightbox__controls" v-if="this.$slots.controls">
						<slot name="controls"></slot>
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
	name: 'KvLightbox',
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
		preventClose: {
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
			this.init();
		}
	},
	mounted() {
		this.isShown = this.visible;
		this.init();
	},
	beforeDestroy() {
		this.closeLightbox();
	},
	methods: {
		init() {
			if (this.isShown) {
				document.addEventListener('keyup', this.onKeyUp);
				this.$nextTick(() => {
					this.$refs.kvLightbox.focus();
					this.lockScroll();
					document.body.classList.add('lightbox-open'); // used as a styling hook when printing
				});
			} else {
				document.removeEventListener('keyup', this.onKeyUp);
				this.unlockScroll();
				document.body.classList.remove('lightbox-open'); // used as a styling hook when printing
			}
		},
		onKeyUp(e) {
			if (e.key === 'Escape') {
				this.closeLightbox();
			}
		},
		closeLightbox() {
			if (!this.preventClose) {
				if (this.$refs.kvLightboxBody) {
					// scroll any content inside the lightbox back to top
					this.$refs.kvLightboxBody.scrollTop = 0;
				}

				// remove scroll lock class from body
				this.unlockScroll();

				// listen for this event in parent components
				// it gives notice of the lightbox being closed internally
				this.$emit('lightbox-closed');
				this.isShown = false;
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-lightbox {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	z-index: 1500;
	background: rgba(72, 72, 72, 0.6);
	font-size: 1rem;

	@include breakpoint(medium) {
		padding: 4.5rem 1rem;
	}

	&__focus-lock {
		max-width: 100%;
		max-height: 100%;
		display: flex;
		overflow: hidden;

		// dynamically added div from vue-focus-lock
		::v-deep > [data-lock] {
			width: 100%;
		}
	}

	&__container {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 1.5rem;
		max-height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		&:focus {
			outline: 0; // safe(?), since JavaScript is the only way to focus on this el.
		}

		@include breakpoint(medium) {
			position: relative;
			padding: 2.8125rem;
			border-radius: rem-calc(4);
			max-width: rem-calc(900);
		}
	}

	// layout
	&__header {
		flex-shrink: 0;
	}

	&__body {
		flex: 1;
		flex: 0 1 auto; // ie11
		overflow: auto;
		position: relative;
		// set a negative margin + padding to push the scrollbar to edge of the dialog.
		margin: 0 -1.5rem;
		padding: 0 1.5rem;

		@include breakpoint(medium) {
			margin: 0 -2.8125rem;
			padding: 0 2.8125rem;
		}
	}

	&__body-row,
	&__body-columns {
		// gives lightbox content foundation grids the correct margins
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
	}

	&__controls {
		flex-shrink: 0;
		margin-top: 1rem;

		::v-deep button {
			margin-bottom: 0;
		}
	}

	// content
	&__title {
		color: inherit;
		color: var(--kv-lightbox-title-color, inherit);
		padding-right: 1.5rem;
	}

	&__close-btn-icon {
		height: 1.5rem;
		width: 1.5rem;
		fill: $subtle-gray;
		transition: fill 0.16s linear;
	}

	&__close-btn {
		width: 2.5rem;
		height: 2.5rem;
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			.kv-lightbox__close-btn-icon {
				fill: $charcoal;
			}
		}
	}

	// modifiers
	&--no-padding-top {
		.kv-lightbox__container {
			padding-top: 0;
		}
	}

	&--no-padding-bottom {
		.kv-lightbox__container {
			padding-bottom: 0;
		}
	}

	&--no-padding-sides {
		.kv-lightbox__container {
			padding-left: 0;
			padding-right: 0;
		}

		.kv-lightbox__body {
			margin-left: 0;
			margin-right: 0;
			padding-left: 0;
			padding-right: 0;
		}
	}

	&--inverted {
		background: rgba(0, 0, 0, 0.9);

		.kv-lightbox__container {
			background: transparent;
			color: $white;
			font-weight: normal;
		}

		.kv-lightbox__content {
			background: transparent;
		}

		.kv-lightbox__close-btn-icon { /* stylelint-disable-line */
			fill: $kiva-green;
		}

		.kv-lightbox__close-btn {
			&:hover {
				.kv-lightbox__close-btn-icon {
					fill: $kiva-accent-green;
				}
			}
		}
	}
}
</style>

<style lang="scss">
// only show the contents of the lighbox when printing
body.lightbox-open {
	@media print {
		* {
			visibility: hidden !important;
			overflow: hidden !important;
		}

		.kv-lightbox * {
			visibility: visible !important;
			overflow: unset !important;
		}
	}
}
</style>
