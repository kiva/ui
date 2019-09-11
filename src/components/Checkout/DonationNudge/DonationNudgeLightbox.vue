<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-bottom="true"
		:no-padding-top="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container">
			<div id="nudge-donation-top">
				<donation-nudge-intro
					:header="header"
					:description="description"
				/>
				<donation-nudge-boxes
					ref="nudgeBoxes"
					id="nudge-donation-top-boxes-wrapper"
					:percentage-rows="percentageRows"
					:has-custom-donation="hasCustomDonation"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
					:current-donation-amount="currentDonationAmount"
				/>
				<div>
					<a
						id="no-donation-link"
						@click="setDonationAndClose(0, 'No Donation Link')"
						tabindex="12"
					>No donation to Kiva</a>
				</div>
			</div>
			<div id="nudge-donation-bottom" :class="{ 'show-for-large': !experimentalFooter}">
				<div class="row">
					<div class="large-10 large-offset-1 columns">
						<kv-charity-navigator
							v-if="!experimentalFooter"
							title="Kiva has been awarded Charity Navigator's highest rating for operational efficiency."
							:wide-icon="true"
							subtitle="Your donation is eligible for a tax deduction if you live in the U.S."
						/>
						<div v-else class="charity-overhead text-center">
							<h3><kv-icon name="info" /> <span>Did you know?</span></h3>
							<p>
								Kiva donations are more efficient than the average charity,
								which uses 37% on overhead. Kiva only asks for a 15% donation to help cover our costs.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '@/components/Kv/KvLightbox';
import KvIcon from '@/components/Kv/KvIcon';
import DonationNudgeBoxes from '@/components/Checkout/DonationNudge/DonationNudgeBoxes';
import DonationNudgeIntro from '@/components/Checkout/DonationNudge/DonationNudgeIntro';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';
import donationNudgeLightboxMixin from '@/components/Checkout/DonationNudge/donationNudgeLightboxMixin';

export default {
	components: {
		KvLightbox,
		KvIcon,
		KvCharityNavigator,
		DonationNudgeBoxes,
		DonationNudgeIntro,
	},
	mixins: [
		donationNudgeLightboxMixin,
	],
	props: {
		experimentalFooter: {
			type: Boolean,
			default: false,
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

	text-align: center;

	#nudge-donation-top {
		padding-bottom: 1.6rem;
		background: #F8F8F8;
		border-radius: rem-calc(4) rem-calc(4) 0 0;
		padding-top: 2.5rem;

		@include breakpoint(medium) {
			padding-top: 4rem;
		}

		@include breakpoint(large) {
			padding-top: 4.75rem;
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

	#nudge-donation-bottom {
		padding: 1.5rem 3rem 1.5rem 3rem;
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

		.charity-overhead {
			margin: 0.2rem 0;

			h3 {
				color: $kiva-text-medium;
				margin-bottom: 0.2rem;
				font-size: 1.375rem;

				.icon {
					fill: $kiva-text-medium;
					margin: 0.1rem 0.325rem 0 0;
					display: inline-block;
					vertical-align: text-top;
					width: 1.325rem;
					height: 1.325rem;
				}

				span {
					font-weight: 400;
					line-height: 1.75rem;
				}
			}

			p {
				fill: $kiva-text-medium;
				font-size: 1.125rem;
				line-height: 1.625rem;
			}
		}
	}
}
</style>
