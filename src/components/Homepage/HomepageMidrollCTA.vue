<template>
	<section class="homepage-midroll-cta row align-middle">
		<h2 class="homepage-midroll-cta__header small-12 columns hide-for-xxlarge green-emphasis" v-html="headline">
		</h2>
		<div class="homepage-midroll-cta__card-wrapper small-12 xlarge-expand columns">
			<div
				v-for="card in midrollCards"
				:key="card.key"
				class="homepage-midroll-cta__card"
			>
				<kv-contentful-img
					v-if="card.image"
					class="homepage-midroll-cta__card-img"
					:contentful-src="card.image.url"
					fallback-format="png"
					:alt="card.image.description"
					:height="90"
					loading="lazy"
				/>
				<div class="homepage-midroll-cta__card-body green-emphasis" v-html="card.body">
				</div>
			</div>
		</div>

		<div class="homepage-midroll-cta__body-wrapper small-12 xlarge-expand columns">
			<h2 class="homepage-midroll-cta__header show-for-xxlarge green-emphasis" v-html="headline"></h2>
			<div class="row column homepage-midroll-cta__body" v-html="bodyCopy"></div>
			<div class="homepage-midroll-cta__button-wrapper">
				<kv-button
					class="rounded"
					:to="primaryCtaLink"
					v-kv-track-event="[
						'homepage',
						'click-homepage-midroll-cta',
						primaryCtaText
					]"
				>
					{{ primaryCtaText }}
				</kv-button>
			</div>
		</div>
	</section>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvButton,
		KvContentfulImg,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		midrollText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-mid-roll-text') > -1);
		},
		midrollImages() {
			const images = this.content?.media ?? [];
			return images.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? '',
			}));
		},
		midrollCards() {
			const rawCards = this.content?.contents?.filter(({ key }) => key.indexOf('homepage-mid-roll-card') > -1);
			return rawCards?.map((card, index) => ({
				key: card.key || index,
				body: documentToHtmlString(card.bodyCopy ?? ''),
				image: this.midrollImages[index],
			}));
		},
		headline() {
			return this.midrollText?.headline ?? '';
		},
		bodyCopy() {
			return documentToHtmlString(this.midrollText?.bodyCopy ?? '');
		},
		primaryCtaLink() {
			return this.midrollText?.primaryCtaLink ?? '';
		},
		primaryCtaText() {
			return this.midrollText?.primaryCtaText ?? '';
		},
	},
};
</script>

<style lang="scss">
@import "settings";

$first-break: xlarge;
$second-break: xxlarge;

.homepage-midroll-cta {
	padding: 2rem 0;
	max-width: 66rem;

	.row &__card-wrapper.columns {
		@include breakpoint($first-break) {
			flex: 0 0 23rem;
		}

		@include breakpoint($second-break) {
			flex: 0 0 30rem;
		}
	}

	&__body-wrapper {
		@include breakpoint($second-break) {
			padding-left: 1.5rem;
		}
	}

	&__header {
		font-weight: 500;
		font-size: rem-calc(48);
		line-height: rem-calc(54);
		white-space: pre-wrap;
		margin-bottom: 2rem;

		@include breakpoint($first-break) {
			@include huge-headline();
		}
	}

	&__body {
		margin-bottom: 2rem;
		white-space: pre-wrap;

		@include medium-text();

		line-height: 1.5;

		@include breakpoint($second-break) {
			@include featured-text();

			line-height: 1.5;
		}
	}

	&__button-wrapper {
		text-align: center;

		@include breakpoint($first-break) {
			text-align: left;
		}
	}

	&__card {
		text-align: center;
		max-width: rem-calc(400);
		padding: 1rem;
		margin: 0 auto 1rem;
		border-radius: rem-calc(20);
		box-shadow: 0 rem-calc(2) rem-calc(10) rgba(0, 0, 0, 0.25);

		@include breakpoint($second-break) {
			padding: rem-calc(22);
			margin: 0 0 rem-calc(60);
			box-shadow: 0 rem-calc(4) rem-calc(15) rgba(0, 0, 0, 0.25);
		}

		&-img {
			display: block;
			height: rem-calc(72);
			margin: 0 auto rem-calc(6);

			@include breakpoint($second-break) {
				height: rem-calc(90);
				margin-bottom: rem-calc(20);
			}
		}

		&-body {
			max-width: 17rem;
			margin: 0 auto;
			letter-spacing: -0.02rem;

			@include breakpoint($second-break) {
				max-width: 21rem;
				font-size: $medium-text-font-size;
			}

			p {
				margin: 0;
				line-height: 1.5;
			}

			i {
				font-weight: bold;
			}
		}

		&:last-of-type {
			margin-bottom: 2rem;

			@include breakpoint($second-break) {
				margin-bottom: 0;
			}
		}
	}
}
</style>
