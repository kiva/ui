<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-bottom="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container">
			<div id="nudge-donation-top">
				<div id="nudge-donation-top-header" class="impact-text">
					{{ header }}
				</div>
				<div class="row" id="nudge-donation-top-content-row">
					<div class="small-10 small-offset-1 columns" v-html="description"></div>
				</div>
				<kv-donation-nudge-boxes
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
import KvDonationNudgeBoxes from '@/components/Checkout/KvDonationNudgeBoxes';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';

export default {
	components: {
		KvButton,
		KvLightbox,
		KvCharityNavigator,
		KvDonationNudgeBoxes,
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

	#nudge-donation-top {
		padding-bottom: 3rem;
		background: #F8F8F8;

		#nudge-donation-top-header {
			@extend .nudge-lightbox-row-padding;

			font-size: rem-calc(20);
			font-weight: 500;
			color: #64B365;
			line-height: 1.9rem;

			@include breakpoint(medium) {
				font-size: 1.6rem;
			}
		}

		#nudge-donation-top-content-row {
			@extend .nudge-lightbox-row-padding;

			margin: 1.4rem auto;
			max-width: 47rem;
			font-size: rem-calc(14);
			line-height: rem-calc(24);

			@include breakpoint(medium) {
				font-size: 1rem;
			}
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
