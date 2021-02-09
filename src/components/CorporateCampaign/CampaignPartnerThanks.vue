<template>
	<div class="campaign-partner-thanks">
		<picture
			v-if="partnerImage.url"
			class="campaign-partner-thanks__img"
		>
			<source
				type="image/webp"
				:srcset="`
					${partnerImage.url}?w=1000&fm=webp 2x,
					${partnerImage.url}?w=500&fm=webp 1x`"
			>
			<img
				:srcset="`
					${partnerImage.url}?w=1000&fm=jpg 2x,
					${partnerImage.url}?w=500&fm=jpg 1x`"
				:src="`${partnerImage.url}?w=500&fm=jpg`"
				:alt="partnerImage.title"
			>
		</picture>
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
	async mounted() {
		await this.$nextTick();
		// make sure all partner content links open externally
		if (this.$refs.partnerBodyCopy) {
			const links = this.$refs.partnerBodyCopy.querySelectorAll('a');
			links.forEach(link => { link.target = '_blank'; }); // eslint-disable-line no-param-reassign
		}
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
