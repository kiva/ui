<template>
	<!-- DO NOT REMOVE basket-donation-item class -->
	<div class="basket-donation-item">
		<template>
			<div class="tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
				<!-- donation image -->
				<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
					<img
						class="tw-bg-brand-100 tw-border tw-border-gray-300 tw-w-12 tw-h-12 tw-p-1 tw-rounded"
						:src="imageRequire(`./leaf_heart.svg`)"
						alt="donation line item image"
						data-testid="basket-donation-image"
					>
				</div>

				<!-- donation text -->
				<div class="tw-flex-auto">
					<div class="tw-mb-0.5">
						<div class="tw-flex tw-items-center tw-justify-between">
							<div>
								<div class="tw-w-full tw-flex">
									<h2
										class="tw-flex-1 md:tw-flex-grow tw-text-h3"
										data-testid="basket-donation-title"
									>
										{{ basketDonationHeader }}
									</h2>
								</div>
								<div
									v-show="!editDonation"
									class="md:tw-hidden"
								>
									<button
										class="donation-amount"
										data-testid="basket-donation-edit-button-mobile-amount"
										v-kv-track-event="['basket', 'Edit Donation']"
										@click="enterEditDonation"
										title="Edit Donation"
									>
										{{ formattedAmount }}
										<kv-material-icon
											role="img"
											aria-label="Edit Donation"
											title="Edit Donation"
											class="edit-donation tw-text-action
											tw-w-3.5
											tw-h-3.5
											tw-py-0.5
											tw-hidden md:tw-inline-block
											"
											name="pencil"
											:icon="mdiPencil"
										/>
									</button>
									<button
										class="donation-amount md:tw-hidden tw-flex-none tw-align-middle"
										data-testid="basket-donation-edit-button-mobile-pencil"
										v-kv-track-event="['basket', 'Edit Donation']"
										@click="enterEditDonation"
										title="Edit Donation"
									>
										<kv-material-icon
											role="img"
											aria-label="Edit Donation"
											title="Edit Donation"
											class="edit-donation tw-text-action
										tw-w-3.5
										tw-h-3.5
										tw-py-0.5
										md:tw-hidden"
											name="pencil"
											:icon="mdiPencil"
										/>
									</button>
								</div>
							</div>
							<div class="tw-block md:tw-hidden tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
								<img
									class="tw-w-7 tw-h-7 tw-rounded"
									:src="imageRequire(`./leaf_heart.svg`)"
									alt="donation line item image"
									data-testid="basket-donation-image"
								>
							</div>
						</div>

						<div>
							<div
								class="donation-tagline tw-my-1 tw-max-w-2xl"
								data-testid="basket-donation-tagline"
							>
								<p
									class="tw-text-base"
								>
									<!-- eslint-disable-next-line max-len -->
									100% of your loan supports  borrowers — we never take a fee. As a nonprofit, we rely on donations to advance our mission of expanding financial access
								</p>
							</div>
							<button
								class="tw-flex tw-items-center tw-text-base tw-text-link"
								data-testid="basket-donation-info-lightbox"
								@click="triggerDefaultLightbox"
								v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
							>
								{{ donationDetailsLink }}
								<kv-material-icon
									class="tw-ml-0.5 tw-w-2 tw-h-2"
									:icon="mdiArrowRight"
								/>
							</button>
						</div>
					</div>
				</div>

				<!-- donation total -->
				<div
					class="
				tw-flex-none
				tw-w-full
				md:tw-w-auto
				md:tw-ml-3
				lg:tw-ml-4.5
				tw-mt-1.5
				md:tw-mt-0"
				>
					<div
						v-show="!editDonation"
						class="tw-hidden md:tw-block tw-text-right"
					>
						<button
							class="donation-amount"
							data-testid="basket-donation-edit-button-combined"
							v-kv-track-event="['basket', 'Edit Donation']"
							@click="enterEditDonation"
							title="Edit Donation"
						>
							{{ formattedAmount }}
							<kv-material-icon
								role="img"
								aria-label="Edit Donation"
								title="Edit Donation"
								class="edit-donation tw-text-action
								tw-w-3.5
								tw-h-3.5
								tw-py-0.5
								tw-align-bottom
								"
								name="pencil"
								:icon="mdiPencil"
							/>
						</button>
					</div>
					<div v-show="editDonation" class="small-12 columns donation-amount-input-wrapper">
						<kv-text-input
							class="donation-amount-input"
							data-testid="basket-donation-edit-input"
							name="donation"
							id="donation"
							v-model="amount"
							@blur="validateInput"
							@keyup.enter.prevent="updateDonation()"
						/>
						<kv-button
							variant="secondary"
							class="update-donation-inline-button"
							data-testid="basket-donation-edit-submit"
							@click="updateDonation()"
						>
							Update
						</kv-button>
						<button
							class="show-for-medium remove-wrapper"
							@click="updateLoanAmount('remove')"
							data-testid="basket-donation-remove"
						>
							<kv-material-icon
								class="remove-x tw-text-tertiary"
								name="small-x"
								:from-sprite="true"
								title="Remove donation"
							/>
						</button>
					</div>
					<donate-repayments
						v-if="hasLoans"
						@updating-totals="$emit('updating-totals', $event)"
						@refreshtotals="$emit('refreshtotals')"
					/>
				</div>
			</div>
		</template>
		<!-- Donation nudge lightbox -->
		<donation-nudge-lightbox
			ref="nudgeLightbox"
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:current-donation-amount="amount"
		/>

		<!-- How kiva use's donations lightbox -->
		<kv-lightbox
			:visible="defaultLbVisible"
			@lightbox-closed="lightboxClosed"
			data-testid="basket-donation-how-kiva-uses-lightbox"
		>
			<template #header>
				<h2>
					Loans change lives. Your donations make them possible.
				</h2>
			</template>
			<how-kiva-uses-donation />
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import { mdiPencil, mdiArrowRight } from '@mdi/js';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import HowKivaUsesDonation from '@/components/Checkout/HowKivaUsesDonation';
import DonationNudgeLightbox from '@/components/Checkout/DonationNudge/DonationNudgeLightbox';
import DonateRepayments from '@/components/Checkout/DonateRepaymentsToggle';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

