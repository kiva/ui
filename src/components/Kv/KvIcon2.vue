<template>
	<div>
		<component
			:is="iconFile"
			:class="`icon icon-${name}`"
		/>
		<span v-if="title" class="visually-hidden">{{ title }}</span>
	</div>
</template>
<script>
/* eslint-disable max-len */
/**
 * Use KvIcon to display an inlined-svg from /assets/inline-svgs/icons on the page.
 * SVG files should only be one color so they can be styled using CSS fill property: `.my-icon { fill: pink; }`
 * Icons will fill the width of it's container. You can set the width with CSS: `.my-icon { width: 5rem; fill: pink; }`
 * If your SVG file is multi-colored or complex, consider moving it outside of the icons directory and importing it directly as an inline-svg or use an img tag.
 * A nice tool to clean up code before saving to the inline-svg directory is https://jakearchibald.github.io/svgomg/
 */
/* eslint-enable max-len */
export default {
	props: {
		/**
		 * The name of the svg file located in the /assets/inline-svgs/icons/ directory without the .svg suffix.
		 * e.g., 'question-mark' maps to '/assets/inline-svgs/icons/question-mark.svg'
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
		}
	},
	computed: {
		iconFile() {
			return () => import(`@/assets/inline-svgs/icons/${this.name}.svg`);
		}
	}
};
</script>
<style lang="scss" scoped>
@import 'settings';

.icon {
	backface-visibility: hidden;
}

.visually-hidden {
	@include visually-hidden();
}
</style>
