<template>
	<kv-theme-provider :theme="theme">
		<div
			class="
				overflow-hidden
				tw-h-full
			"
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
		</div>

		<div
			class="
				story-card
				tw-bg-primary
				tw-flex
				tw-flex-col
				tw-h-full
				tw-justify-between
				tw-items-center
				overflow-hidden
				tw-text-primary
				tw-px-4
				tw-py-4
				md:tw-py-8
				md:tw-px-5
				sm:tw-px-2
				sm:tw-py-2
			"
			:class="themeClass"
			v-else
		>
			<dynamic-rich-text
				class="tw-text-center tw-text-h4 tw-text-action"
				:html="cardTitle"
			/>
			<dynamic-rich-text
				class="story-card__content tw-text-center tw-h-full"
				:html="cardContent"
			/>
			<dynamic-rich-text class="tw-text-center" :html="footer" />
		</div>
	</kv-theme-provider>
</template>

<script>
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import DynamicRichText from '@/components/Contentful/DynamicRichText';
import {
	darkTheme,
	darkGreenTheme,
	mintTheme,
	defaultTheme
} from '~/@kiva/kv-tokens/configs/kivaColors';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';
/**
* Story Card Component
* */
export default {
	components: {
		DynamicRichText,
		KvContentfulImg,
		KvThemeProvider
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
	data() {
		return {};
	},
	computed: {
		theme() {
			const themeMapper = {
				kivaCLassicLight: defaultTheme,
				kivaClassicMint: mintTheme,
				kivaClassicGreen: darkGreenTheme,
				kivaClassicDark: darkTheme,
				imageCard: darkTheme
			};
			return themeMapper[this.content?.theme] ?? defaultTheme;
		},
		themeClass() {
			return `story-card__${this.content?.theme}`;
		},
		cardTitle() {
			const text = this.content?.cardTitle ?? '';
			return text ? richTextRenderer(text) : '';
		},
		cardContent() {
			const text = this.content?.cardContent ?? '';
			return text ? richTextRenderer(text) : '';
		},
		footer() {
			const text = this.content?.footer ?? '';
			return text ? richTextRenderer(text) : '';
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

<!-- eslint-disable max-len -->
<style lang="scss" scoped>
	@import 'settings';

	.story-card,
	.story-card__imageCard {
		border-radius: 2.5rem;
		min-height: 550px;
		@include breakpoint(medium) {
			min-height: 600px;
		}
		@include breakpoint(large) {
			min-height: 720px;
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

	.story-card >>> .tw-prose u {
		text-decoration: none;
	}

	.story-card >>> .tw-prose h1 i,
	.story-card >>> .tw-prose h1 u,
	.story-card >>> .tw-prose h2 i,
	.story-card >>> .tw-prose h2 u,
	.story-card >>> .tw-prose h3 i,
	.story-card >>> .tw-prose h3 u {
		position: relative;
		display: inline-block;
		font-style: normal;
	}

	// Text formatting for headlines.
	.story-card >>> .tw-prose h1 b,
	.story-card >>> .tw-prose h2 b,
	.story-card >>> .tw-prose h3 b {
		color: rgba(var(--text-action));
	}

	.story-card >>> .tw-prose h1 u::after,
	.story-card >>> .tw-prose h2 u::after,
	.story-card >>> .tw-prose h3 u::after {
		content: "";
		display: block;
		position: absolute;
		bottom: -6px;
		left: -4px;
		width: calc(100% + 8px);
		text-decoration: none;
		height: 8px;
	}

	.story-card >>> .tw-prose h1 i::after,
	.story-card >>> .tw-prose h2 i::after,
	.story-card >>> .tw-prose h3 i::after {
		background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHZpZXdCb3g9IjAgMCAzNzcgOTkiPgoJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCQkuc3ZnX2xpbmV7ZmlsbDpub25lO3N0cm9rZTojMmFhOTY3O3N0cm9rZS13aWR0aDo0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO3ZlY3Rvci1lZmZlY3Q6IG5vbi1zY2FsaW5nLXN0cm9rZTt9Cgk8L3N0eWxlPgoJPHBhdGggY2xhc3M9InN2Z19saW5lIiBkPSJNMzA4Ljg5NyAyNy43MTNDMzU2LjYwMSAzMy4zODA5IDQyMy4zODYgNTEuMjA4MyAzMDguODkzIDc3LjE3NUMxNjUuNzc2IDEwOS42MzMgLTMyLjI1OTYgOTYuNTc0IDkuODI2MzMgMzkuODExOEM0My40OTUxIC01LjU5Nzk3IDI1Ny4yNTEgMi40OTkyNiAzNTkuOTIgMTIuMjI0MSIvPgo8L3N2Zz4=");
		content: "";
		display: block;
		position: absolute;
		top: -10px;
		left: -6px;
		width: calc(100% + 24px);
		height: calc(100% + 16px);
	}
</style>
