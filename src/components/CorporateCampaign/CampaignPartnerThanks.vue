<template>
	<div class="campaign-partner-thanks">
		<img
			v-if="partnerImage.url"
			class="campaign-partner-thanks__img"
			:src="partnerImage.url"
			alt=""
		>
		<h2
			v-if="headline"
			class="campaign-partner-thanks__header"
		>
			{{ headline }}
		</h2>
		<div
			v-if="bodyCopy"
			class="campaign-partner-thanks__body"
			v-html="bodyCopy"
			ref="partnerBodyCopy"
		></div>
		<kv-button
			v-if="ctaLink && ctaText"
			class="campaign-partner-thanks__body"
			:href="ctaLink"
		>
			{{ ctaText }}
		</kv-button>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvButton
	},
	props: {
		partnerContent: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		partnerImage() {
			const mediaObject = this.partnerContent?.media?.[0];
			return {
				title: mediaObject?.title || '',
				url: mediaObject?.file?.url || ''
			};
		},
		headline() {
			return this.partnerContent?.contents?.[0]?.headline || '';
		},
		bodyCopy() {
			const richText = this.partnerContent?.contents?.[0]?.bodyCopy;
			return richText ? documentToHtmlString(richText) : '';
		},
		ctaText() {
			return this.partnerContent?.contents?.[0]?.primaryCtaText || '';
		},
		ctaLink() {
			return this.partnerContent?.contents?.[0]?.primaryCtaLink || '';
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-partner-thanks {
	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__img {
		display: block;
		margin: 0 auto 2rem;
	}
}
</style>
