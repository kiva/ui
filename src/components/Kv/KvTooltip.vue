<template>
	<kv-popper
		:controller="controller"
		:popper-modifiers="popperModifiers"
		popper-placement="top"
		transition-type="kvfastfade"
		class="tooltip-pane">
		<div class="tooltip-content">
			<div class="title-slot">
				<slot name="title"></slot>
			</div>
			<div class="default-slot">
				<slot></slot>
			</div>
		</div>
		<div class="tooltip-arrow" x-arrow=""><div class="tooltip-inner-arrow"></div></div>
	</kv-popper>
</template>

<script>
import KvPopper from '@/components/Kv/KvPopper';

export default {
	components: {
		KvPopper
	},
	// TODO: Add prop for tooltip placement, Currently defaults to 'top' but will flip to bottom when constrained
	props: {
		controller: { type: String, required: true },
	},
	data() {
		return {
			popperModifiers: {
				preventOverflow: {
					padding: 10,
				}
			}
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$tooltip-border-width: 1;
$arrow-width: 14;
$outer-arrow-width: rem-calc($arrow-width);
$inner-arrow-width: rem-calc($arrow-width - 2);
$inner-arrow-offset: rem-calc($arrow-width - 1);

.tooltip-pane {
	position: absolute;
	background: $aqua-light-green;
	border-radius: rem-calc(3);
	box-shadow: 0 2px 0 rgba(196, 231, 219, 0.8);
	border: #{$tooltip-border-width}px solid $aqua-medium-green;
}

.tooltip-content {
	padding: 1rem;
	max-width: rem-calc(250);
	line-height: 1.4;
}

.tooltip-content .title-slot {
	font-weight: 800;
	margin-bottom: 0.75rem;
}

.tooltip-arrow {
	width: 0;
	height: 0;
	border-style: solid;
	position: absolute;
	margin: $outer-arrow-width;
	border-color: $aqua-medium-green;
}

.tooltip-inner-arrow {
	width: 0;
	height: 0;
	border-style: solid;
	position: absolute;
	margin: $outer-arrow-width;
	border-color: $aqua-light-green;
}

/* Top Tooltip Arrow appears on Bottom */
.tooltip-pane[x-placement^="top"] {
	margin-bottom: $outer-arrow-width;
}

.tooltip-pane[x-placement^="top"] .tooltip-arrow {
	border-width: $outer-arrow-width $outer-arrow-width 0 $outer-arrow-width;
	border-left-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	bottom: -$outer-arrow-width;
	left: calc(50% - #{$outer-arrow-width});
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-pane[x-placement^="top"] .tooltip-inner-arrow {
	border-width: $inner-arrow-width $inner-arrow-width 0 $inner-arrow-width;
	border-left-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	bottom: calc(#{$tooltip-border-width} * 4px);
	left: calc(-#{$inner-arrow-offset} * 2);
	margin-top: 0;
	margin-bottom: 0;
}

/* Bottom Tooltip Arrow appears on Top */
.tooltip-pane[x-placement^="bottom"] {
	margin-top: $outer-arrow-width;
}

.tooltip-pane[x-placement^="bottom"] .tooltip-arrow {
	border-width: 0 $outer-arrow-width $outer-arrow-width $outer-arrow-width;
	border-left-color: transparent;
	border-right-color: transparent;
	border-top-color: transparent;
	top: -$outer-arrow-width;
	left: calc(50% - #{$outer-arrow-width});
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-pane[x-placement^="bottom"] .tooltip-inner-arrow {
	border-width: 0 $inner-arrow-width $inner-arrow-width $inner-arrow-width;
	border-left-color: transparent;
	border-right-color: transparent;
	border-top-color: transparent;
	top: calc(#{$tooltip-border-width} * 2px);
	left: calc(-#{$inner-arrow-offset} * 2);
	margin-top: 0;
	margin-bottom: 0;
}

/* TODO: TWEAK Inner Arrow Styles for Left + Right Orientations */

/* Right Side Tooltip, Arrow appears on Left */
.tooltip-pane[x-placement^="right"] {
	margin-left: $outer-arrow-width;
}

.tooltip-pane[x-placement^="right"] .tooltip-arrow {
	border-width: $outer-arrow-width $outer-arrow-width $outer-arrow-width 0;
	border-left-color: transparent;
	border-top-color: transparent;
	border-bottom-color: transparent;
	left: -$outer-arrow-width;
	top: calc(50% - #{$outer-arrow-width});
	margin-left: 0;
	margin-right: 0;
}

/* Left Side Tooltip, Arrow appears on Right */
.tooltip-pane[x-placement^="left"] {
	margin-right: $outer-arrow-width;
}

.tooltip-pane[x-placement^="left"] .tooltip-arrow {
	border-width: $outer-arrow-width 0 $outer-arrow-width $outer-arrow-width;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	right: -$outer-arrow-width;
	top: calc(50% - #{$outer-arrow-width});
	margin-left: 0;
	margin-right: 0;
}
</style>
