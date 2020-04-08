<template>
	<kv-lightbox
		:visible="visible"
		@lightbox-closed="closeLightbox"
	>
		<div class="text-center">
			<div class="headline">
				<h2>{{ content.genericContentBlock.headline }}</h2>
			</div>
			<div class="sub-headline">
				<h4>{{ content.genericContentBlock.subHeadline }}</h4>
			</div>
			<div class="body-copy" v-html="bodyCopy">
			</div>
		</div>
		<template slot="controls" v-if="content.genericContentBlock.primaryCtaText">
			<div class="text-center">
				<kv-button
					:to="content.genericContentBlock.primaryCtaLink"
					:v-kv-track-event="[content.genericContentBlock.primaryCtaKvTrackEvent]"
				>
					{{ content.genericContentBlock.primaryCtaText }}
				</kv-button>
			</div>
		</template>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvButton,
		KvLightbox,
	},
	inject: ['apollo'],
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		content: {
			type: Object,
			default() {
				return {
				};
			}
		},
	},
	computed: {
		bodyCopy() {
			const options = {
				renderNode: {
					'embedded-asset-block': node => `<img src="${node.data.target.fields.file.url}"/>`
				}
			};
			return documentToHtmlString(this.content.genericContentBlock.bodyCopy, options);
		}
	},
	methods: {
		closeLightbox() {
			this.$emit('lightbox-closed');
		},
	}
};
</script>

<style lang="scss" scoped>
h2 {
	padding: 1.5rem 2rem 0;
}

.sub-headline {
	padding: 0.5rem 2rem;
}

// allows narrower lightboxes that aren't necessarily the full width of the page
.kv-lightbox-wrap ::v-deep .kv-lightbox .lightbox-row .lightbox-columns {
	width: auto;
}
</style>
