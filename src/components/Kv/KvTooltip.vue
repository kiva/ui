<template>
	<kv-theme-provider :theme="themeStyle" class="kv-tailwind">
		<kv-popper
			:controller="controller"
			:popper-modifiers="popperModifiers"
			popper-placement="top"
			transition-type="kvfastfade"
			class="tooltip-pane tw-absolute tw-bg-primary tw-rounded tw-z-popover"
		>
			<div class="tw-p-2.5" style="max-width: 250px;">
				<div class="tw-text-primary tw-font-medium tw-mb-1.5" v-if="this.$slots.title">
					<slot name="title"></slot>
				</div>
				<div class="tw-text-primary">
					<slot></slot>
				</div>
			</div>
			<div class="tooltip-arrow tw-absolute tw-w-0 tw-h-0 tw-border-solid" x-arrow=""></div>
		</kv-popper>
	</kv-theme-provider>
</template>

<script>
import KvPopper from '@/components/Kv/KvPopper';
import {
	darkTheme,
	mintTheme
} from '~/@kiva/kv-tokens/configs/kivaColors.cjs';
import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';

export default {
	name: 'KvTooltip',
	components: {
		KvPopper,
		KvThemeProvider
	},
	// TODO: Add prop for tooltip placement, Currently defaults to 'top' but will flip to bottom when constrained
	props: {
		controller: {
			validator(value) {
				if (typeof value === 'string') return true;
				if (typeof window !== 'undefined'
					&& 'HTMLElement' in window
					&& value instanceof HTMLElement) return true;
				return false;
			},
			required: true,
		},
		theme: {
			type: String,
			default: 'default',
			validator(value) {
				// The value must match one of these strings
				return ['default', 'mint', 'dark'].indexOf(value) !== -1;
			}
		},
	},
	data() {
		return {
			darkTheme,
			mintTheme,
			popperModifiers: {
				preventOverflow: {
					padding: 10,
				}
			}
		};
	},
	computed: {
		themeStyle() {
			const themeMapper = {
				mint: mintTheme,
				dark: darkTheme
			};
			return themeMapper[this.theme];
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$arrow-width: 8;
$outer-arrow-width: rem-calc($arrow-width);
$inner-arrow-width: rem-calc($arrow-width - 2);
$inner-arrow-offset: rem-calc($arrow-width - 1);
$border-color: var(--bg-primary);

.tooltip-pane,
.tooltip-arrow {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tooltip-arrow {
	margin: $outer-arrow-width;
	border-color: rgba($border-color);
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
