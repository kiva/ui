<template>
	<div class="thanks-page">
		<!-- Thanks Page V2 - Desktop -->
		<div
			class="row show-for-large thanks-page--large-up"
			data-testid="thanks-page-large-up"
		>
			<div class="small-6 columns hide-for-print">
				<kv-icon-button
					data-testid="thanks-page-button-guest"
					class="thanks-page__icon-button expanded"
					v-if="showGuestUpsell"
					:class="{ active: isGuestSelected }"
					@click.native="setVisibleSection('guest')"
				>
					<template #icon-left>
						<kv-icon
							class="tw-w-2.5"
							name="alert-circle"
						/>
					</template>
					Create your account
					<template #icon-right>
						<kv-icon
							class="arrow-icon tw-w-3 tw-h-3"
							:class="{ obfuscate: !isGuestSelected }"
							name="arrow"
						/>
					</template>
				</kv-icon-button>
				<kv-icon-button
					data-testid="thanks-page-button-mg"
					class="thanks-page__icon-button expanded"
					v-if="showMgCta"
					:class="{ active: isMgSelected }"
					@click.native="setVisibleSection('mg')"
				>
					<template #icon-left>
						<kv-icon
							class="tw-w-2.5"
							name="alert-circle"
						/>
					</template>
					Monthly Good
					<template #icon-right>
						<kv-icon
							class="arrow-icon tw-w-3 tw-h-3"
							:class="{ obfuscate: !isMgSelected }"
							name="arrow"
						/>
					</template>
				</kv-icon-button>
				<kv-icon-button
					data-testid="thanks-page-button-receipt"
					class="thanks-page__icon-button expanded"
					:class="{ active: isReceiptSelected }"
					@click.native="setVisibleSection('receipt')"
				>
					<template #icon-left>
						<kv-icon
							class="tw-w-2.5"
							name="receipt-outline"
						/>
					</template>
					Order Confirmation
					<template #icon-right>
						<kv-icon
							class="arrow-icon tw-w-3 tw-h-3"
							:class="{ obfuscate: !isReceiptSelected }"
							name="arrow"
						/>
					</template>
				</kv-icon-button>
				<kv-icon-button
					data-testid="thanks-page-button-share"
					class="thanks-page__icon-button expanded"
					:class="{ active: isShareSelected }"
					@click.native="setVisibleSection('share')"
					v-if="showShare"
				>
					<template #icon-left>
						<kv-icon
							class="tw-w-2.5"
							name="share"
						/>
					</template>
					Share
					<template #icon-right>
						<kv-icon
							class="arrow-icon tw-w-3 tw-h-3"
							:class="{ obfuscate: !isShareSelected }"
							name="arrow"
						/>
					</template>
				</kv-icon-button>
			</div>
			<div class="small-6 columns expand-for-print">
				<div
					v-if="showGuestUpsell"
					v-show="isGuestSelected"
					class="thanks-page__content-area thanks-page__content-area--guest"
					data-testid="thanks-page-content-guest"
				>
					<slot name="guest">
					</slot>
				</div>
				<div
					v-if="showMgCta"
					v-show="isMgSelected"
					class="thanks-page__content-area thanks-page__content-area--mg"
					data-testid="thanks-page-content-mg"
				>
					<slot name="mg">
					</slot>
				</div>
				<div
					v-show="isReceiptSelected"
					class="thanks-page__content-area thanks-page__content-area--receipt"
					data-testid="thanks-page-content-receipt"
				>
					<slot name="receipt">
					</slot>
				</div>
				<div
					v-show="isShareSelected"
					class="thanks-page__content-area thanks-page__content-area--share"
					data-testid="thanks-page-content-share"
				>
					<slot name="share">
					</slot>
				</div>
			</div>
		</div>

		<!-- Thanks Page V2 - Mobile -->
		<div
			class="row hide-for-large thanks-page--medium-down"
			data-testid="thanks-page-medium-down"
		>
			<div class="small-12 columns">
				<!-- guest -->
				<div
					class="kv-accordion thanks-page__content-area thanks-page__content-area--guest"
					:class="{
						'kv-accordion--open' : isGuestSelected,
					}"
					v-if="showGuestUpsell"
				>
					<kv-icon-button
						data-testid="thanks-page-guest-button" class="thanks-page__icon-button expanded"
						:class="{ active: isGuestSelected }"
						aria-controls="`kv-accordion-mg-accordion`"
						:aria-expanded="isGuestSelected ? 'true' : 'false'"
						@click.native="setVisibleSection('guest')"
					>
						<template #icon-left>
							<kv-icon
								class="tw-w-2.5"
								name="alert-circle"
							/>
						</template>
						Create your account
						<template #icon-right>
							<kv-icon
								class="tw-w-2.5 tw-h-2.5"
								name="fat-chevron"
								:from-sprite="true"
							/>
						</template>
					</kv-icon-button>
					<kv-expandable>
						<div
							data-testid="thanks-page-accordion-guest"
							class="kv-accordion__pane"
							id="kv-accordion-guest-accordion"
							v-show="isGuestSelected"
							:aria-hidden="isGuestSelected ? 'false' : 'true'"
						>
							<hr>
							<slot name="guest">
							</slot>
						</div>
					</kv-expandable>
				</div>
				<!-- mg -->
				<div
					class="kv-accordion thanks-page__content-area thanks-page__content-area--mg"
					:class="{
						'kv-accordion--open' : isMgSelected,
					}"
					v-if="showMgCta"
				>
					<kv-icon-button
						data-testid="thanks-page-mg-button" class="thanks-page__icon-button expanded"
						:class="{ active: isMgSelected }"
						aria-controls="`kv-accordion-mg-accordion`"
						:aria-expanded="isMgSelected ? 'true' : 'false'"
						v-kv-track-event="['thanks', 'click-Monthly-Good', 'Monthly Good']"
						@click.native="setVisibleSection('mg')"
					>
						<template #icon-left>
							<kv-icon
								class="tw-w-2.5"
								name="alert-circle"
							/>
						</template>
						Monthly Good
						<template #icon-right>
							<kv-icon
								class="tw-w-2.5 tw-h-2.5"
								name="fat-chevron"
								:from-sprite="true"
							/>
						</template>
					</kv-icon-button>
					<kv-expandable>
						<div
							data-testid="thanks-page-accordion-mg"
							class="kv-accordion__pane"
							id="kv-accordion-mg-accordion"
							v-show="isMgSelected"
							:aria-hidden="isMgSelected ? 'false' : 'true'"
						>
							<hr>
							<slot name="mg">
							</slot>
						</div>
					</kv-expandable>
				</div>
				<!-- receipt -->
				<div
					class="kv-accordion thanks-page__content-area thanks-page__content-area--receipt"
					:class="{
						'kv-accordion--open' : isReceiptSelected,
					}"
				>
					<kv-icon-button
						data-testid="thanks-page-receipt-button" class="thanks-page__icon-button expanded"
						:class="{ active: isReceiptSelected }"
						aria-controls="`kv-accordion-receipt-accordion`"
						:aria-expanded="isReceiptSelected ? 'true' : 'false'"
						v-kv-track-event="['thanks', 'click-Order-Confirmation', 'Order Confirmation']"
						@click.native="setVisibleSection('receipt')"
					>
						<template #icon-left>
							<kv-icon
								class="tw-w-2.5"
								name="receipt-outline"
							/>
						</template>
						Order Confirmation
						<template #icon-right>
							<kv-icon
								class="tw-w-2.5 tw-h-2.5"
								name="fat-chevron"
								:from-sprite="true"
							/>
						</template>
					</kv-icon-button>
					<kv-expandable>
						<div
							data-testid="thanks-page-accordion-receipt"
							class="kv-accordion__pane"
							id="kv-accordion-receipt-accordion"
							v-show="isReceiptSelected"
							:aria-hidden="isReceiptSelected ? 'false' : 'true'"
						>
							<hr>
							<slot name="receipt">
							</slot>
						</div>
					</kv-expandable>
				</div>
				<!-- share -->
				<div
					class="kv-accordion thanks-page__content-area thanks-page__content-area--share"
					:class="{
						'kv-accordion--open' : isShareSelected,
					}"
					v-if="showShare"
				>
					<kv-icon-button
						data-testid="thanks-page-share-button" class="thanks-page__icon-button expanded"
						:class="{ active: isShareSelected }"
						aria-controls="`kv-accordion-share-accordion`"
						:aria-expanded="isShareSelected ? 'true' : 'false'"
						v-kv-track-event="['thanks', 'click-Share', 'Share']"
						@click.native="setVisibleSection('share')"
					>
						<template #icon-left>
							<kv-icon
								class="tw-w-2.5"
								name="share"
							/>
						</template>
						Share
						<template #icon-right>
							<kv-icon
								class="tw-w-3 tw-h-2.5"
								name="fat-chevron"
								:from-sprite="true"
							/>
						</template>
					</kv-icon-button>
					<kv-expandable>
						<div
							data-testid="thanks-page-maccordion-share"
							class="kv-accordion__pane"
							id="kv-accordion-share-accordion"
							v-show="isShareSelected"
							:aria-hidden="isShareSelected ? 'false' : 'true'"
						>
							<hr>
							<slot name="share">
							</slot>
						</div>
					</kv-expandable>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvIconButton from '@/components/Kv/KvIconButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';

