<template>
	<kv-lightbox
		:visible="visible"
		@lightbox-closed="closeLightbox"
	>
		<div class="body-copy text-center" v-html="bodyCopy">
		</div>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '@/components/Kv/KvLightbox';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
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
			return documentToHtmlString(this.content.richTextContent.richText, options);
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
// allows narrower lightboxes that aren't necessarily the full width of the page
.kv-lightbox-wrap ::v-deep .kv-lightbox .lightbox-row .lightbox-columns {
	width: auto;
}
</style>
