<template>
	<div
		v-show="isShown"
		class="lightbox-wrap"
		:class="{'inverted': inverted}"
		ref="kvlightbox"
		@keyup.esc="closeLightbox"
		@click.stop.prevent="closeLightbox"
		role="dialog"
		:aria-labelledby="title ? 'lightbox-title' : null"
	>
		<focus-lock :disabled="!isShown">
			<div
				class="lightbox"
				role="document"
			>
				<div
					class="lightbox-container"
					@click.stop
				>
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
					<div class="lightbox-body-wrap" ref="content">
						<div class="lightbox-body">
							<slot>Lightbox content</slot>
						</div>
					</div>
					<div class="lightbox-controls">
						<slot name="controls"></slot>
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
	name: '15YearsLightbox',
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
					this.resetContentScroll();
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
		resetContentScroll() {
			this.$refs.content.scrollTop = 0;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.lightbox-wrap {
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	overflow-y: auto;
	z-index: 1500;
	max-height: 100vh;
	background: $tomato;
	color: #fff;
}

.lightbox {
	z-index: 1502;
}

.lightbox-container {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
}

.lightbox-body-wrap {
	flex: 1 1 auto; // IE11;
	height: 100%;
	overflow: auto;
	position: relative;

	&::after {
		content: '';
		display: block;
		position: sticky;
		height: rem-calc(100);
		bottom: 0;
		width: 100%;
		background: linear-gradient(to bottom, rgba($tomato, 0), rgba($tomato, 1));
		pointer-events: none;
	}
}

.lightbox-body {
	padding: 0 rem-calc(23) rem-calc(23);

	@include breakpoint('large') {
		padding: 0 rem-calc(71) rem-calc(23);
	}
}

.lightbox-controls,
.lightbox-header {
	padding: rem-calc(23);
	flex-shrink: 0;

	@include breakpoint('large') {
		padding: rem-calc(23) rem-calc(71);
	}
}

.lightbox-header {
	display: flex;
	border-bottom: rem-calc(1) solid $offwhite;
}

.lightbox-controls {
	border-top: rem-calc(1) solid $offwhite;
}

.lightbox-title {
	padding-right: 1rem;
	flex: 1 0 auto; // IE11;
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

</style>
