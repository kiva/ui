<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-top="true"
		:no-padding-bottom="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container" class="row collapse">
			<div id="nudge-donation-left" class="show-for-large columns large-5">
				<div id="borrower-image-desktop-container">
					<img
						id="nudge-donation-borrower-image-desktop"
						src="~@/assets/images/checkout/donation-nudge/nudge-borrower-desktop.jpg"
					>
				</div>
				<div id="nudge-donation-charity-navigator-wrapper">
					<kv-charity-navigator
						class="nudge-donation-charity-navigator"
						title="Kiva has been awarded Charity Navigator's highest rating for operational efficiency."
						:wide-icon="true"
						subtitle=""
					/>
				</div>
			</div>
			<div id="nudge-donation-right" class="columns large-7">
				<donation-nudge-intro
					:header="header"
					:hide-header-on-mobile="!experimentalHeader"
					:description="description"
					:no-padding-description="true"
					:mobile-image-url="mobileImageUrl"
				/>
				<donation-nudge-boxes
					id="nudge-donation-top-boxes-wrapper"
					:percentage-rows= "percentageRows"
					:has-custom-donation="hasCustomDonation"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
					:desktop-using-radio-buttons="true"
				/>
				<div class="hide-for-large">
					<a id="no-donation-link" @click="setDonationAndClose(0)">No donation to Kiva</a>
				</div>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import DonationNudgeBoxes from '@/components/Checkout/DonationNudge/DonationNudgeBoxes';
import DonationNudgeIntro from '@/components/Checkout/DonationNudge/DonationNudgeIntro';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';

// eslint-disable-next-line max-len
const experimentalMobileImage = require('@/assets/images/checkout/donation-nudge/nudge-borrower-mobile-experimental.jpg');
const mobileImage = require('@/assets/images/checkout/donation-nudge/nudge-borrower-mobile.jpg');

export default {
	components: {
		KvButton,
		KvLightbox,
		KvCharityNavigator,
		DonationNudgeBoxes,
		DonationNudgeIntro,
	},
	props: {
		nudgeLightboxVisible: {
			type: Boolean,
			required: true,
		},
		closeNudgeLightbox: {
			type: Function,
			required: true,
		},
		updateDonationTo: {
			type: Function,
			required: true,
		},
		loanCount: {
			type: Number,
			default: 0
		},
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		hasCustomDonation: {
			type: Boolean,
			default: false,
		},
		header: {
			type: String,
			default: '',
		},
		experimentalHeader: {
			type: Boolean,
			default: false,
		},
		description: {
			type: String,
			default: '',
		},
		percentageRows: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		mobileImageUrl() {
			return this.experimentalHeader ? experimentalMobileImage : mobileImage;
		}
	},
	methods: {
		setDonationAndClose(amount) {
			this.updateDonationTo(amount);
			this.$kvTrackEvent('basket', 'Update Loan Amount', 'Update Success', amount * 100);
			this.closeNudgeLightbox();
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#nudge-donation-container {
	.nudge-lightbox-row-padding {
		padding-left: 2.5rem;
		padding-right: 2.5rem;
	}

	#nudge-donation-left {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		background: #F1F1F0;

		#nudge-donation-charity-navigator-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			height: 100%;

			.nudge-donation-charity-navigator {
				padding: 1rem;

				#charity-navigator-text {
					padding: 0 50px;
				}

				#charity-navigator-image-container {
					max-width: 90%;
					margin: 1rem auto;
				}

				#charity-navigator-tax-deduction {
					font-size: 0.8rem;
				}
			}
		}
	}

	#nudge-donation-right {
		padding-bottom: 3rem;
		background: $white;
		padding-top: 2.5rem;
		text-align: center;

		@include breakpoint(medium) {
			padding-top: 4rem;
		}

		@include breakpoint(large) {
			padding-top: 4.75rem;
			text-align: left;
			background: #F8F8F8;
		}

		#nudge-donation-top-boxes-wrapper {
			@extend .nudge-lightbox-row-padding;

			margin-bottom: 1.6rem;
		}

		#no-donation-link {
			color: #4F4F4F;
			text-decoration: underline;
		}
	}
}
</style>
