<template>
	<section class="campaign-status section row align-center">
		<div class="small-12 large-8 align-self-middle columns">
			<div class="campaign-status__border">
				<div v-if="loadingPromotion" class="campaign-status__validating-promo">
					<p>
						<kv-loading-spinner class="campaign-status__validating-spinner" />
						Validating Promotion
					</p>
				</div>

				<div v-if="!promoApplied && promoErrorMessage" class="columns campaign-status__text-container">
					<p class="campaign-status__error-message">
						<kv-icon name="error" /> {{ promoErrorMessage }}
					</p>
				</div>

				<div v-if="promoApplied && !promoErrorMessage" class="columns campaign-status__text-container">
					<p class="campaign-status__header campaign-status__validated-message">
						<template v-if="promoAmount === '$0.00'">
							Calculating promotion...
						</template>
						<template v-else>
							<!-- eslint-disable-next-line max-len -->
							<span class="campaign-status__currency-icon"><kv-icon name="currency-usd" /></span>
							You have <span class="campaign-status__promo-amount">${{ promoAmount | numeral }}</span>
							<span v-if="promoName">from {{ promoName }}</span>
							to lend!
						</template>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<kv-button @click.native="$emit('show-checkout')" class="text-link">
							Show Checkout
						</kv-button>
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvButton,
		KvIcon,
		KvLoadingSpinner,
	},
	props: {
		loadingPromotion: {
			type: Boolean,
			default: false
		},
		promoErrorMessage: {
			type: String,
			default: null
		},
		promoApplied: {
			type: Boolean,
			default: false
		},
		promoAmount: {
			type: String,
			default: '$0.00'
		},
		promoName: {
			type: String,
			default: null
		}
	},
	data() {
		return {

		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-status {
	max-width: inherit;
	padding: 1rem;
	background-color: rgba(0, 0, 0, 0.1);

	&__border {
		// min-height: 10rem;
		position: relative;
		z-index: 1;
		margin: 0 rem-calc(10);
		padding: 0;

		@include breakpoint(xga) {
			margin: 0 auto;
		}
	}

	&__validating-promo {
		text-align: center;
		width: auto;
		margin: 0;

		::v-deep >>> .loading-overlay .spinner-wrapper {
			position: relative;
		}

		::v-deep .loading-spinner {
			width: 1.2rem;
			height: 1.2rem;
			vertical-align: sub;
		}

		p {
			position: relative;
		}
	}

	&__validated-message,
	&__error-message {
		font-weight: bold;
		margin: 0;
		width: auto;

		::v-deep .wrapper {
			vertical-align: sub;
		}

		::v-deep .icon {
			width: 1.2rem;
			height: 1.2rem;
		}

		::v-deep .icon-error {
			fill: $kiva-accent-red;
		}

		::v-deep .icon-confirmation {
			fill: $kiva-green;
		}
	}
}
</style>
