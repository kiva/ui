<template>
	<section class="homepage-hero">
		<div class="row align-center">
			<div
				class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns"
			>
				<router-link
					:to="heroButton.link"
					v-kv-track-event="[
						'homepage',
						'click-hero-loancards',
						heroImage.description,
					]"
				>
					<img
						v-if="heroImage.url"
						class="homepage-hero__img"
						:src="heroImage.url"
						:alt="heroImage.description"
					>
				</router-link>
			</div>
			<!-- eslint-disable-next-line max-len -->
			<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns homepage-hero__cta_wrapper">
				<h1 class="homepage-hero__header green-emphasis" v-html="heroHeadline">
				</h1>
				<div class="homepage-hero__body" v-html="heroBody">
				</div>
				<kv-button
					class="show-for-large rounded"
					:to="heroButton.link"
					v-kv-track-event="[
						'homepage',
						'click-hero-cta',
						heroButton.text,
					]"
				>
					{{ heroButton.text }}
				</kv-button>
			</div>
		</div>
		<!-- Button in different element order for mobile only -->
		<div class="row align-center hide-for-large">
			<div class="small-10">
				<kv-button
					class="rounded expanded"
					:to="heroButton.link"
					v-kv-track-event="[
						'homepage',
						'click-hero-cta',
						heroButton.text,
					]"
				>
					{{ heroButton.text }}
				</kv-button>
			</div>
		</div>
	</section>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvButton,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		heroImage() {
			const mediaObject = this.content?.media?.[0];
			return {
				description: mediaObject?.description ?? '',
				title: mediaObject?.title ?? '',
				url: mediaObject?.file?.url ?? ''
			};
		},
		heroText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-hero-text') > -1);
		},
		heroHeadline() {
			return this.heroText?.headline ?? '';
		},
		heroBody() {
			const text = this.heroText?.bodyCopy ?? '';
			return text ? documentToHtmlString(text) : '';
		},
		heroButton() {
			return {
				text: this.heroText?.primaryCtaText ?? '',
				link: this.heroText?.primaryCtaLink ?? '',
			};
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.homepage-hero {
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 4rem 0 2rem;
	}

	.row {
		max-width: 70rem;
	}

	&__cta_wrapper {
		padding: 0;

		@include breakpoint(medium) {
			padding: 0 2rem;
		}

		@include breakpoint(xxlarge) {
			padding: 0 2rem 0 4rem;
		}
	}

	&__img {
		display: block;
		margin: 0 auto 2rem;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}

	&__header {
		font-size: rem-calc(48);
		line-height: rem-calc(54);
		font-weight: 500;

		@include breakpoint(xlarge) {
			@include huge-headline();
		}
	}

	&__body {
		margin: 2.25rem auto 0;
		white-space: pre-wrap;

		@include breakpoint(medium) {
			margin: 2.25rem auto 2.25rem;
		}

		p {
			@include medium-text();

			@include breakpoint(xlarge) {
				@include featured-text();

				line-height: rem-calc(36);
			}
		}
	}
}
</style>
