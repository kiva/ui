<template>
	<section
		class="tw-h-full"
		:class="themeClass"
		v-if="hasBackgroundImage"
	>
		<kv-contentful-img
			class="tw-h-full tw-object-cover"
			:width="520"
			fallback-format="jpg"
			:contentful-src="backgroundImage.url"
			:alt="backgroundImage.description"
		/>
		<p class="story-card__imageCard-title tw-text-h4">
			{{ backgroundImage.title }}
		</p>
	</section>

	<section
		class="
			story-card
			tw-h-full
			tw-bg-brand-200
			tw-text-primary
			tw-flex
			tw-flex-col
			tw-justify-between
			tw-items-center
			tw-p-6
		"
		:class="themeClass"
		v-else
	>
		<p class="tw-text-center tw-text-h4">
			{{ kickerHeadline }}
		</p>
		<dynamic-rich-text
			class="story-card__content tw-text-center tw-h-full"
			:html="cardContent"
		/>
		<dynamic-rich-text class="tw-text-center" :html="footer" />
	</section>
</template>

<script>
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

/**
* Story Card Component
* */

export default {
	components: {
		DynamicRichText,
		KvContentfulImg
	},
	props: {
		/**
		 * Content group content from Contentful
		* */
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		theme() {
			return this.content?.theme ?? '';
		},
		themeClass() {
			return `story-card__${this.content?.theme}`;
		},
		footer() {
			const text = this.content?.footer ?? '';
			return text ? richTextRenderer(text) : '';
		},
		cardContent() {
			const text = this.content?.cardContent ?? '';
			return text ? richTextRenderer(text) : '';
		},
		kickerHeadline() {
			return this.content?.kickerHeadline ?? '';
		},
		backgroundImage() {
			return {
				description: this.content?.backgroundMedia?.description ?? '',
				title: this.content?.backgroundMedia?.title ?? '',
				url: this.content?.backgroundMedia?.file?.url ?? ''
			};
		},
		hasBackgroundImage() {
			return this.content?.backgroundMedia?.file?.contentType.includes('image');
		},
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	.story-card,
	.story-card__imageCard {
		aspect-ratio: 4 / 5;
		border-radius: 2.5rem;
		min-height: 550px;
		overflow: hidden;
		padding: 2.5rem 1.25rem;
		@include breakpoint(medium) {
			padding: 2.5rem;
		}
		@include breakpoint(large) {
			padding: 3rem;
		}
	}

	.story-card__imageCard {
		overflow: hidden;
		padding: 0;
		position: relative;
	}

	.story-card__imageCard >>> .kv-contentful-img::after,
	.story-card__imageCard-title {
		bottom: 0.5rem;
		color: #fff;
		content: "";
		position: absolute;
		right: 1rem;
		text-transform: uppercase;
	}

	.story-card__imageCard >>> .kv-contentful-img::after {
		background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
		bottom: 0;
		content: "";
		height: 5rem;
		left: 0;
		position: absolute;
		right: 0;
	}

	.story-card__imageCard-title {
		bottom: 2rem;
		position: absolute;
		right: 2rem;
	}

	// Override default prose layout
	.story-card__content >>> .tw-prose {
		align-items: center;
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
	}
	// Theme overrides. TODO(dew): coord with Ryan to use kivaThemes
	.story-card__kivaClassicLight {
		background: #fff;
	}

	.story-card__kivaClassicMint {
		background: #95D4B3;
	}

	.story-card__kivaClassicLight >>> .tw-prose h2,
	.story-card__kivaClassicLight >>> .tw-prose h3,
	.story-card__kivaClassicDark >>> .tw-prose h2,
	.story-card__kivaClassicDark >>> .tw-prose h3 {
		color: #212121;
	}

	.story-card__kivaClassicLight path,
	.story-card__kivaClassicMint path {
		stroke: #fff;
	}

	.story-card__kivaClassicGreen {
		background: #2aa967;
	}

	.story-card__kivaClassicDark {
		background: #212121;
	}

	.story-card__kivaClassicGreen >>> .tw-prose h2,
	.story-card__kivaClassicGreen >>> .tw-prose h3,
	.story-card__kivaClassicDark >>> .tw-prose h2,
	.story-card__kivaClassicDark >>> .tw-prose h3 {
		color: #fff;
	}

	.story-card__kivaClassicGreen path,
	.story-card__kivaClassicDark path {
		stroke: #212121;
	}

	// SVG Alignment Circle and underline positioning
	.story-card u {
		display: inline-block;
		position: relative;
		text-decoration: none;
	}

	.story-card u svg {
		bottom: -5px;
		left: -2px;
		position: absolute;
		right: -2px;
		width: calc(100% + 4px);
	}

	.story-card u path {
		fill: transparent;
		stroke-linecap: round;
		stroke-width: 4;
		vector-effect: non-scaling-stroke;
	}

</style>
