<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-top="true"
		:no-padding-bottom="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container" class="row collapse">
			<div id="nudge-donation-left" class="show-for-large columns large-4">
				<div id="borrower-image-desktop-container">
					<img
						id="nudge-donation-borrower-image-desktop"
						src="~@/assets/images/checkout/donation-nudge/nudge-borrower-desktop.png"
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
			<div id="nudge-donation-right" class="columns large-8">
				<donation-nudge-intro
					:header="header"
					:description="''"
				/>
				<div id="borrower-image-mobile-container" class="hide-for-large">
					<img
						id="nudge-donation-borrower-image-mobile"
						src="~@/assets/images/checkout/donation-nudge/nudge-borrower-mobile.png"
					>
				</div>
				<donation-nudge-boxes
					id="nudge-donation-top-boxes-wrapper"
					:percentage-rows= "percentageRows"
					:has-custom-donation="hasCustomDonation"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
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
		loanHistoryCount: {
			type: Number,
			default: 0,
		},
		experimentalHeader: {
			type: Boolean,
			default: false,
		},
		experimentalDescription: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		header() {
			const newLoanCount = this.loanHistoryCount + this.loanCount;
			/* eslint-disable max-len */
			return this.experimentalHeader
				? `${this.loanCount > 1 ? 'These loans' : 'This loan'} will bring you to ${newLoanCount} ${newLoanCount > 1 ? 'loans' : 'loan'} made on Kiva!`
				: 'We rely on donations to reach the people who need it the most';
			/* eslint-enable max-len */
		},
		description() {
			/* eslint-disable max-len */
			return this.experimentalDescription
				? 'Did you know every $25 lent on Kiva costs over $3 to facilitate?<br>We rely on donations to reach the people who need it the most'
				: 'Reaching financially excluded people around the world requires things like performing due diligence in over 80 countries, training hundreds of volunteer translators, and maintaining the infrastructure to facilitate over $1B in loans.';
			/* eslint-enable max-len */
		},
		percentageRows() {
			const basePercentageRows = [
				{
					percentage: 15,
					appeal: `Cover the cost to facilitate ${this.loanCount > 1 ? 'these loans' : 'this loan'}`,
					appealIsHorizontallyPadded: false,
				},
				{
					percentage: 20,
					appeal: 'Reach more people around the world!',
					appealIsHorizontallyPadded: false,
				},
			];
			const lowPercentage = [{
				percentage: 10,
				appeal: 'Cover some of Kiva\'s costs',
				appealIsHorizontallyPadded: true,
			}];
			return this.hasCustomDonation ? basePercentageRows : lowPercentage.concat(basePercentageRows);
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
		background: #F8F8F8;
		padding-top: 2.5rem;

		@include breakpoint(medium) {
			padding-top: 4rem;
		}

		@include breakpoint(large) {
			padding-top: 4.75rem;
		}

		#borrower-image-mobile-container {
			@extend .nudge-lightbox-row-padding;

			margin-bottom: 1.4rem;
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
