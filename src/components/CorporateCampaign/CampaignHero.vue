<template>
	<section
		class="campaign-hero section"
	>
		<div class="row align-center">
			<div class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns">
				<img
					class="campaign-hero__hero-img"
					src="@/assets/images/loan-card-stack.jpg"
					srcset="@/assets/images/loan-card-stack_2x.jpg 2x"
					alt=""
					width="383"
					height="429"
				>
			</div>
			<!-- eslint-disable-next-line max-len -->
			<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns featured-loans__cta_wrapper">
				<h1 class="campaign-hero__header">
					<template v-if="headline">
						{{ headline }}
					</template>
					<template v-else>
						Make a loan, <br class="so mo"> change a life.
					</template>
				</h1>
				<div v-if="bodyCopy" class="campaign-hero__body" v-html="bodyCopy"></div>
				<p v-else class="campaign-hero__body">
					With Kiva you can lend as little as $25 and make a big change in someone's life.
				</p>
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
		heroLogo() {
			const mediaObject = this.heroAreaContent?.media?.[0];
			if (mediaObject) {
				return {
					title: mediaObject.title,
					url: mediaObject.file?.url
				};
			}
			return {
				title: '',
				url: ''
			};
		},
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
	},
	methods: {
		jumpToLoans() {
			this.$emit('jump-to-loans');
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
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

	&__logo {
		image {
			display: block;
			outline: none;
			width: 100%;
		}
	}

	&__hero-img {
		display: block;
		margin: 1rem auto 0;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}

	&__header {
		@include large-text();
		// padding-top: 1rem;

		@include breakpoint(xlarge) {
			@include huge-headline();
		}
	}

	&__body,
	&__cta {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();
		}
	}
}
</style>
