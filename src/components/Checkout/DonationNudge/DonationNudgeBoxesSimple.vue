<template>
	<div class="donation-nudge-boxes-container">
		<div class="nudge-boxes">
			<div
				v-for="({percentage, appeal}, index) in percentageRows"
				:key="percentage"
				class="nudge-box-wrapper nudge-box-wrapper"
				@click="setDonationAndClose(getDonationByPercent(percentage))"
			>
				<div class="row nudge-box-row">
					<div class="small-5 columns nudge-box-column nudge-box-column-button">
						<kv-button
							class="smallest nudge-box-button"
							:id="`button-number-${index}`"
						>
							${{ getDonationByPercent(percentage) }}
						</kv-button>
					</div>
					<div class="small-7 columns nudge-box-column nudge-box-column-appeal">
						{{ appeal }}
					</div>
				</div>
			</div>
			<div
				v-if="hasCustomDonation"
				class="nudge-box-wrapper nudge-box-wrapper nudge-box-wrapper-custom-donation"
			>
				<div class="row nudge-box-row">
					<div class="small-5 columns nudge-box-column nudge-box-column-button">
						<input
							type="text"
							ref="customDonationInputMobile"
							name="customDonationInputTextMobile"
							maxlength="10"
							class="nudge-box-input"
							@blur="validateInput"
							@focus="focusInput"
						>
					</div>
					<div class="small-7 columns nudge-box-column">
						<div v-if="!hasEnteredCustomBox">
							You decide — enter custom amount
						</div>
						<kv-button
							v-else
							class="smallest nudge-box-button"
							@click.native="setCustomDonationAndClose"
						>
							Apply
						</kv-button>
					</div>
				</div>
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
	data() {
		return {
			hasEnteredCustomBox: false,
		};
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
		currentDonationAmount: {
			type: String,
			default: ''
		},
	},
	computed: {
		customDonationSelected() {
			const donationOptions = this.percentageRows
				.map(({ percentage }) => numeral(this.getDonationByPercent(percentage)).format('$0.00'));
			return !donationOptions.includes(this.currentDonationAmount);
		},
	},
	methods: {
		formatAndSubmitOnEnter() {
			const customInput = document.getElementById('customDonationInput');
			const customInputButton = document.querySelector('.custom-amount-submit');

			// Setting up listener for customInput field
			customInput.addEventListener('keyup', event => {
				// When keyup event happens on the Enter key perform the following fuctions
				if (event.keyCode === 13) {
					customInput.blur();
					customInputButton.click();
				}
			});
		},
		openNudgeLightbox() {
			if (this.currentDonationAmount && this.customDonationSelected) {
				this.setInputs(this.currentDonationAmount);
			}
			setTimeout(() => { document.getElementById('button-number-0').focus(); }, 500);
		},
		getDonationByPercent(percent) {
			return numeral(this.loanReservationTotal * (percent / 100)).format('0.00');
		},
		setCustomDonationAndClose() {
			this.setDonationAndClose(this.$refs.customDonationInputMobile.value);
		},
		setInputs(value) {
			this.$refs.customDonationInputMobile.value = value;
		},
		validateInputDesktop() {
			this.setInputs(numeral(this.$refs.customDonationInputDesktop.value).format('$0,0.00'));
		},
		validateInput() {
			this.setInputs(numeral(this.$refs.customDonationInputMobile.value).format('$0,0.00'));
		},
		focusInput() {
			this.hasEnteredCustomBox = true;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donation-nudge-boxes-container {
	$nudge-box-border: 1px solid #eee;

	.nudge-box-shared {
		cursor: pointer;
		user-select: none;
		line-height: rem-calc(26);
	}

	.nudge-boxes {
		text-align: left;

		.nudge-box-wrapper {
			@extend .nudge-box-shared;

			padding: 1.25rem rem-calc(14);
			border-bottom: $nudge-box-border;

			&.nudge-box-wrapper-custom-donation {
				display: flex;
				flex-direction: column;
				cursor: initial;

				input {
					height: rem-calc(34);
					width: rem-calc(80);
					margin-bottom: rem-calc(-2);
					text-align: center;

					@include breakpoint(medium) {
						height: rem-calc(48);
						width: rem-calc(116);
					}
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
						width: rem-calc(80);

						@include breakpoint(medium) {
							width: rem-calc(116);
						}
					}
				}
			}
		}
	}
}
</style>
