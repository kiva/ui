<template>
	<section class="campaign-partner section">
		<div class="row">
			<div class="small-12 medium-10 large-6 columns">
				<img
					v-if="heroLogo.url"
					class="campaign-partner__img"
					:src="heroLogo.url"
					:alt="heroLogo.title"
				>
			</div>
			<div class="small-10 large-6 columns">
				<h2
					v-if="headline"
					class="campaign-partner__header"
				>
					{{ headline }}
				</h2>
				<div
					v-if="bodyCopy"
					class="campaign-hero__body"
					v-html="bodyCopy"
				></div>
			</div>
		</div>
	</section>
</template>

<script>
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	props: {
		partnerAreaContent: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		heroLogo() {
			const mediaObject = this.partnerAreaContent?.media?.[0];
			return {
				title: mediaObject?.title || '',
				url: mediaObject.file?.url || ''
			};
		},
		headline() {
			return this.partnerAreaContent?.contents?.[0]?.headline || '';
		},
		bodyCopy() {
			const richText = this.partnerAreaContent?.contents?.[0]?.bodyCopy;
			return richText ? documentToHtmlString(richText) : '';
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-partner {
	padding: 2rem 0 2rem;

	@include breakpoint(large) {
		padding: 4rem 0;
	}

	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__img {
		display: block;
		margin: 0 auto 2rem;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}
}
</style>
