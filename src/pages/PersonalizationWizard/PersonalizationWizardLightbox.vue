<template>
	<kv-lightbox
		title="Let's find you the perfect loan!"
		:visible="isLightboxVisible"
		@lightbox-closed="closeLightbox"
	>
		<div>
			personalization wizard lightbox
		</div>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	components: {
		KvLightbox,
	},
	data() {
		return {
			isLightboxVisible: true,
		};
	},
	methods: {
		closeLightbox() {
			this.isLightboxVisible = false;
		},
	},
};
</script>
