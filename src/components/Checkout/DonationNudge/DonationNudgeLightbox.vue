<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-bottom="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container">
			<div id="nudge-donation-top">
				<donation-nudge-intro
					:header="header"
					:description="description"
				/>
				<donation-nudge-boxes
					id="nudge-donation-top-boxes-wrapper"
					:percentage-rows= "percentageRows"
					:has-custom-donation="hasCustomDonation"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
				/>
				<div><a id="no-donation-link" @click="setDonationAndClose(0)">No donation to Kiva</a></div>
			</div>
			<div id="nudge-donation-bottom" class="show-for-large">
				<div class="row">
					<div class="large-10 large-offset-1 columns">
						<kv-charity-navigator
							title="Kiva has been awarded Charity Navigator's highest rating for operational efficiency."
							:wide-icon="true"
							subtitle="Your donation is eligible for a tax deduction if you live in the U.S."
						/>
					</div>
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

	text-align: center;

	#nudge-donation-top {
		padding-bottom: 3rem;
		background: #F8F8F8;

		#nudge-donation-top-boxes-wrapper {
			@extend .nudge-lightbox-row-padding;

			margin-bottom: 1.6rem;
		}

		#no-donation-link {
			color: #4F4F4F;
			text-decoration: underline;
		}
	}

	#nudge-donation-bottom {
		padding: 1rem 3rem 2rem 3rem;
		background: #F1F1F0;

		#charity-navigator-text {
			padding: 0 50px;
		}

		#charity-navigator-image-container {
			max-width: 50%;
			margin: 1rem auto;
		}

		#charity-navigator-tax-deduction {
			font-size: 0.8rem;
		}
	}
}
</style>
