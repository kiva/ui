<template>
	<div>
		<!-- open banner -->
		<div
			class="tw-py-2 lg:tw-py-3 tw-bg-brand-100"
			v-if="isOpen"
			key="openBanner"
		>
			<kv-page-container>
				<div
					class="tw-flex tw-flex-col md:tw-flex-row
					tw-items-center tw-justify-center tw-relative tw-gap-0 md:tw-gap-3"
				>
					<div class="tw-mb-4 lg:tw-m-0">
						<div
							class="indicator tw-relative"
							style="width: 10.25rem; height: 10.25rem;"
						>
							<kv-progress-circle
								class="tw-absolute tw-h-full tw-w-full tw-z-2"
								:stroke-width="12"
								:value="goalPercent"
								:arc-scale=".8"
								:rotate="36"
								:show-number="false"
							/>
							<kv-contentful-img
								v-if="imageUrl"
								class="indicator__image tw-absolute tw-h-full tw-w-full tw-z-1"
								:class="isLoading ? 'tw-opacity-low' : ''"
								:contentful-src="imageUrl"
								alt=""
								fallback-format="gif"
								:height="164"
								:width="164"
							/>
							<div class="tw-flex tw-justify-center tw-w-full tw-absolute tw-bottom-0">
								<p
									class="tw-w-10 tw-text-center tw-z-2 tw-font-medium tw-text-small
										tw-my-0"
									style="line-height: 1.2;"
									v-html="goalStatus"
								>
								</p>
							</div>
						</div>
					</div>
					<div class="tw-text-center md:tw-text-left">
						<h3 class="tw-inline" v-html="headline"></h3>
						<a
							v-if="disclaimer"
							@click="scrollToSection('#disclaimers')"
							class="tw-text-primary"
							v-kv-track-event="['promo', 'click-Contentful-banner', 'disclaimer-superscript', '1']"
						>
							<sup>
								1
							</sup>
						</a>
						<div
							class="tw-mb-3 tw-mt-0.5 lg:tw-mb-2 tw-whitespace-pre-wrap md:tw-max-w-sm"
							v-html="body"
						></div>
						<div
							class="tw-flex tw-flex-wrap tw-list-none tw-m-0 tw-gap-x-0.5
									tw-gap-y-2 md:tw-gap-1.5 tw-justify-between"
						>
							<kv-button
								v-for="(buttonAmount, index) in buttonAmounts"
								:key="`amount-${index}`"
								variant="secondary"
								class="tw-border-brand tw-text-brand"
								@click.native="onClickAmountBtn(buttonAmount)"
								v-kv-track-event="[
									'promo',
									'click-amount-btn',
									'AppealBanner',
									buttonAmount,
									buttonAmount
								]"
							>
								${{ buttonAmount }}
							</kv-button>
							<kv-button
								variant="secondary"
								class="tw-w-full md:tw-w-auto"
								href="/donate/supportus"
								v-kv-track-event="['promo', 'click-other', 'AppealBanner', 0, 0]"
							>
								Other
							</kv-button>
						</div>
						<button
							class="tw-flex tw-items-center tw-justify-center tw-absolute tw-h-4 tw-w-4
								tw-top-0 tw-right-2 tw-rounded
								hover:tw-bg-tertiary focus:tw-bg-tertiary"
							@click="onClickToggleBanner"
							v-kv-track-event="[
								'promo',
								'click-appeal-banner-close',
								'x',
							]"
						>
							<kv-material-icon
								class="tw-h-2 tw-w-2"
								:icon="mdiClose"
							/>
						</button>
					</div>
				</div>
			</kv-page-container>
		</div>
		<!-- closed banner -->
		<div
			class="tw-bg-brand-100"
			v-if="!isOpen"
			key="closedBanner"
		>
			<kv-page-container>
				<div
					class="tw-flex tw-items-center tw-justify-center tw-text-left tw-text-primary
						tw-m-0 tw-py-1"
				>
					<div class="tw-mx-2">
						<h4 class="tw-inline" v-html="headline"></h4>
						<a
							v-if="disclaimer"
							href="#disclaimers"
							v-kv-track-event="['promo', 'click-Contentful-banner', 'disclaimer-superscript', '1']"
						>
							<sup>
								1
							</sup>
						</a>
					</div>
					<div class="tw-flex-shrink tw-mx-2">
						<kv-button
							@click.native="onClickToggleBanner"
							variant="primary"
							v-kv-track-event="[
								'promo',
								'click-appeal-banner-open',
								'Donate'
							]"
						>
							Donate
						</kv-button>
					</div>
				</div>
			</kv-page-container>
		</div>
	</div>
</template>

<script>
// import numeral from 'numeral';
import smoothReflow from 'vue-smooth-reflow';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';

import { mdiClose } from '@mdi/js';
import KvProgressCircle from '@/components/Kv/KvProgressCircle';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

export default {
	name: 'AppealBannerCircular',
	data() {
		return {
			mdiClose
		};
	},
	components: {
		KvButton,
		KvProgressCircle,
		KvContentfulImg,
		KvPageContainer,
		KvMaterialIcon
	},
	mixins: [smoothReflow, smoothScrollMixin],
	props: {
		targetAmount: {
			type: Number,
			default: null,
		},
		amountRaised: {
			type: Number,
			default: null,
		},
		buttonAmounts: {
			type: Array,
			default() { return [20, 35, 50]; },
		},
		headline: {
			type: String,
			default: '',
		},
		body: {
			type: String,
			default: '',
		},
		imageUrl: {
			type: String,
			default: ''
		},
		isOpen: {
			type: Boolean,
			default: true
		},
		disclaimer: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		isLoading() {
			return this.amountRaised === null;
		},
		goalPercent() {
			if (!this.targetAmount || !this.amountRaised) {
				return 0;
			}
			const percent = Math.floor((this.amountRaised / this.targetAmount) * 100);
			return percent > 100 ? 100 : percent;
		},

		goalStatus() {
			if (this.isLoading) {
				return 'loading...';
			}
			if (this.goalPercent === 100) {
				return 'Goal <br />reached!';
			}
			const nearestThousand = parseFloat(Number((this.targetAmount - this.amountRaised) / 1000).toPrecision(3));
			// const nearestThousand = numeral((this.targetAmount - this.amountRaised) / 1000).format('0.[00]');
			return `$${nearestThousand}k <br />to goal`;
		}
	},
	methods: {
		onClickAmountBtn(amount) {
			this.$emit('amount-selected', Number(amount));
		},
		onClickToggleBanner() {
			this.$emit('toggle-banner', !this.isOpen);
		},
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = elementToScrollTo?.offsetTop ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
	},
	mounted() {
		this.$smoothReflow();
	},
};
</script>