const imageRequire = require.context('@/assets/images/', true);

export default {
	name: 'DonationItem',
	components: {
		KvMaterialIcon,
		KvButton,
		KvLightbox,
		KvTextInput,
		DonateRepayments,
		DonationNudgeLightbox,
		HowKivaUsesDonation,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		donation: {
			type: Object,
			default: () => {}
		},
		loanCount: {
			type: Number,
			default: 0
		},
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		orderTotalVariant: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			defaultLbVisible: false,
			amount: numeral(this.donation.price).format('$0,0.00'),
			cachedAmount: numeral(this.donation.price).format('$0,0.00'),
			editDonation: false,
			nudgeLightboxVisible: false,
			loanHistoryCount: null,
			donationDetailsLink: 'Learn how Kiva uses your donation',
			mdiPencil,
			imageRequire,
			mdiArrowRight
		};
	},
	created() {
		const donationProperty = this.donation.isUserEdited ? 'user-set' : 'kiva-set';
		this.$kvTrackEvent('basket', 'show', 'tip-donation-amount', donationProperty, this.donation.price * 100);
		this.$kvTrackEvent('basket', 'show', 'loans', null, this.loanCount);
	},
	watch: {
		// watching the computed serverAmount property allows us to get set updates based on nested data props
		serverAmount() {
			this.amount = numeral(this.donation.price).format('0,0.00');
		},
	},
	computed: {
		donationTitle() {
			return 'Donation to Kiva';
		},
		hasLoans() {
			return this.loanCount > 0;
		},
		serverAmount() {
			return numeral(this.donation.price).format('$0,0.00');
		},
		formattedAmount() {
			return numeral(this.amount).format('$0,0.00');
		},
		basketDonationHeader() {
			return `Help cover the cost of your loan${this.loanCount > 1 ? 's' : ''}`;
		},
	},
	methods: {
		updateDonationTo(amount) {
			if (amount === undefined) {
				return;
			}
			this.amount = numeral(amount).format('0.00');
			this.updateDonation();
		},
		enterEditDonation() {
			if (this.hasLoans) {
				this.openNudgeLightbox();
			} else {
				this.editDonation = true;
			}
		},
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		updateDonation() {
			this.editDonation = false;
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.amount).format('0.00'),
					isTip: this.donation.isTip
				}
			}).then(data => {
				if (data.errors) {
					data.errors.forEach(({ message }) => {
						this.$showTipMsg(message, 'error');
					});
					this.amount = this.cachedAmount;
					this.$emit('updating-totals', false);
				} else {
					this.$emit('refreshtotals');
					this.$kvTrackEvent(
						'basket',
						'Update Donation',
						'Update Success',
						// pass donation amount as whole number
						numeral(this.amount).value() * 100,
						numeral(this.amount).value() * 100
					);
					this.amount = numeral(this.amount).format('$0,0.00');
					this.cachedAmount = numeral(this.amount).format('$0,0.00');
				}
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
		},
		validateInput() {
			// get donation value from input, store it as donationValue
			const donationValue = document.getElementById('donation').value;

			// format the value taken from the donation input
			const verifiedInput = numeral(donationValue).format('$0,0.00');

			// inject the verfied input back into the donation input field
			// numeral takes care of non-numerical inputs, does it's best guess
			// formed value. If input can't be deciphered then $0.00 is returned
			document.getElementById('donation').value = verifiedInput;
		},
		closeNudgeLightbox() {
			this.nudgeLightboxVisible = false;
		},
		openNudgeLightbox() {
			this.$kvTrackEvent('basket', 'click-open nudge');
			this.nudgeLightboxVisible = true;
			this.$nextTick(() => {
				this.$refs.nudgeLightbox.expandNudgeLightbox();
			});
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.inline-donation-amount {
	width: rem-calc(132);

	@include breakpoint(medium) {
		width: rem-calc(90);
	}
}

.donation-amount-input-wrapper {
	padding-left: rem-calc(10);

	.update-donation-inline-button.secondary {
		@extend .inline-donation-amount;
	}

	@include breakpoint(medium) {
		float: right;
		white-space: nowrap;
	}
}

.donation-amount-input {
	@extend .inline-donation-amount;

	display: block;
	margin-bottom: rem-calc(15);
}

.show-for-medium {
	&.remove-wrapper {
		display: inline;
		padding-left: rem-calc(10);
		visibility: hidden;
	}

	.remove-x {
		display: inline-block;
		width: 1.1rem;
		height: rem-calc(36);
	}
}

</style>