export default {
	name: 'ThanksLayoutV2',
	components: {
		KvExpandable,
		KvIcon,
		KvIconButton,
	},
	props: {
		showGuestUpsell: {
			type: Boolean,
			default: false
		},
		showMgCta: {
			type: Boolean,
			default: false
		},
		showShare: {
			type: Boolean,
			default: true
		}
	},
	data() {
		let visibleSection = 'receipt';
		if (this.showGuestUpsell) {
			visibleSection = 'guest';
		} else if (this.showShare) {
			visibleSection = 'share';
		} else if (this.showMgCta) {
			visibleSection = 'mg';
		}

		return {
			isMobile: false,
			visibleSection,
		};
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 681;
		},
		setVisibleSection(section) {
			this.visibleSection = section;
		}
	},
	computed: {
		isAdSelected() {
			return this.visibleSection === 'ad';
		},
		isGuestSelected() {
			return this.visibleSection === 'guest';
		},
		isMgSelected() {
			return this.visibleSection === 'mg';
		},
		isReceiptSelected() {
			return this.visibleSection === 'receipt';
		},
		isShareSelected() {
			return this.visibleSection === 'share';
		}
	},
	beforeDestroy() {
		window.removeEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));
	},
	mounted() {
		window.addEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));

		this.determineIfMobile();
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

