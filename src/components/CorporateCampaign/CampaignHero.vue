<template>
	<section
		class="campaign-hero section"
	>
		<div class="row align-center">
			<div class="small-12 medium-10 large-6 xlarge-5 columns">
				<img
					class="campaign-hero__hero-img"
					src="@/assets/images/loan-card-stack.jpg"
					srcset="@/assets/images/loan-card-stack_2x.jpg 2x"
					alt=""
					width="383"
					height="455"
				>
			</div>
			<!-- eslint-disable-next-line max-len -->
			<div class="small-10 large-6 xlarge-7 align-self-middle columns">
				<h1 class="campaign-hero__header">
					<template v-if="headline">
						{{ headline }}
					</template>
					<template v-else>
						Make a loan, <br class="so mo"> change a life.
					</template>
				</h1>
				<div
					v-if="bodyCopy"
					class="campaign-hero__body"
					v-html="bodyCopy"
					ref="heroBodyCopy"
				></div>
				<p v-else class="campaign-hero__body">
					With Kiva you can lend as little as $25 and make a big change in someone's life.
				</p>
				<div class="campaign-hero__cta-wrapper">
					<kv-button
						class="button smallest"
						@click.native.prevent="jumpToLoans"
						v-kv-track-event="[
							'Campaign',
							'click-hero-cta',
							'Find a borrower'
						]"
					>
						Find a borrower
					</kv-button>
					<kv-button
						v-if="secondaryCtaLink && secondaryCtaText"
						class="button secondary smallest"
						:href="secondaryCtaLink"
						target="_blank"
						v-kv-track-event="[
							'Campaign',
							'click-hero-secondary-cta',
							secondaryCtaText
						]"
					>
						{{ secondaryCtaText }}
					</kv-button>
				</div>
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
		heroAreaContent: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {};
	},
	computed: {
		headline() {
			if (this.heroAreaContent) {
				return this.heroAreaContent.contents[0].headline;
			}
			return '';
		},
		bodyCopy() {
			if (this.heroAreaContent) {
				return documentToHtmlString(this.heroAreaContent.contents[0].bodyCopy);
			}
			return '';
		},
		secondaryCtaText() {
			return this.heroAreaContent?.contents?.[0]?.primaryCtaText || '';
		},
		secondaryCtaLink() {
			return this.heroAreaContent?.contents?.[0]?.primaryCtaLink || '';
		}
	},
	methods: {
		jumpToLoans() {
			this.$emit('jump-to-loans');
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
	},
	async mounted() {
		await this.$nextTick();
		// make sure all partner content links open externally
		if (this.$refs.heroBodyCopy) {
			const links = this.$refs.heroBodyCopy.querySelectorAll('a');
			if (links.length > 0) {
				Array.prototype.forEach.call(links, link => {
					link.target = '_blank';// eslint-disable-line no-param-reassign
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-hero {
	padding: 2rem 0 2rem;

	@include breakpoint(large) {
		padding: 4rem 0;
	}

	&__cta_wrapper {
		padding: 0 0 2rem;

		@include breakpoint(medium) {
			padding: 0 2rem 2rem;
		}

		@include breakpoint(large) {
			padding: 0 2rem;
		}
	}

	&__hero-img {
		display: block;
		margin: 0 auto 2rem;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}

	&__header {
		@include large-text();

		@include breakpoint(xlarge) {
			@include huge-headline();

			font-weight: 500;
		}
	}

	&__body,
	&__cta {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();
		}
	}

	&__cta-wrapper {
		flex-direction: row;
		flex-wrap: wrap;

		.button {
			margin: 0 1rem 1rem 0;
		}
	}
}
</style>
