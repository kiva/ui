<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-right="true"
		:no-padding-bottom="true"
		:no-padding-left="true"
		@lightbox-closed="closeNudgeLightbox"
	>
		<div id="nudge-donation-container">
			<div id="nudge-donation-top">
				<div id="nudge-donation-top-header" class="impact-text">
					We rely on donations to reach the people who need it the most
				</div>
				<div class="row" id="nudge-donation-top-content-row">
					<div class="small-10 small-offset-1 columns">
						<!-- eslint-disable-next-line max-len -->
						Reaching financially excluded people around the world requires things like performing due diligence in over 80 countries, training hundreds of volunteer translators, and maintaining the infrastructure to facilitate over $1B in loans.
					</div>
				</div>
				<kv-donation-nudge-boxes
					id="nudge-donation-top-boxes-wrapper"
					:percentage-rows= "percentageRows"
					:has-custom-donation="true"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
				/>
				<div><a id="no-donation-link" @click="setDonationAndClose(0)">No donation to Kiva</a></div>
			</div>
			<div id="nudge-donation-bottom" class="show-for-large">
				<div class="row">
					<div class="small-8 medium-6 small-offset-2 medium-offset-3 columns">
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
	},
	data() {
		return {
			percentageRows: [
				{
					percentage: 10,
					appeal: 'Cover some of Kiva\'s costs',
					appealIsHorizontallyPadded: true,
				},
				{
					percentage: 15,
					appeal: `Cover the cost to facilitate ${this.loanCount > 1 ? 'these loans' : 'this loan'}`,
					appealIsHorizontallyPadded: false,
				},
				{
					percentage: 20,
					appeal: 'Cover some of Kiva\'s costs',
					appealIsHorizontallyPadded: false,
				},
			],
		};
	},
	methods: {
		setDonationAndClose(amount) {
			this.updateDonationTo(amount);
			this.closeNudgeLightbox();
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#nudge-donation-container {
	.nudge-lightbox-row-padding {
		padding-left: 3rem;
		padding-right: 3rem;
	}

	text-align: center;

	#nudge-donation-top {
		padding-bottom: 3rem;
		background: #F8F8F8;

		#nudge-donation-top-header {
			@extend .nudge-lightbox-row-padding;

			font-size: 1.6rem;
			font-weight: 500;
			color: #64B365;
			line-height: 1.9rem;
		}

		#nudge-donation-top-content-row {
			@extend .nudge-lightbox-row-padding;

			margin: 2rem auto;
			max-width: 47rem;
		}

		#nudge-donation-top-boxes-wrapper {
			@extend .nudge-lightbox-row-padding;

			margin-bottom: 2rem;
		}

		#no-donation-link {
			color: #4F4F4F;
			text-decoration: underline;
		}
	}

	#nudge-donation-bottom {
		padding: 2rem 3rem;
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
