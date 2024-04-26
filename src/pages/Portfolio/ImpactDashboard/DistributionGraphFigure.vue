<template>
	<figure class="distribution-figure tw-relative">
		<!-- treemap -->
		<div
			v-for="(block, index) in blocks"
			:key="`block-${index}`"
			class="tw-absolute"
			:style="blockPositionStyles(block)"
		>
			<kv-loading-placeholder v-if="loading" style="width: calc(100% - 0.25rem); height: calc(100% - 0.25rem);" />
			<p
				v-if="!loading"
				class="tw-rounded-sm tw-box-border tw-overflow-hidden tw-text-small"
				:class="colorClasses(index)"
				style="width: calc(100% - 0.25rem); height: calc(100% - 0.25rem);"
				@mouseenter="setHoverBlock(block)"
			>
				<span class="tw-block tw-px-1 tw-py-0.5 tw-truncate">
					{{ block.data.label }} {{ block.data.percent }}
				</span>
			</p>
		</div>
		<!-- tooltip -->
		<div
			ref="tooltipController"
			class="tw-absolute"
			:style="blockPositionStyles(activeBlock)"
		></div>
		<kv-tooltip
			v-if="!loading && tooltipControllerElement"
			:controller="tooltipControllerElement"
		>
			<template #title>
				{{ activeBlock.data.label }}
			</template>
			{{ activeBlock.data.value }} ({{ activeBlock.data.percent }})
		</kv-tooltip>
	</figure>
</template>

<script>
import _throttle from 'lodash/throttle';
import numeral from 'numeral';
import { getTreemap } from 'treemap-squarify';
import KvTooltip from '@/components/Kv/KvTooltip';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import kvTokensPrimitives from '~/@kiva/kv-tokens/primitives.json';

const { breakpoints } = kvTokensPrimitives;

export default {
	name: 'DistributionGraphFigure',
	inject: ['apollo'],
	components: {
		KvLoadingPlaceholder,
		KvTooltip,
	},
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
		values: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			screenWidth: 0,
			activeBlock: { data: {} },
		};
	},
	computed: {
		activeBreakpoints() {
			return Object.keys(breakpoints)
				.filter(name => this.screenWidth >= breakpoints[name]);
		},
		// Used to determine if blocks should be displayed in landscape or portrait orientation
		aboveMedium() {
			return this.activeBreakpoints.includes('md');
		},
		// Calculate the blocks of the treemap, but don't apply any formatting
		rawBlocks() {
			// Use static blocks when no data is available (either loading or no loans)
			if (!this.values?.length) {
				return this.loading ? [
					{
						x: 0, y: 0, width: 60, height: 40
					},
					{ x: 60, y: 0, height: 40 },
					{ x: 0, y: 40, width: 30 },
					{ x: 30, y: 40 },
				] : [
					{ x: 0, y: 0, data: { label: 'No loans yet' } }
				];
			}

			// Calculate treemap blocks using canvas size 100x100 to easily translate to percentages
			const blocks = getTreemap({
				data: this.values,
				width: 100,
				height: 100,
			});

			// Blocks smaller than 8% in either dimension will not display well,
			// so combine them into one large 'Other' block
			// If we only have 1 small block though, don't make the 'Other' block
			const tooSmall = blocks.filter(block => block.width <= 8 || block.height <= 8);
			if (tooSmall.length === 1) return blocks;

			const bigBlocks = blocks.filter(block => block.width > 8 && block.height > 8);
			return [...bigBlocks, this.reduceBlocks(tooSmall)];
		},
		// This is the array that is iterated over in the template
		blocks() {
			return this.rawBlocks.map(block => {
				const {
					data, x, y, width, height
				} = block ?? {};
				const { percent } = data ?? {};

				return {
					data: {
						...data,
						percent: numeral(percent).format('0[.]0%'),
					},
					// flip x/y when going between small (portrait) and medium (landscape) screens
					x: this.aboveMedium ? x : y,
					y: this.aboveMedium ? y : x,
					width: this.aboveMedium ? width : height,
					height: this.aboveMedium ? height : width,
				};
			});
		},
		// Used by KvTooltip/KvPopper to position the tooltip
		tooltipControllerElement() {
			return this.$refs?.tooltipController;
		}
	},
	methods: {
		// Used by the p elements in the main v-for loop to determine background and text color
		colorClasses(index) {
			const classes = [];
			const total = this.blocks?.length ?? 1;

			// background
			const size = (10 - Math.round((index / total) * 9)) * 100;
			classes.push(size === 600 ? 'tw-bg-brand' : `tw-bg-brand-${size}`);

			// text
			classes.push(size > 700 ? 'tw-text-white' : 'tw-text-black');

			return classes;
		},
		// Used by the divs in the main v-for for block positions and the tooltip controller div to match positions
		// with the current active block
		blockPositionStyles(block) {
			return {
				left: `${block.x}%`,
				top: `${block.y}%`,
				width: block.width ? `${block.width}%` : null,
				height: block.height ? `${block.height}%` : null,
				right: block.width ? null : '0',
				bottom: block.height ? null : '0',
			};
		},
		// Combine all small blocks into a single 'Other' block that will be at the bottom right of the figure.
		reduceBlocks(blocks) {
			return blocks?.reduce((other, block) => {
				/* eslint-disable no-param-reassign */
				// Use the smallest x for the overall x
				if (block.x < other.x) {
					other.x = block.x;
				}
				// Use the smallest y for the overall y
				if (block.y < other.y) {
					other.y = block.y;
				}
				// Sum up all values and percents
				other.data.value += block.data.value;
				other.data.percent += block.data.percent;
				return other;
				/* eslint-ensable no-param-reassign */
			}, {
				x: 100,
				y: 100,
				width: 0,
				height: 0,
				data: {
					label: 'Other',
					value: 0,
					percent: 0,
				},
			}) ?? [];
		},
		// Sets the block that will be used to position the tooltip and change the info displayed in the tooltip
		setHoverBlock(block) {
			this.activeBlock = block;
		},
	},
	mounted() {
		this.screenWidth = window.innerWidth;
		window.addEventListener('resize', _throttle(() => {
			this.screenWidth = window.innerWidth;
		}, 200));
	},
};
</script>

<style lang="postcss" scoped>
.distribution-figure {
	height: 30rem;

	/* account for every block having a 0.25rem right margin */
	width: calc(100% + 0.25rem);
	margin-right: -0.25rem;
}

@screen md {
	.distribution-figure {
		height: 20rem;
	}
}
</style>
