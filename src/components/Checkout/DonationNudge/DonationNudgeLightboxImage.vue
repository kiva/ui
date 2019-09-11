<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-top="true"
		:no-padding-bottom="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container" class="row collapse">
			<div id="nudge-donation-left" class="columns large-6">
				<donation-nudge-intro
					:header="header"
					:description="description"
					:no-padding-description="true"
					:mobile-image-url="mobileImage"
					:hide-description-mobile="true"
				/>
				<donation-nudge-boxes-simple
					id="nudge-donation-top-boxes-wrapper"
					ref="nudgeBoxes"
					:percentage-rows="percentageRows"
					:has-custom-donation="hasCustomDonation"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
					:current-donation-amount="currentDonationAmount"
				/>
				<div class="no-donation-container" @click="setDonationAndClose(0, 'No Donation Link')">
					<kv-icon class="no-donation-x" name="x" />
					<div id="no-donation-link">
						No donation to Kiva
					</div>
				</div>
			</div>
			<div id="nudge-donation-right" class="show-for-large columns large-6">
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '@/components/Kv/KvLightbox';
import KvIcon from '@/components/Kv/KvIcon';
import DonationNudgeBoxesSimple from '@/components/Checkout/DonationNudge/DonationNudgeBoxesSimple';
import DonationNudgeIntro from '@/components/Checkout/DonationNudge/DonationNudgeIntro';
import donationNudgeLightboxMixin from '@/components/Checkout/DonationNudge/donationNudgeLightboxMixin';

// eslint-disable-next-line max-len
const mobileImage = require('@/assets/images/checkout/donation-nudge/nudge-fellow-mobile.jpg');

export default {
	components: {
		KvLightbox,
		KvIcon,
		DonationNudgeBoxesSimple,
		DonationNudgeIntro,
	},
	mixins: [
		donationNudgeLightboxMixin,
	],
	computed: {
		mobileImage() {
			return mobileImage;
		},
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
		padding-bottom: 2.5rem;
		background: $white;
		text-align: center;

		@include breakpoint(large) {
			padding-top: 2.5rem;
			text-align: left;
			background: #F8F8F8;
		}

		#nudge-donation-top-boxes-wrapper {
			@extend .nudge-lightbox-row-padding;

			margin-bottom: 1.6rem;
		}

		.no-donation-container {
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;

			.no-donation-x {
				width: 0.75rem;
				height: 0.75rem;
				stroke: #4F4F4F;
			}

			#no-donation-link {
				margin-left: 0.5rem;
				color: #4F4F4F;
				text-decoration: underline;
			}
		}
	}

	#nudge-donation-right {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		background: #F1F1F0 url('~@/assets/images/checkout/donation-nudge/nudge-fellow-desktop.jpg') center 20%;
		background-size: cover;
	}
}
</style>
