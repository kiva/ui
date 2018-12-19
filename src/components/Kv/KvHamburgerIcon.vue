<template>
	<div
		class="hamburger-menu"
		:class="{open}"
		:style="containerStyle"
	>
		<div class="layer top" :style="layerStyle"></div>
		<div class="layer middle" :style="layerStyle"></div>
		<div class="layer bottom" :style="layerStyle"></div>
	</div>
</template>

<script>
export default {
	props: {
		open: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: '',
		},
		width: {
			type: String,
			default: '2.125rem',
		},
	},
	data() {
		return {
			layerStyle: {
				backgroundColor: this.color,
			},
			containerStyle: {
				width: this.width,
			},
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.hamburger-menu {
	$hamburger-transition-timing: 0.16s ease;

	display: inline-block;
	cursor: pointer;

	.layer {
		width: 100%;
		height: rem-calc(3);
		background-color: $dark-charcoal;
		margin: rem-calc(4) 0;
		border-radius: 2px;

		&:first-child {
			margin-top: 0;
		}

		&:last-child {
			margin-bottom: 0;
		}
	}

	.top,
	.bottom {
		transition: transform $hamburger-transition-timing;
	}

	.middle {
		transition: opacity $hamburger-transition-timing;
	}

	&.open {
		.top {
			transform: rotate(-45deg) translate(rem-calc(-5), rem-calc(5));
		}

		.middle {
			opacity: 0;
		}

		.bottom {
			transform: rotate(45deg) translate(rem-calc(-5), rem-calc(-5));
		}
	}
}
</style>
