<template>
	<section class="how-it-works section text-center">
		<div class="small-12">
			<h1 v-html="bottomCTAHeadline"></h1>
			<kv-button
				class="rounded"
				:to="buttonLink"
				v-kv-track-event="[
					'homepage',
					'click-hero-cta',
					buttonText,
				]"
			>
				{{ buttonText }}
			</kv-button>
		</div>
	</section>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		bottomCTAContent() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-bottom-cta-section') > -1);
		},
		bottomCTAHeadline() {
			console.log('bottomCTAContent', this.bottomCTAContent);
			return this.bottomCTAContent?.headline ?? '';
		},
		buttonText() {
			return this.bottomCTAContent?.primaryCtaText ?? '';
		},
		buttonLink() {
			return this.bottomCTAContent?.primaryCtaLink ?? '';
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

</style>
