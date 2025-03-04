<template>
	<span class="tw-inline-flex tw-max-h-full">
		<template v-if="fromSprite">
			<svg
				:class="`tw-max-h-full tw-max-w-full tw-flex-1 icon-${name}`"
				style="backface-visibility: hidden;"
			>
				<title v-if="title">{{ title }}</title>
				<use :xlink:href="`#icon-${name}`" />
			</svg>
		</template>
		<template v-else>
			<component
				:is="iconFile"
				:class="`tw-max-h-full tw-max-w-full tw-flex-1 icon-${name}`"
				style="backface-visibility: hidden;"
			/>
			<span v-if="title" class="tw-sr-only">{{ title }}</span>
		</template>
	</span>
</template>
<script>
import { defineAsyncComponent } from 'vue';

/* eslint-disable max-len */
/**
 * Use KvIcon to display an inlined-svg from /assets/icons/inline on the page, or from the sprite at /assets/icons/sprite.
 * Icons can be colored using CSS fill property: `.my-icon { fill: pink; }`
 * Icons will fill the width of it's container. You can set the width with CSS: `.my-icon { width: 5rem; fill: pink; }`
 * If your SVG file is multi-colored or complex, consider moving it outside of the icons directory and importing it directly as an inline-svg or use an img tag.
 * A nice tool to clean up code before saving to the icons/inline directory is https://jakearchibald.github.io/svgomg/. Toggle "Prefer viewbox to width/height" on.
 */
/* eslint-enable max-len */
export default {
	name: 'KvIcon',
	props: {
		/**
		 * The name of the svg file without the .svg suffix.
		 * e.g., 'question' maps to '/assets/icons/inline/question.svg'
		* */
		name: {
			type: String,
			required: true
		},
		/**
		 * The text read to assistive technology but not shown on the screen.
		 * Use when there is no text describing the icon, like if the icon is the only content of a button.
		* */
		title: {
			type: String,
			default: ''
		},
		fromSprite: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		iconFile() {
			return defineAsyncComponent(() => import(`#src/assets/icons/inline/${this.name}.svg`));
		}
	}
};
</script>
