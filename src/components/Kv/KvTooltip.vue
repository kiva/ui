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
		<div class="tooltip-arrow" x-arrow=""></div>
	</kv-popper>
</template>

<script>
import KvPopper from '@/components/Kv/KvPopper';

export default {
	components: {
		KvPopper
	},
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

$arrow-border-width: rem-calc(14);

.tooltip-pane {
	position: absolute;
	background: $aqua-light-green;
	border-radius: rem-calc(3);
	box-shadow: 0 2px 0 rgba(196, 231, 219, 0.8);
	border: 1px solid $aqua-medium-green;
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
	margin: $arrow-border-width;
	border-color: $aqua-medium-green;
}

.tooltip-pane[x-placement^="top"] {
	margin-bottom: $arrow-border-width;
}

.tooltip-pane[x-placement^="top"] .tooltip-arrow {
	border-width: $arrow-border-width $arrow-border-width 0 $arrow-border-width;
	border-left-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	bottom: -$arrow-border-width;
	left: calc(50% - #{$arrow-border-width});
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-pane[x-placement^="bottom"] {
	margin-top: $arrow-border-width;
}

.tooltip-pane[x-placement^="bottom"] .tooltip-arrow {
	border-width: 0 $arrow-border-width $arrow-border-width $arrow-border-width;
	border-left-color: transparent;
	border-right-color: transparent;
	border-top-color: transparent;
	top: -$arrow-border-width;
	left: calc(50% - #{$arrow-border-width});
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-pane[x-placement^="right"] {
	margin-left: $arrow-border-width;
}

.tooltip-pane[x-placement^="right"] .tooltip-arrow {
	border-width: $arrow-border-width $arrow-border-width $arrow-border-width 0;
	border-left-color: transparent;
	border-top-color: transparent;
	border-bottom-color: transparent;
	left: -$arrow-border-width;
	top: calc(50% - #{$arrow-border-width});
	margin-left: 0;
	margin-right: 0;
}

.tooltip-pane[x-placement^="left"] {
	margin-right: $arrow-border-width;
}

.tooltip-pane[x-placement^="left"] .tooltip-arrow {
	border-width: $arrow-border-width 0 $arrow-border-width $arrow-border-width;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	right: -$arrow-border-width;
	top: calc(50% - #{$arrow-border-width});
	margin-left: 0;
	margin-right: 0;
}
</style>
