<template>
	<div class="donation-nudge-boxes-container">
		<div class="show-for-large nudge-boxes-desktop tw-text-center">
			<div v-if="!desktopUsingRadioButtons" class="nudge-box-button-container">
				<div class="row
				nudge-box-row tw-align-center tw-h-10 tw-my-2.5"
				>
					<div
						v-for="{percentage, appeal, appealIsHorizontallyPadded} in percentageRows"
						:key="percentage"
						class="medium-4 columns nudge-box-top-container nudge-box-container"
					>
						<div
							:class="`nudge-box-top tw-flex tw-align-center tw-justify-center tw-pt-4
							tw-bg-primary tw-cursor-pointer tw-select-none
							${appealIsHorizontallyPadded ? 'tw-px-8' : ''}`"
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
							class="nudge-box-top tw-flex tw-align-center tw-justify-center tw-pt-4
							tw-bg-primary tw-cursor-pointer tw-select-none
							nudge-box-custom-donation"
						>
							You decide — enter custom amount
						</div>
					</div>
				</div>
				<div class="row nudge-box-row">
					<div
						v-for="{percentage} in percentageRows"
						:key="percentage"
						class="medium-4 columns nudge-box-middle-container nudge-box-container"
					>
						<h3
							class="nudge-box-middle
							tw-bg-primary tw-cursor-pointer tw-select-none"
							@click="setDonationAndClose(getDonationByPercent(percentage))"
						>
							${{ getDonationByPercent(percentage) }}
						</h3>
					</div>
					<!-- eslint-disable max-len -->
					<div
						v-if="hasCustomDonation"
						class="medium-4 columns nudge-box-middle-container nudge-box-container nudge-box-custom-donation-container"
					>
						<!-- eslint-disable max-len -->
						<div
							class="nudge-box-middle
							tw-bg-primary tw-cursor-pointer tw-select-none
							nudge-box-custom-donation"
						>
							<kv-text-input
								type="text"
								ref="customDonationInputDesktop"
								name="customDonationInputTextDesktop"
								maxlength="10"
								tabindex="10"
								id="customDonationInput"
								@click.capture="formatAndSubmitOnEnter"
								class="nudge-box-input tw-text-center tw-mx-auto tw-p-2
								nudge-box-input-desktop"
								@blur="validateInputDesktop"
							/>
						</div>
					</div>
				</div>
				<div class="row nudge-box-row">
					<div
						v-for="({percentage}, index) in percentageRows"
						:key="percentage"
						class="medium-4 columns nudge-box-bottom-container nudge-box-container"
					>
						<div
							class="nudge-box-bottom tw-bg-primary tw-cursor-pointer tw-select-none tw-mb-4 tw-pb-4"
							@click="setDonationAndClose(getDonationByPercent(percentage))"
						>
							<!-- style="border: 1px solid #DFDFDF" -->
							<kv-button
								v-if="index === 0"
								id="first-button"
								:tabindex="index + 1"
								class="smallest
								nudge-box-button tw-mb-0 tw-w-full"
							>
								Select
							</kv-button>
							<kv-button
								v-else
								:tabindex="index + 1"
								class="smallest
								nudge-box-button tw-mb-0 tw-w-full"
							>
								Select
							</kv-button>
						</div>
					</div>
					<div
						v-if="hasCustomDonation"
						class="medium-4 columns nudge-box-bottom-container nudge-box-container nudge-box-custom-donation-container"
					>
						<div
							class="nudge-box-bottom tw-bg-primary tw-cursor-pointer tw-select-none tw-mb-4 tw-pb-4
							nudge-box-custom-donation"
							@click="setCustomDonationAndClose"
						>
							<!-- style="border: 1px solid #DFDFDF" -->
							<kv-button
								class="smallest nudge-box-button custom-amount-submit"
								tabindex="11"
							>
								Submit
							</kv-button>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="nudge-box-radio-container">
				<div
					v-for="{percentage, appeal} in percentageRows"
					:key="percentage"
					class="row nudge-box-row tw-align-center tw-h-10 tw-my-2.5"
				>
					<div class="small-12 columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-appeal tw-justify-start"
					>
						<label class="nudge-box-radio-label ">
							<kv-text-input
								type="radio"
								class="nudge-box-radio-button"
								name="selected-donation-radio"
								:value="percentage"
								v-model="selectedDonationRadio"
							/>
							<!-- eslint-disable-next-line max-len -->
							<span class="nudge-box-radio-label-amount">${{ getDonationByPercent(percentage) }}</span> — {{ appeal }}
						</label>
					</div>
				</div>
				<div
					v-if="hasCustomDonation"
					class="row nudge-box-row tw-align-center tw-h-10 tw-my-2.5"
				>
					<div class="small-8 columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-appeal tw-justify-start"
					>
						<label class="nudge-box-radio-label">
							<input
								type="radio"
								class="nudge-box-radio-button"
								name="selected-donation-radio"
								value="custom"
								v-model="selectedDonationRadio"
							>
							You decide — enter custom amount
						</label>
					</div>
					<div class="small-4 columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-amount tw-font-medium lg:tw-font-text-xl tw-text-base tw-text-right"
					>
						<kv-text-input
							type="text"
							ref="customDonationInputDesktopRadio"
							name="customDonationInputTextDesktopRadio"
							maxlength="10"
							class="nudge-box-input nudge-box-input-desktop-radio"
							@blur="validateInputDesktopRadio"
							@focus="selectRadioCustom"
						/>
					</div>
				</div>
				<div
					class="row nudge-box-row tw-align-center tw-h-10 tw-my-2.5"
				>
					<div class="small-12 columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-appeal tw-justify-start"
					>
						<label class="nudge-box-radio-label">
							<button
								type="radio"
								class="nudge-box-radio-button tw-text-link"
								name="selected-donation-radio"
								:value="0"
							>
								<!-- v-model="selectedDonationRadio" -->
								No donation to Kiva
							</button>
						</label>
					</div>
				</div>
				<kv-button
					class="smallest nudge-box-button"
					@click.native="setRadioDonationAndClose"
				>
					Update Donation
				</kv-button>
				<div class="nudge-box-tax-deduction tw-font-small tw-text-secondary">
					Your Donation is eligible for a tax deduction if you live in the U.S.
				</div>
			</div>
		</div>
		<div class="hide-for-large nudge-boxes-mobile tw-text-left tw-mx-2">
			<div
				v-for="{percentage, appeal} in percentageRows"
				:key="percentage"
				class="nudge-box-wrapper nudge-box-wrapper-mobile tw-my-2"
				@click="setDonationAndClose(getDonationByPercent(percentage))"
			>
				<!-- style="border: 1px solid #DFDFDF" -->
				<div class="row nudge-box-row tw-align-center tw-h-10">
					<div class="small-7
					columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-appeal tw-justify-start"
					>
						{{ appeal }}
					</div>
					<div class="small-5
					columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-button tw-justify-end"
					>
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
				class="nudge-box-wrapper nudge-box-wrapper-mobile
				tw-flex tw-flex-col tw-py-2
				nudge-box-wrapper-mobile-custom-donation"
			>
				<!-- style="border: 1px solid #DFDFDF" -->
				<div>You decide — enter custom amount</div>
				<div class="row nudge-box-row tw-align-center tw-h-10">
					<div class="small-7
					columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-appeal tw-justify-start"
					>
						<kv-text-input
							type="text"
							ref="customDonationInputMobile"
							name="customDonationInputTextMobile"
							maxlength="10"
							class="nudge-box-input nudge-box-input-mobile"
							@blur="validateInputMobile"
						/>
					</div>
					<div class="small-5 columns
					nudge-box-column tw-flex tw-items-center
					nudge-box-column-button tw-justify-end"
					>
						<kv-button
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
// import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		KvButton,
		KvTextInput
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
		desktopUsingRadioButtons: {
			type: Boolean,
			default: false,
		},
		currentDonationAmount: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			selectedDonationRadio: 15,
		};
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
		afterLightboxOpens() {
			if (this.currentDonationAmount && this.customDonationSelected) {
				this.setInputs(this.currentDonationAmount);
			}

			this.$nextTick(() => {
				try {
					document.getElementById('first-button').focus();
				} catch (error) {
					// no-op
				}
			});
		},
		getDonationByPercent(percent) {
			return numeral(this.loanReservationTotal * (percent / 100)).format('0.00');
		},
		setCustomDonationAndClose() {
			this.setDonationAndClose(numeral(this.$refs.customDonationInputMobile.value).value());
		},
		setRadioDonationAndClose() {
			// eslint-disable-next-line no-restricted-globals
			if (this.selectedDonationRadio === 'custom') {
				this.setCustomDonationAndClose();
			} else {
				this.setDonationAndClose(this.getDonationByPercent(this.selectedDonationRadio));
			}
		},
		setInputs(value) {
			if (this.desktopUsingRadioButtons) {
				this.$refs.customDonationInputDesktopRadio.value = value;
			} else {
				this.$refs.customDonationInputDesktop.value = value;
			}
			this.$refs.customDonationInputMobile.value = value;
		},
		selectRadioCustom() {
			this.selectedDonationRadio = 'custom';
		},
		validateInputDesktop() {
			this.setInputs(numeral(this.$refs.customDonationInputDesktop.value).format('$0,0.00'));
		},
		validateInputDesktopRadio() {
			this.setInputs(numeral(this.$refs.customDonationInputDesktopRadio.value).format('$0,0.00'));
		},
		validateInputMobile() {
			this.setInputs(numeral(this.$refs.customDonationInputMobile.value).format('$0,0.00'));
		},
	},
};
</script>
