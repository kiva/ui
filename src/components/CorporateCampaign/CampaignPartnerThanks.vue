<template>
	<div class="campaign-partner-thanks">
		<kv-contentful-img
			v-if="partnerImage.url"
			class="campaign-partner-thanks__img"
			:contentful-src="partnerImage.url"
			:width="500"
			:alt="partnerImage.title"
			fallback-format="jpg"
		/>
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
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import { addBlankTargetToExternalLinks } from '@/util/contentful/richTextRenderer';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'CampaignPartnerThanks',
	components: {
		KvButton,
		KvContentfulImg
	},
	props: {
		partnerContent: {
			type: Object,
			default: () => {},
		},
		pageSettingData: {
			type: Object,
			default: () => {},
		}
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
	async mounted() {
		await this.$nextTick();
		// make sure all partner content links open externally
		addBlankTargetToExternalLinks(this.$refs.partnerBodyCopy, this.pageSettingData);
	}
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
