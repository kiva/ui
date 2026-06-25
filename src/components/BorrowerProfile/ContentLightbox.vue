<template>
	<kv-lightbox
		:visible="visible"
		:title="title"
		@lightbox-closed="close"
	>
		<div v-html="content" class="tw-prose"></div>
	</kv-lightbox>
</template>

<script>
import { KvLightbox } from '@kiva/kv-components';

export default {
	name: 'ContentLightbox',
	components: {
		KvLightbox,
	},
	data() {
		return {
			visible: false,
			title: '',
			content: '',
		};
	},
	methods: {
		open({ title, content } = {}) {
			this.title = title ?? '';
			this.content = content ?? '';
			this.visible = true;
		},
		close() {
			this.visible = false;
			setTimeout(() => {
				// clear content after the modal close animation, but only if it
				// wasn't reopened with new content during the animation
				if (!this.visible) {
					this.title = '';
					this.content = '';
				}
			}, 500);
		},
	},
};
</script>
