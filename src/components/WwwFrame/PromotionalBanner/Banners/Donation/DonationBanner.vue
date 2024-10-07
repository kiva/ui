<!-- eslint-disable vue/no-v-html -->
<template>
	<div>
		<div class="tw-py-2 lg:tw-py-3 tw-bg-brand-100">
			<kv-page-container>
				<!-- eslint-disable max-len -->
				<div
					class="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-center tw-relative tw-gap-0 md:tw-gap-3"
				>
					<div class="tw-mb-2 lg:tw-m-0">
						<div class="tw-relative" style="width: 8rem; height: 8rem;">
							<kv-contentful-img
								v-if="bannerImageUrl"
								class="tw-absolute tw-h-full tw-w-full tw-z-1"
								:contentful-src="bannerImageUrl"
								alt="Donation Banner image"
								fallback-format="gif"
								:height="128"
								:width="128"
							/>
						</div>
					</div>
					<div class="tw-text-center md:tw-text-left">
						<div class="md:tw-max-w-lg tw-whitespace-prewrap">
							<h3 class="tw-inline" v-html="headline"></h3>
							<a
								v-if="disclaimer"
								v-kv-track-event="['promo', 'click-disclaimer-superscript', 'donation-banner', '1']"
								class="tw-text-primary"
								@click="scrollToSection('#disclaimers')"
							>
								<sup>
									1
								</sup>
							</a>
						</div>
						<div
							class="tw-mb-3 tw-mt-0.5 lg:tw-mb-2 tw-whitespace-pre-wrap md:tw-max-w-sm"
							v-html="body"
						></div>
						<div
							class="
								tw-flex tw-flex-wrap tw-list-none tw-m-0
								tw-gap-x-1 tw-gap-y-1 md:tw-gap-1.5
								tw-justify-center donation-amount
							"
						>
							<kv-button
								v-for="(buttonAmount, index) in buttonAmounts"
								:key="`amount-${index}`"
								v-kv-track-event="[
									'promo',
									'click-amount-btn',
									'donation-banner',
									buttonAmount,
									buttonAmount
								]"
								variant="secondary"
								class="tw-border-brand tw-text-brand"
								:href="`/donate/supportus?dfmode=${frequency}&dfamt=${numeral(buttonAmount).format('0.00')}`"
							>
								Donate ${{ buttonAmount }}
							</kv-button>
							<kv-button
								v-kv-track-event="['promo', 'click-other', 'donation-banner', 0, 0]"
								variant="secondary"
								class="other-amount"
								:href="`/donate/supportus?dfmode=${frequency}&dfmat=0.00`"
							>
								Other
							</kv-button>
						</div>
						<button
							v-kv-track-event="[
								'promo',
								'click-close',
								'donation-banner',
							]"
							class="`
								tw-flex
								tw-items-center
								tw-justify-center
								tw-absolute
								tw-h-4
								tw-w-4
								tw-top-0
								tw-right-2
								tw-rounded
								hover:tw-bg-tertiary
								focus:tw-bg-tertiary`"
							@click="onCloseBanner"
						>
							<kv-material-icon class="tw-h-2 tw-w-2" :icon="mdiClose" />
						</button>
					</div>
				</div>
			</kv-page-container>
		</div>
	</div>
</template>

<script>
import { mdiClose } from '@mdi/js';
import numeral from 'numeral';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';
import KvButton from '@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import KvContentfulImg from '@kiva/kv-components/vue/KvContentfulImg';

export default {
	name: 'DonationBanner',
	components: {
		KvPageContainer,
		KvButton,
		KvMaterialIcon,
		KvContentfulImg
	},
	data() {
		return {
			numeral,
			mdiClose
		};
	},
	mixins: [smoothScrollMixin],
	emits: ['close-banner'],
	props: {
		buttonAmounts: {
			type: Array,
			default: () => [20, 35, 50],
		},
		headline: {
			type: String,
			default: ''
		},
		body: {
			type: String,
			default: ''
		},
		bannerImageUrl: {
			type: String,
			default: ''
		},
		disclaimer: {
			type: Boolean,
			default: false
		},
		frequency: {
			type: String,
			default: 'once'
		},
	},
	methods: {
		onCloseBanner() {
			this.$emit('close-banner');
		},
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		},
	},
};
</script>

<style lang="postcss" scoped>
	.donation-amount > * {
		min-width: 133px;
	}

	.other-amount {
		@screen md {
			min-width: auto !important;
		}
	}

	.donation-amount :deep(span) {
		@apply tw-px-1;
	}
</style>
