<template>
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
				class="kv-lightbox row"
				role="document"
			>
				<div
					class="lightbox-content columns"
					@click.stop
				>
					<div class="section">
						<div class="lightbox-header">
							<strong
								class="lightbox-title"
								id="lightbox-title"
							>
								{{ title }}
							</strong>
							<button
								@click.stop.prevent="closeLightbox"
								class="lightbox-close-btn"
								aria-label="Close"
							>
								<kv-icon class="icon-small-x" name="small-x" :from-sprite="true" />
							</button>
						</div>
						<div class="lightbox-body">
							<slot>Lightbox content</slot>
						</div>
						<div class="lightbox-controls">
							<slot name="controls"></slot>
						</div>
					</div>
				</div>
			</div>
		</focus-lock>
	</div>
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
@import 'components/15-years/15-years';

.kv-lightbox-wrap {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	z-index: 1500;
	max-height: 100vh;
	background: $tomato;
	color: #fff;

	.kv-lightbox {
		z-index: 1502;

		.lightbox-content {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			display: flex;
			flex-direction: column;
		}

		.lightbox-body {
			flex: 1;
			overflow: auto;
		}

		.lightbox-controls,
		.lightbox-header {
			flex-shrink: 0;
		}

		.lightbox-header {
			display: flex;
		}

		.lightbox-title {
			padding-right: 1rem;
			flex: 1;
		}

		.lightbox-close-btn {
			flex-shrink: 0;

			.icon-small-x {
				height: 1.5rem;
				width: 1.5rem;
				fill: $offwhite;
				transition: fill 0.16s linear;
			}

			&:hover {
				.icon-small-x {
					fill: #fff;
				}
			}
		}
	}
}
</style>
