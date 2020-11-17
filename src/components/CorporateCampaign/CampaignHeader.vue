<template>
	<section class="campaign-header section row align-center">
		<!-- TODO: add optional Hero Image Presentation -->
		<!-- eslint-disable-next-line max-len -->
		<div class="small-10 large-5 xlarge-6 small-order-1 large-order-2 align-self-middle columns campaign-header__cta_wrapper">
			<div v-if="headerLogo.url" class="campaign-header__logo">
				<img :title="headerLogo.title" :src="headerLogo.url">
			</div>
		</div>
		<div class="small-12 medium-10 large-7 xlarge-6 small-order-2 large-order-1 columns">
			<h1 class="campaign-header__header">
				{{ headline }}
			</h1>
			<div class="campaign-header__body" v-html="bodyCopy"></div>
			<a
				class="campaign-header__cta"
				@click.prevent="jumpToLoans"
				v-kv-track-event="[
					'Campaign',
					'click-hero-cta',
					'Find someone to lend to',
				]"
			>
				Find someone to lend to &xrarr;
			</a>
		</div>
	</section>
</template>

<script>
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	props: {
		headerAreaContent: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {};
	},
	computed: {
		headerLogo() {
			const mediaObject = this.headerAreaContent?.media?.[0];
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
			if (this.headerAreaContent) {
				return this.headerAreaContent.contents[0].headline;
			}
			return '';
		},
		bodyCopy() {
			if (this.headerAreaContent) {
				return documentToHtmlString(this.headerAreaContent.contents[0].bodyCopy);
			}
			return '';
		},
	},
	methods: {
		jumpToLoans() {
			this.$emit('jump-to-loans');
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-header {
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

	&__header {
		@include large-text();

		padding-top: 1rem;
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
