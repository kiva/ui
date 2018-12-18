<template>
	<div class="donation-nudge-boxes-container">
		<div class="show-for-large nudge-boxes-desktop">
			<div class="row nudge-box-row">
				<div
					v-for="{percentage, appeal, appealIsHorizontallyPadded} in percentageRows"
					:key="percentage"
					class="medium-4 columns nudge-box-top-container nudge-box-container"
				>
					<div
						:class="`nudge-box-top ${appealIsHorizontallyPadded ? 'nudge-box-padded' : ''}`"
						@click="setDonationAndClose(getDonationByPercent(percentage))"
					>
						{{ appeal }}
					</div>
				</div>
				<!-- eslint-disable max-len -->
				<div
					v-if="hasCustomDonation"
					class="medium-4 columns nudge-box-top-container nudge-box-container nudge-box-custom-donation-container"
				>
					<!-- eslint-enable max-len -->
					<div
						class="nudge-box-top nudge-box-padded nudge-box-custom-donation"
					>
						Enter custom amount
					</div>
				</div>
			</div>
			<div class="row nudge-box-row">
				<div
					v-for="{percentage} in percentageRows"
					:key="percentage"
					class="medium-4 columns nudge-box-middle-container nudge-box-container"
				>
					<div
						class="nudge-box-middle"
						@click="setDonationAndClose(getDonationByPercent(percentage))"
					>
						${{ getDonationByPercent(percentage) }}
					</div>
				</div>
				<!-- eslint-disable max-len -->
				<div
					v-if="hasCustomDonation"
					class="medium-4 columns nudge-box-middle-container nudge-box-container nudge-box-custom-donation-container"
				>
					<!-- eslint-disable max-len -->
					<div
						class="nudge-box-middle nudge-box-custom-donation"
					>
						<input
							type="text"
							ref="customDonationInputDesktop"
							name="customDonationInputTextDesktop"
							maxlength="10"
							class="nudge-box-input nudge-box-input-desktop"
							@blur="validateInputDesktop"
						>
					</div>
				</div>
			</div>
			<div class="row nudge-box-row">
				<div
					v-for="{percentage} in percentageRows"
					:key="percentage"
					class="medium-4 columns nudge-box-bottom-container nudge-box-container"
				>
					<div
						class="nudge-box-bottom"
						@click="setDonationAndClose(getDonationByPercent(percentage))"
					>
						<kv-button class="smallest nudge-box-button">
							Select
						</kv-button>
					</div>
				</div>
				<div
					v-if="hasCustomDonation"
					class="medium-4 columns nudge-box-bottom-container nudge-box-container nudge-box-custom-donation-container"
				>
					<div
						class="nudge-box-bottom nudge-box-custom-donation"
						@click="setCustomDonationAndClose"
					>
						<kv-button class="smallest nudge-box-button">
							Submit
						</kv-button>
					</div>
				</div>
			</div>
		</div>
		<div class="hide-for-large nudge-boxes-mobile">
			<div
				v-for="{percentage, appeal} in percentageRows"
				:key="percentage"
				class="nudge-box-wrapper nudge-box-wrapper-mobile"
				@click="setDonationAndClose(getDonationByPercent(percentage))"
			>
				<div class="row nudge-box-row">
					<!-- eslint-disable max-len -->
					<div class="small-7 columns nudge-box-column nudge-box-column-appeal">
						<!-- eslint-enablemax-len -->
						{{ appeal }}
					</div>
					<div class="small-4 small-offset-1 columns nudge-box-column nudge-box-column-button">
						<kv-button
							class="smallest nudge-box-button"
						>
							${{ getDonationByPercent(percentage) }}
						</kv-button>
					</div>
				</div>
			</div>
			<div
				v-if="hasCustomDonation"
				class="nudge-box-wrapper nudge-box-wrapper-mobile nudge-box-wrapper-mobile-custom-donation"
			>
				<div>You decide — enter custom amount</div>
				<input
					type="text"
					ref="customDonationInputMobile"
					name="customDonationInputTextMobile"
					maxlength="10"
					class="nudge-box-input nudge-box-input-desktop"
					@blur="validateInputMobile"
				>
				<kv-button
					class="smallest nudge-box-button"
					@click.native="setCustomDonationAndClose"
				>
					Update Donation
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		percentageRows: {
			type: Array,
			required: true,
		},
		setDonationAndClose: {
			type: Function,
			required: true,
		},
		hasCustomDonation: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		getDonationByPercent(percent) {
			return numeral(this.loanReservationTotal * (percent / 100)).format('0.00');
		},
		setCustomDonationAndClose() {
			this.setDonationAndClose(this.$refs.customDonationInputDesktop.value);
		},
		setInputs(value) {
			this.$refs.customDonationInputDesktop.value = value;
			this.$refs.customDonationInputMobile.value = value;
		},
		validateInputDesktop() {
			this.setInputs(numeral(this.$refs.customDonationInputDesktop.value).format('$0,0.00'));
		},
		validateInputMobile() {
			this.setInputs(numeral(this.$refs.customDonationInputMobile.value).format('$0,0.00'));
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donation-nudge-boxes-container {
	$nudge-box-border: 1px solid #eee;

	.nudge-box-shared {
		background: $white;
		cursor: pointer;
		user-select: none;
		line-height: rem-calc(26);
	}

	.nudge-boxes-desktop {
		.nudge-box-row {
			.nudge-box-shared {
				border-left: $nudge-box-border;
				border-right: $nudge-box-border;
				padding: 0 0.5rem;
				height: 100%;

				&.nudge-box-padded {
					padding-left: 2rem;
					padding-right: 2rem;
				}

				&.nudge-box-custom-donation {
					border-left: none;
					border-right: none;
					background: initial;
					cursor: initial;
				}
			}

			.nudge-box-container {
				.nudge-box-top {
					@extend .nudge-box-shared;

					display: flex;
					align-items: center;
					justify-content: center;
					padding-top: 1rem;
					border-top: $nudge-box-border;
					font-size: rem-calc(18);

					&.nudge-box-custom-donation {
						border-top: none;
					}
				}

				.nudge-box-middle {
					@extend .nudge-box-shared;

					padding: 1.5rem 0;
					font-size: 1.5rem;
					font-weight: 500;

					.nudge-box-input {
						text-align: center;
						margin: 0 auto;

						&.nudge-box-input-desktop {
							max-width: rem-calc(115);
						}
					}
				}

				.nudge-box-bottom {
					@extend .nudge-box-shared;

					padding-bottom: 1rem;
					border-bottom: $nudge-box-border;

					&.nudge-box-custom-donation {
						border-bottom: none;
					}
				}
			}
		}
	}

	.nudge-boxes-mobile {
		text-align: left;

		.nudge-box-wrapper {
			@extend .nudge-box-shared;

			margin-bottom: 1rem;
			padding: 1rem rem-calc(14);
			border: $nudge-box-border;

			&.nudge-box-wrapper-mobile-custom-donation {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				cursor: initial;

				input {
					text-align: center;
				}
			}

			.nudge-box-row {
				.nudge-box-column {
					display: flex;
					align-items: center;

					&.nudge-box-column-appeal {
						justify-content: flex-start;
					}

					&.nudge-box-column-button {
						justify-content: flex-end;
					}

					.nudge-box-button {
						margin-bottom: 0;
					}
				}
			}
		}
	}
}
</style>
