<template>
	<section class="campaign-partner section">
		<div class="row align-center">
			<div class="small-12 medium-10 large-6 columns">
				<img
					v-if="partnerImage.url"
					class="campaign-partner__img"
					:src="partnerImage.url"
					:alt="partnerImage.title"
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
					class="campaign-partner__body"
					v-html="bodyCopy"
					ref="partnerBodyCopy"
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
		partnerImage() {
			const mediaObject = this.partnerAreaContent?.media?.[0];
			return {
				title: mediaObject?.title || '',
				url: mediaObject?.file?.url || ''
			};
		},
		headline() {
			return this.partnerAreaContent?.contents?.[0]?.headline || '';
		},
		bodyCopy() {
			const richText = this.partnerAreaContent?.contents?.[0]?.bodyCopy;
			return richText ? documentToHtmlString(richText) : '';
		},
	},
	async mounted() {
		await this.$nextTick();
		// make sure all partner content links open externally
		const links = this.$refs.partnerBodyCopy.querySelectorAll('a');
		links.forEach(link => { link.target = '_blank'; }); // eslint-disable-line no-param-reassign
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
