<template>
	<figure
		class="pie-chart tw-flex tw-items-center tw-justify-center tw-gap-2"
		@mouseleave="activeSlice = null"
	>
		<!-- pie chart -->
		<div class="tw-relative tw-h-full">
			<div v-if="loading" class="pie-placeholder tw-h-full tw-p-2.5">
				<div class="tw-overflow-hidden tw-rounded-full tw-h-full">
					<kv-loading-placeholder />
				</div>
			</div>
			<svg
				v-else
				class="tw-h-full"
				viewBox="0 0 32 32"
				xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<path
					v-for="(slice, index) in slices"
					:key="index"
					class="tw-origin-center tw-transition-transform"
					:style="activeSlice === slice ? { transform: 'scale(1.1)' } : {}"
					:d="slice.path"
					:stroke="slice.color"
					:stroke-width="lineWidth"
					fill="none"
					@mouseenter="activeSlice = slice"
					@click="activeSlice = slice"
				/>
			</svg>
			<!-- active slice -->
			<div
				v-if="activeSlice"
				class="
					tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2
					tw-flex tw-flex-col tw-items-center tw-text-center"
				style="max-width: 8.5rem;"
			>
				<div class="tw-font-medium tw-line-clamp-4">
					{{ activeSlice.label }}
				</div>
				<div>
					{{ activeSlice.value }} ({{ activeSlicePercent }})
				</div>
			</div>
		</div>
		<!-- key -->
		<div style="width: 12rem; height: 85%;" class="tw-flex tw-flex-col tw-justify-between">
			<ol>
				<li
					v-for="(slice, index) in slices.slice(pageIndex * slicesPerPage, (pageIndex + 1) * slicesPerPage)"
					:key="index"
					@mouseenter="activeSlice = slice"
					@click="activeSlice = slice"
					class="tw-flex tw-items-center"
				>
					<div
						class="tw-w-2 tw-h-2 tw-mr-1 tw-rounded-full tw-flex-none"
						:style="{ backgroundColor: slice.color }"
					></div>
					<span class="tw-truncate">
						{{ slice.label }}
					</span>
				</li>
			</ol>
			<!-- paging controls -->
			<div v-if="pageCount > 1">
				<button
					:disabled="pageIndex === 0"
					class="tw-font-medium tw-p-0.5 disabled:tw-opacity-low"
					@click="prevPage"
				>
					&lt;
				</button>
				{{ pageIndex + 1 }} / {{ pageCount }}
				<button
					:disabled="pageIndex === pageCount - 1"
					class="tw-font-medium tw-p-0.5 disabled:tw-opacity-low"
					@click="nextPage"
				>
					&gt;
				</button>
			</div>
		</div>
	</figure>
</template>

<script>
import numeral from 'numeral';
import Alea from '#src/util/experiment/Alea';
import KvLoadingPlaceholder from '@kiva/kv-components/vue/KvLoadingPlaceholder';

// convenience function to get point on circumference of a given circle (from https://codepen.io/grieve/pen/xwGMJp)
function circumPointFromAngle(cx, cy, r, a) {
	return [
		cx + r * Math.cos(a),
		cy + r * Math.sin(a)
	];
}

export default {
	name: 'PieChartFigure',
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
		values: {
			type: Array,
			default: () => ([]),
		},
	},
	components: {
		KvLoadingPlaceholder,
	},
	data() {
		return {
			svgSize: 32,
			lineWidth: 5,
			activeSlice: null,
			pageIndex: 0,
			slicesPerPage: 10,
		};
	},
	computed: {
		activeSlicePercent() {
			return this.activeSlice ? numeral(this.activeSlice.percent).format('0.00%') : '';
		},
		radius() {
			return (this.svgSize / 2) - (this.lineWidth / 2) - 2;
		},
		center() {
			return this.svgSize / 2;
		},
		slices() {
			const slices = [];
			// center point
			const cX = this.center;
			const cY = cX;
			// radius
			const r = this.radius;
			// starting angle
			let start = -0.25;
			// loop through each value and create a pie slice path
			for (let i = 0; i < this.values.length; i += 1) {
				const value = this.values[i];
				const end = start + value.percent;
				const [startX, startY] = circumPointFromAngle(cX, cY, r, start * Math.PI * 2);
				const [endX, endY] = circumPointFromAngle(cX, cY, r, end * Math.PI * 2);
				const largeArc = value.percent > 0.5 ? 1 : 0;
				// Draw just the outer arc of the slice
				const path = `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
				slices.push({
					...value,
					path,
					color: this.pickColor(i),
				});
				start = end;
			}
			return slices;
		},
		pageCount() {
			return Math.ceil(this.slices.length / this.slicesPerPage);
		},
	},
	methods: {
		pickColor(index) {
			const rng = new Alea('loans', index, 'kiva');
			let color = '#';
			for (let i = 0; i < 3; i += 1) {
				color += Math.floor(rng() * 256).toString(16).padStart(2, '0');
			}
			return color;
		},
		prevPage() {
			if (this.pageIndex > 0) {
				this.pageIndex -= 1;
			}
		},
		nextPage() {
			if (this.pageIndex < this.pageCount - 1) {
				this.pageIndex += 1;
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.pie-chart {
	height: 20rem;
}

.pie-placeholder {
	width: 20rem;
}
</style>
