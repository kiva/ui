<template>
	<section class="how-it-works section text-center">
		<div class="small-12">
			<p v-html="bottomCTAHeadline"></p>
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
			console.log(this.content?.contents?.find(({ key }) => key.indexOf('homepage-bottom-cta-section') > -1));
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-bottom-cta-section') > -1);
		},
		bottomCTAHeadline() {
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
