<template>
	<section class="bottom-cta section tw-text-center row">
		<div class="small-12 columns">
			<p
				v-html="bottomCTAHeadline"
				class="bottom-cta__headline"
			></p>
			<kv-button
				:class="`${buttonClass} rounded smaller bottom-cta__button`"
				:to="buttonTo"
				v-kv-track-event="[
					'homepage',
					'click-homepage-cta-bottom',
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
			return this.bottomCTAContent?.headline ?? '';
		},
		buttonText() {
			return this.bottomCTAContent?.primaryCtaText ?? '';
		},
		buttonLink() {
			return this.bottomCTAContent?.primaryCtaLink ?? '';
		},
		buttonClass() {
			return this.$attrs?.customCtaButtonClass ?? '';
		},
		buttonTo() {
			return this.buttonLink;
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.bottom-cta {
	padding: 2rem 0;

	&__headline {
		font-size: rem-calc(44);
		font-weight: 300;
		margin-bottom: rem-calc(30);
		line-height: 1.3;
	}

	&__button {
		margin-bottom: 1rem;
	}
}

</style>
