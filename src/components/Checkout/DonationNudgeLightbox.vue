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
				<div class="nudge-box-row-container">
					<div class="row nudge-box-row">
						<div class="medium-4 columns nudge-box-top-container nudge-box-container">
							<div class="nudge-box-top nudge-box-padded">
								Cover some of Kiva's costs
							</div>
						</div>
						<div class="medium-4 columns nudge-box-top-container nudge-box-container">
							<div class="nudge-box-top">
								Cover the cost to facilitate {{ this.loanCount > 1 ? 'these loans' : 'this loan' }}
							</div>
						</div>
						<div class="medium-4 columns nudge-box-top-container nudge-box-container">
							<div class="nudge-box-top">
								Reach more people around the world!
							</div>
						</div>
					</div>
					<div class="row nudge-box-row">
						<div class="medium-4 columns nudge-box-middle-container nudge-box-container">
							<div class="nudge-box-middle">
								${{ getDonationByPercent(10) }}
							</div>
						</div>
						<div class="medium-4 columns nudge-box-middle-container nudge-box-container">
							<div class="nudge-box-middle">
								${{ getDonationByPercent(15) }}
							</div>
						</div>
						<div class="medium-4 columns nudge-box-middle-container nudge-box-container">
							<div class="nudge-box-middle">
								${{ getDonationByPercent(20) }}
							</div>
						</div>
					</div>
					<div class="row nudge-box-row">
						<div class="medium-4 columns nudge-box-bottom-container nudge-box-container">
							<div class="nudge-box-bottom">
								<kv-button
									@click.native="updateDonationTo(getDonationByPercent(10))"
									class="smaller nudge-box-button"
								>
									Select
								</kv-button>
							</div>
						</div>
						<div class="medium-4 columns nudge-box-bottom-container nudge-box-container">
							<div class="nudge-box-bottom">
								<kv-button
									@click.native="updateDonationTo(getDonationByPercent(10))"
									class="smaller nudge-box-button"
								>
									Select
								</kv-button>
							</div>
						</div>
						<div class="medium-4 columns nudge-box-bottom-container nudge-box-container">
							<div class="nudge-box-bottom">
								<kv-button
									@click.native="updateDonationTo(getDonationByPercent(10))"
									class="smaller nudge-box-button"
								>
									Select
								</kv-button>
							</div>
						</div>
					</div>
				</div>
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
import numeral from 'numeral';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';

export default {
	components: {
		KvButton,
		KvLightbox,
		KvCharityNavigator,
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
	methods: {
		getDonationByPercent(percent) {
			return numeral(this.loanReservationTotal * (percent / 100)).format('0.00');
		},
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

			margin: 2rem 0;
		}

		.nudge-box-row-container {
			@extend .nudge-lightbox-row-padding;

			max-width: 47rem;
			margin: 0 auto;

			.nudge-box-row {
				$nudge-box-border: 1px solid #eee;

				.nudge-box-shared {
					background: $white;
					border-left: $nudge-box-border;
					border-right: $nudge-box-border;
					padding: 0 0.5rem;
					height: 100%;
				}

				.nudge-box-container {
					.nudge-box-top {
						@extend .nudge-box-shared;

						padding-top: 1rem;
						border-top: $nudge-box-border;

						&.nudge-box-padded {
							padding-left: 2rem;
							padding-right: 2rem;
						}
					}

					.nudge-box-middle {
						@extend .nudge-box-shared;

						padding: 1.5rem 0;
						font-size: 1.5rem;
					}

					.nudge-box-bottom {
						@extend .nudge-box-shared;

						padding-bottom: 1rem;
						border-bottom: $nudge-box-border;

						@include breakpoint(large only) {
							button.button.smaller.nudge-box-button {
								padding: 0.75rem 1.5rem;
							}
						}
					}
				}
			}
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
