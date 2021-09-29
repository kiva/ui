<template>
	<section class="lender-quotes section">
		<div class="row">
			<h2 class="lender-quotes__header text-center small-12 columns" v-html="headline">
			</h2>
			<div
				v-for="lenderQuote in lenderQuotes"
				:key="lenderQuote.key"
				:class="`quote-card small-10 medium-8 large-5 columns`"
				v-kv-track-event="[
					'homepage',
					'click-lender-testimonial',
					lenderQuote.attribution
				]"
			>
				<kv-contentful-img
					v-if="lenderQuote.image.url"
					class="quote-card__lender-img"
					:contentful-src="lenderQuote.image.url"
					:alt="lenderQuote.image.description"
					:width="64"
					:height="64"
					loading="lazy"
					fallback-format="jpg"
				/>
				<p class="quote-card__quote">
					{{ lenderQuote.quote }}
				</p>
				<p class="quote-card__attribution">
					{{ lenderQuote.attribution }},
				</p>
				<p class="quote-card__title">
					{{ lenderQuote.title }}
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

export default {
	components: {
		KvContentfulImg,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		sectionText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-lender-quotes-text') > -1);
		},
		headline() {
			return this.sectionText.headline;
		},
		lenderQuotes() {
			const allLenderText = this.content?.contents?.filter(({ key }) => key.indexOf('lender-quote-text') > -1);
			return allLenderText.map((lender, index) => ({
				key: index,
				attribution: lender.headline ?? '',
				title: lender.subHeadline ?? '',
				quote: lender.bodyCopy.content[0].content[0].value ?? '',
				image: this.lenderImages[index],
			}));
		},
		lenderImages() {
			const images = this.content?.media ?? [];
			return images.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.lender-quotes {
	padding: 2rem 0;

	&__header {
		margin-bottom: 2rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	.quote-card {
		@include featured-text();

		margin: 0 auto rem-calc(25) auto;
		text-align: center;
		border-radius: 1rem;
		background: $white;
		box-shadow: 0 0 1.2rem 1rem rgb(153, 153, 153, 0.1);
		position: relative;
		overflow: hidden;
		z-index: 1;

		@include breakpoint(large) {
			@include medium-text();
		}

		&__lender-img {
			margin: rem-calc(30) auto rem-calc(24);
			width: 5.5rem;
			border-radius: 50%;
			overflow: hidden;

			@include breakpoint(large) {
				width: 4rem;
			}
		}

		&__quote {
			line-height: 1.3;
			margin-bottom: rem-calc(30);
		}

		&__attribution {
			line-height: 1.3;
			font-weight: bold;
			margin-bottom: 0;
			position: relative;
		}

		&__title {
			position: relative;
			margin-bottom: rem-calc(30);
		}
	}

	.quote-card:nth-child(even) {
		@include breakpoint(large) {
			margin-right: 0.9rem;
		}
	}

	.quote-card:nth-child(odd) {
		@include breakpoint(large) {
			margin-left: 0.9rem;
		}
	}
}
</style>