// We use v-deep to overwrite slot item styles for this context without
// modifying the thanks page v1 styles or the slotted in components

@media print {
	.expand-for-print {
		width: 100%;
		max-width: 100%;
		flex: 1;
	}
}

.thanks-page {
	margin: 0 1rem 2rem 1rem;
	width: 100%;

	&__content-area {
		border-radius: rem-calc(10);
		text-align: left;
		width: 100%;
		display: inline-block;

		::v-deep .monthly-good-cta,
		::v-deep .checkout-receipt,
		::v-deep .share {
			text-align: left;

			&__headline {
				text-align: left;
				margin-top: 0;
				margin-bottom: 1.5rem;
			}

			&__subhead {
				margin-bottom: 1rem;
			}
		}
	}

	&__content-area--share {
		::v-deep {
			$loan-circle-size: rem-calc(70);
			$loan-circle-margin: 1rem;
			$loan-triangle-size: rem-calc(12);

			// layout of blocks
			.share {
				padding: 1.5rem 1.5rem 0.5rem 1.5rem;

				&__wrapper {
					@include breakpoint(large) {
						flex-direction: column;
						flex-wrap: nowrap;
					}
				}

				&__loans {
					@include breakpoint(large) {
						width: 100%;
					}
				}

				&__message {
					@include breakpoint(large) {
						margin: 1rem 0;
					}
				}

				&__social {
					@include breakpoint(large) {
						width: auto;
					}
				}
			}

			// blocks
			.loans {
				@include breakpoint(large) {
					flex-direction: row;
				}

				&__circle {
					@include breakpoint(large) {
						margin: 0 1rem 0 0;
					}
				}
			}

			.message {
				&__triangle {
					@include breakpoint(large) {
						// triangle fill
						&::after {
							top: $loan-triangle-size * -2 + rem-calc(1);
							left: $loan-triangle-size;
							border-width: $loan-triangle-size;
							border-color: transparent transparent #fff transparent;
						}

						// triangle border
						&::before {
							top: $loan-triangle-size * -2 - rem-calc(1);
							left: $loan-triangle-size - rem-calc(1);
							border-width: $loan-triangle-size + rem-calc(1);
							border-color: transparent transparent $subtle-gray transparent;
						}
					}

					@function circleoffset($index) {
						@return calc(
							#{$loan-circle-size * $index} +
							#{$loan-circle-size / 2} -
							#{$loan-triangle-size * 2} +
							#{$index * $loan-circle-margin}
						);
					}
					$offset: rem-calc(1);

					&--loan1 {
						@include breakpoint(large) {
							transform: translate(circleoffset(0), $offset);
						}
					}

					&--loan2 {
						@include breakpoint(large) {
							transform: translate(circleoffset(1), $offset);
						}
					}

					&--loan3 {
						@include breakpoint(large) {
							transform: translate(circleoffset(2), $offset);
						}
					}
				}
			}

			.social {
				@include breakpoint(large) {
					flex-direction: row;
				}

				&__btn {
					@include breakpoint(large) {
						width: calc(50% - 0.5rem);
						margin: 0 1rem 1rem 0;

						// &:last-child {
						// 	margin-bottom: auto;
						// }

						&:nth-child(2n) {
							margin-right: 0;
						}
					}
				}
			}
		}
	}

	&__content-area--receipt {
		::v-deep {
			.checkout-receipt {
				padding: 1.5rem;
			}

			.checkout-receipt__wrapper {
				border: 0;
				padding: 0;
			}
		}
	}
}

// Mobile/Medium Styles
.thanks-page--medium-down {
	.thanks-page__content-area.kv-accordion--open {
		background-color: rgb(var(--bg-primary));
	}

	.kv-accordion {
		margin-bottom: 1.25rem;
		border-radius: rem-calc(10);

		.kv-accordion__pane {
			border-radius: rem-calc(10);

			hr {
				margin: 0.25rem 1.25rem 0;
			}
		}
	}

	.thanks-page__icon-button {
		margin-bottom: 0;
	}
}

// Desktop/Large Styles
.thanks-page--large-up {
	.thanks-page__content-area {
		background-color: rgb(var(--bg-primary));
	}

	.thanks-page__icon-button {
		// typical .hide class has way too much specificity for the icon to still display on hover.
		.arrow-icon.obfuscate {
			display: none;
		}

		&:hover {
			.arrow-icon {
				display: inline-block;
			}
		}
	}
}
</style>
