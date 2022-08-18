<template>
	<section class="tw-py-8 md:tw-py-16">
		<div class="row align-center">
			<div class="small-12 medium-10 large-6 columns">
				<kv-contentful-img
					v-if="partnerImage.url"
					class="tw-block tw-w-full tw-mx-auto tw-mb-4 md:tw-mb-0"
					:contentful-src="partnerImage.url"
					:width="500"
					fallback-format="jpg"
					loading="lazy"
					:alt="partnerImage.title"
				/>
			</div>
			<div class="small-10 large-6 columns">
				<h2 v-if="headline" class="tw-mb-4">
					{{ headline }}
				</h2>
				<div
					v-if="bodyCopy"
					class="tw-prose"
					v-html="bodyCopy"
					ref="partnerBodyCopy"
				></div>
			</div>
		</div>
	</section>
</template>

<script>
import { addBlankTargetToExternalLinks } from '@/util/contentful/richTextRenderer';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'CampaignPartner',
	components: {
		KvContentfulImg
	},
	props: {
		partnerAreaContent: {
			type: Object,
			default: () => {},
		},
		pageSettingData: {
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
		addBlankTargetToExternalLinks(this.$refs.partnerBodyCopy, this.$props.pageSettingData);
	}
};
</script>
