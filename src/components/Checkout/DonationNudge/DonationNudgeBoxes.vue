<template>
	<div class="donation-nudge-boxes-container">
		<div
			class="md:visible tw-text-left tw-mt-2 md:tw-mt-3
			md:tw-flex md:tw-flex-1 md:tw-flex-space-3 md:tw-gap-3"
		>
			<div
				v-for="({percentage, appeal}, index) in percentageRows"
				:key="percentage"
				class="tw-p-2 md:tw-px-3 md:tw-py-4 tw-border tw-border-tertiary"
				:class="{
					'tw-rounded-t tw-border-b-0 md:tw-border-b md:tw-rounded': index === 0,
					'md:tw-rounded': index === 1
				}"
				@click="setDonationAndClose(getDonationByPercent(percentage), formatSource(index))"
			>
				<div
					class="tw-flex tw-flex-row tw-align-center tw-items-stretch
					md:tw-flex-col md:tw-justify-between tw-h-full"
				>
					<div class="tw-self-center tw-flex-grow tw-mr-1 md:tw-mr-0 tw-text-left md:tw-text-center">
						{{ appeal }}
					</div>
					<p
						class="tw-hidden md:tw-block tw-text-title md:tw-flex-grow md:tw-my-2 tw-text-center"
						data-testid="`donation-amount-${index}`"
					>
						${{ getDonationByPercent(percentage) }}
					</p>
					<div class="tw-self-center md:tw-w-full">
						<kv-button
							class="md:tw-hidden tw-w-14"
							:data-testid="`donation-btn-amount-${index}`"
						>
							${{ getDonationByPercent(percentage) }}
						</kv-button>
						<kv-button
							class="tw-hidden md:tw-block tw-w-14 md:tw-w-full"
							:data-testid="`donation-btn-select-${index}`"
						>
							Select
						</kv-button>
					</div>
				</div>
			</div>
			<div
				class="tw-p-2 md:tw-px-3 md:tw-py-4
					tw-border tw-border-tertiary tw-rounded-b
					tw-border-t-0 md:tw-border-t md:tw-rounded"
			>
				<div
					class="tw-items-center
					md:tw-flex md:tw-flex-col md:tw-justify-between tw-h-full"
				>
					<div class="tw-align-center md:tw-text-center">
						You decide — enter custom amount
					</div>
					<div
						class="tw-flex tw-align-center tw-items-center tw-mt-1 md:tw-mt-0
						md:tw-flex-col md:tw-justify-between md:tw-h-full"
					>
						<div class="tw-self-center tw-flex-grow tw-mr-2 md:tw-mr-0 md:tw-my-2">
							<kv-text-input
								class="md:tw-text-center"
								id="customDonationInput"
								data-testid="custom-donation-input"
								type="text"
								ref="customDonationInput"
								name="customDonationInputText"
								maxlength="10"
								v-model="customDonationAmount"
								@focus="prefillOnFocus"
								@blur="validateInput"
								@keyup.enter.prevent="formatAndSubmitOnEnter"
							/>
						</div>
						<div class="tw-self-center md:tw-w-full">
							<kv-button
								class="tw-w-14 md:tw-w-full"
								:state="selectDisabled ? 'disabled' : ''"
								@click="setCustomDonationAndClose"
								id="customDonationSubmitBtn"
								data-testid="custom-donation-submit-btn"
							>
								Select
							</kv-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import { KvTextInput, KvButton } from '@kiva/kv-components';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

export const CUSTOM_TIP_DEFAULT_EXP_KEY = 'custom_tip_default';

const TREATMENT_PREFILL_AMOUNT = '$2.00';

export default {
	name: 'DonationNudgeBoxes',
	components: {
		KvButton,
		KvTextInput
	},
	inject: {
		apollo: { from: 'apollo' },
		// Assigned version provided by the checkout page; null when rendered elsewhere
		customTipDefaultVersion: { default: null },
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
		currentDonationAmount: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			customDonationAmount: null,
			selectedDonationRadio: 15,
		};
	},
	computed: {
		customInputIsEmpty() {
			return String(this.customDonationAmount ?? '').trim() === '';
		},
		isTreatment() {
			return this.customTipDefaultVersion === 'b';
		},
		selectDisabled() {
			return this.isTreatment && this.customInputIsEmpty;
		},
		customDonationSelected() {
			const donationOptions = this.percentageRows
				.map(({ percentage }) => numeral(this.getDonationByPercent(percentage)).format('$0.00'));
			return !donationOptions.includes(this.currentDonationAmount);
		},
	},
	methods: {
		formatAndSubmitOnEnter() {
			const customInput = document.getElementById('customDonationInput');
			const customInputButton = document.getElementById('customDonationSubmitBtn');

			customInput.blur();
			customInputButton.click();
		},
		afterLightboxOpens() {
			// Count exposure only where the treatment could apply, using the same provided version as the prefill
			if (this.customTipDefaultVersion) {
				trackExperimentVersion(
					this.apollo,
					this.$kvTrackEvent,
					'basket',
					CUSTOM_TIP_DEFAULT_EXP_KEY,
					'EXP-MP-3039-July2026',
				);
			}

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
		prefillOnFocus(event) {
			// Treatment suggests an amount only when the user focuses an empty input, so it can't be submitted
			// without engaging; any existing value, including a previously chosen $0.00, is left alone
			if (!this.isTreatment || !this.customInputIsEmpty) return;

			this.setInputs(TREATMENT_PREFILL_AMOUNT);
			// Place the cursor after the suggestion so the user can edit from the end
			this.$nextTick(() => {
				const input = event?.target;
				const end = input?.value?.length ?? 0;
				input?.setSelectionRange?.(end, end);
			});
		},
		getDonationByPercent(percent) {
			return numeral(this.loanReservationTotal * (percent / 100)).format('0.00');
		},
		setCustomDonationAndClose() {
			this.setDonationAndClose(numeral(this.customDonationAmount).value(), 'Custom amount');
		},
		setInputs(value) {
			this.customDonationAmount = value;
		},
		validateInput() {
			// Treatment leaves a cleared input empty so the select button stays disabled instead of offering $0.00
			if (this.isTreatment && this.customInputIsEmpty) {
				this.setInputs('');
				return;
			}
			this.setInputs(numeral(this.customDonationAmount).format('$0,0.00'));
		},
		formatSource(index) {
			return `${numeral(index + 1).format('0o')} preset`;
		},
	},
};
</script>
