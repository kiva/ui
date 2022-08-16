<template>
	<section class="tw-py-4 md:tw-py-8">
		<div class="row align-center">
			<div class="small-12 medium-10 large-6 xlarge-5 columns">
				<img
					class="tw-block tw-mx-auto tw-mb-4 md:tw-mt-0"
					src="@/assets/images/loan-card-stack.jpg"
					srcset="@/assets/images/loan-card-stack_2x.jpg 2x"
					alt=""
					width="383"
					height="455"
				>
			</div>
			<!-- eslint-disable-next-line max-len -->
			<div class="small-10 large-6 xlarge-7 align-self-middle columns">
				<h1 class="tw-mb-4">
					<template v-if="headline">
						{{ headline }}
					</template>
					<template v-else>
						Make a loan, <br> change a life.
					</template>
				</h1>
				<div
					v-if="bodyCopy"
					class="tw-prose tw-text-subhead tw-mb-4"
					v-html="bodyCopy"
					ref="heroBodyCopy"
				></div>
				<p v-else class="tw-text-subhead tw-mb-4">
					With Kiva you can lend as little as $25 and make a big change in someone's life.
				</p>
				<div class="tw-flex tw-flex-wrap tw-gap-2">
					<kv-ui-button
						@click.native.prevent="jumpToLoans"
						v-kv-track-event="[
							'Campaign',
							'click-hero-cta',
							'Find a borrower'
						]"
					>
						Find a borrower
					</kv-ui-button>
					<kv-ui-button
						v-if="secondaryCtaLink && secondaryCtaText"
						variant="secondary"
						:href="secondaryCtaLink"
						target="_blank"
						v-kv-track-event="[
							'Campaign',
							'click-hero-secondary-cta',
							secondaryCtaText
						]"
					>
						{{ secondaryCtaText }}
					</kv-ui-button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { addBlankTargetToExternalLinks } from '@/util/contentful/richTextRenderer';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'CampaignHero',
	components: {
		KvUiButton,
	},
	props: {
		heroAreaContent: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {};
	},
	computed: {
		headline() {
			if (this.heroAreaContent) {
				return this.heroAreaContent.contents[0].headline;
			}
			return '';
		},
		bodyCopy() {
			if (this.heroAreaContent) {
				return documentToHtmlString(this.heroAreaContent.contents[0].bodyCopy);
			}
			return '';
		},
		secondaryCtaText() {
			return this.heroAreaContent?.contents?.[0]?.primaryCtaText || '';
		},
		secondaryCtaLink() {
			return this.heroAreaContent?.contents?.[0]?.primaryCtaLink || '';
		}
	},
	methods: {
		jumpToLoans() {
			this.$emit('jump-to-loans');
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
	},
	async mounted() {
		await this.$nextTick();
		addBlankTargetToExternalLinks(this.$refs.heroBodyCopy);
	}
};
</script>
