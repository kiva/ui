<template>
	<!-- DO NOT REMOVE basket-donation-item class -->
	<div class="basket-donation-item">
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
			<!-- donation image -->
			<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
				<img
					class="tw-bg-brand-100 tw-border tw-border-gray-300 tw-w-12 tw-h-12 tw-p-1 tw-rounded"
					:src="leafHeartUrl"
					alt="donation line item image"
					data-testid="basket-donation-image"
				>
			</div>

			<!-- donation text -->
			<div
				class="tw-flex-auto"
				:class="{ 'md:tw-min-w-0': showTipFromBalanceVariant }"
			>
				<div class="tw-mb-0.5">
					<div class="tw-flex tw-items-center tw-justify-between">
						<div>
							<div class="tw-w-full tw-flex">
								<h2
									class="tw-flex-1 md:tw-flex-grow"
									:class="{ 'tw-text-h3 !tw-font-medium tw-text-primary': showTipFromBalanceVariant }"
									data-testid="basket-donation-title"
								>
									{{ basketDonationHeader }}
								</h2>
							</div>
							<div
								v-show="!editDonation && !isCampaignDonation"
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
							<div
								v-show="isCampaignDonation"
								class="md:tw-hidden"
							>
								{{ formattedAmount }}
								<button
									class="tw-flex-none tw-align-middle"
									v-kv-track-event="['basket', 'click', 'remove-giving-fund-donation']"
									@click="removeGivingFundDonation"
									title="Remove giving fund donation"
								>
									<kv-material-icon
										role="img"
										aria-label="Remove giving fund donation"
										title="Remove giving fund donation"
										class="tw-w-2 tw-h-2 tw-ml-1 tw-mt-0.5"
										name="close"
										:icon="mdiClose"
									/>
								</button>
							</div>
						</div>
						<div class="tw-block md:tw-hidden tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
							<img
								class="tw-w-7 tw-h-7 tw-rounded"
								:src="leafHeartUrl"
								alt="donation line item image"
								data-testid="basket-donation-image"
							>
						</div>
					</div>

					<div
						:class="{ 'md:tw-flex md:tw-items-center md:tw-gap-0.5': showTipFromBalanceVariant }"
					>
						<!-- The switch below brings its own top margin, so the variant drops the bottom one -->
						<div
							class="tw-max-w-2xl"
							:class="showTipFromBalanceVariant
								? 'tw-mt-1 md:tw-min-w-0'
								: 'tw-my-1'"
							data-testid="basket-donation-tagline"
						>
							<!-- Two lines before clipping: a long group name would otherwise cut the ask itself -->
							<p
								class="tw-text-base"
								:class="{ 'md:tw-line-clamp-2': showTipFromBalanceVariant }"
							>
								{{ basketDonationTagline }}
							</p>
						</div>
						<a
							href="/lp/giving-fund#social-funds-rtc-12"
							v-if="isCampaignDonation"
							class="tw-text-base tw-text-link" target="_blank" rel="noopener"
							v-kv-track-event="['basket', 'click', 'giving-fund-info-link']"
						>
							Learn more about giving funds
						</a>
						<button
							v-else
							class="tw-flex tw-items-center tw-text-base tw-text-link"
							:class="{ 'md:tw-flex-none': showTipFromBalanceVariant }"
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

				<kiva-credit-tip-toggle
					v-if="showTipFromBalanceVariant"
					@updating-totals="$emit('updating-totals', $event)"
					@refreshtotals="$emit('refreshtotals')"
				/>
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
					v-show="isCampaignDonation"
					class="tw-hidden md:tw-block tw-text-right"
				>
					{{ formattedAmount }}
					<button
						class="tw-flex-none tw-align-middle"
						v-kv-track-event="['basket', 'click', 'remove-giving-fund-donation']"
						@click="removeGivingFundDonation"
						title="Remove giving fund donation"
					>
						<kv-material-icon
							role="img"
							aria-label="Remove giving fund donation"
							title="Remove giving fund donation"
							class="tw-w-2 tw-h-2 tw-ml-1 tw-mt-0.5"
							name="close"
							:icon="mdiClose"
						/>
					</button>
				</div>
				<div
					v-show="!editDonation && !isCampaignDonation"
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
				<div
					v-show="editDonation && !isCampaignDonation"
					class="small-12 columns donation-amount-input-wrapper"
				>
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
			:title="'Loans change lives.Your donations make them possible.'"
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
import { mdiPencil, mdiArrowRight, mdiClose } from '@mdi/js';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import updateDonation from '#src/graphql/mutation/updateDonation.graphql';
import HowKivaUsesDonation from '#src/components/Checkout/HowKivaUsesDonation';
import DonationNudgeLightbox from '#src/components/Checkout/DonationNudge/DonationNudgeLightbox';
import DonateRepayments from '#src/components/Checkout/DonateRepaymentsToggle';
import KivaCreditTipToggle from '#src/components/Checkout/KivaCreditTipToggle';
import {
	KvMaterialIcon, KvTextInput, KvButton, KvLightbox
} from '@kiva/kv-components';
import leafHeartUrl from '#src/assets/images/leaf_heart.svg?url';

export default {
	name: 'DonationItem',
	components: {
		KvMaterialIcon,
		KvButton,
		KvLightbox,
		KvTextInput,
		DonateRepayments,
		KivaCreditTipToggle,
		DonationNudgeLightbox,
		HowKivaUsesDonation,
	},
	inject: {
		apollo: { from: 'apollo' },
		cookieStore: { from: 'cookieStore' },
		// Assigned version provided by the checkout page; null when rendered elsewhere
		tipFromBalanceVersion: { default: null },
	},
	emits: ['refreshtotals', 'updating-totals'],
	props: {
		donation: {
			type: Object,
			default: () => {}
		},
		loanCount: {
			type: Number,
			default: 0
		},
		kivaCardsCount: {
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
		// Borrower names in basket order, so the tip ask can name who the loans are for
		borrowerNames: {
			type: Array,
			default: () => [],
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
			mdiPencil,
			mdiArrowRight,
			mdiClose,
			leafHeartUrl,
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
		isCampaignDonation() {
			return !!this.donation?.metadata?.campaignId;
		},
		showTipFromBalanceVariant() {
			// The compressed one-line layout exists to make room for the switch below it. With no tip
			// there is no switch, so the row keeps the layout the repayments prompt was designed against
			return this.tipFromBalanceVersion === 'b'
				&& numeral(this.donation.price).value() > 0
				&& !this.isCampaignDonation
				&& !this.orderTotalVariant;
		},
		donationTitle() {
			return 'Donation to Kiva';
		},
		hasLoans() {
			return this.loanCount > 0;
		},
		hasKivaCards() {
			return this.kivaCardsCount > 0;
		},
		serverAmount() {
			return numeral(this.donation.price).format('$0,0.00');
		},
		formattedAmount() {
			return numeral(this.amount).format('$0,0.00');
		},
		donationDetailsLink() {
			return this.showTipAskVariant ? 'Learn more' : 'Learn how Kiva uses your donation';
		},
		showTipAskVariant() {
			// The named ask needs a borrower to name, so a row without loan data keeps the old copy
			return this.showTipFromBalanceVariant && this.hasLoans && !!this.firstBorrowerName;
		},
		firstBorrowerName() {
			return this.borrowerNames[0] ?? '';
		},
		loanTotalDisplay() {
			return numeral(this.loanReservationTotal).format('$0,0[.]00');
		},
		tipAskHeader() {
			const first = this.firstBorrowerName;
			const second = this.borrowerNames[1];
			if (this.loanCount === 1) {
				return `Cover the cost of ${formatPossessiveName(first)} loan?`;
			}
			if (this.loanCount === 2 && second) {
				return `Cover the cost of ${first} and ${formatPossessiveName(second)} loans?`;
			}
			// A basket loan can arrive without its borrower, so the count and the names can differ
			const others = this.loanCount - 1;
			const suffix = others === 1 ? '' : 's';
			return `Cover the cost of ${formatPossessiveName(first)} loan and ${others} other${suffix}?`;
		},
		tipAskTagline() {
			// A single loan is named and takes "goes to"; several are collective and take "goes toward"
			const destination = this.loanCount === 1
				? `to ${formatPossessiveName(this.firstBorrowerName)} loan`
				: 'toward these loans';
			return `100% of your ${this.loanTotalDisplay} goes ${destination} — your tip helps Kiva get it there.`;
		},
		basketDonationHeader() {
			if (this.isCampaignDonation) {
				return 'Donate to a giving fund';
			}
			if (this.showTipAskVariant) {
				return this.tipAskHeader;
			}
			if (this.hasLoans) {
				return `Help cover the cost of your loan${this.loanCount > 1 ? 's' : ''}`;
			}
			return 'Donate to Kiva';
		},
		basketDonationTagline() {
			if (this.isCampaignDonation) {
				return 'Your donation will be lent out to a critical impact area.';
			}
			if (this.showTipAskVariant) {
				return this.tipAskTagline;
			}
			if (this.hasKivaCards && !this.hasLoans) {
				// eslint-disable-next-line max-len
				return '100% of your Kiva Card money goes to the people you support — we never take a fee. As a nonprofit, we rely on donations to advance our mission.';
			}
			const loanSupport = this.hasLoans ? 'your loan supports' : 'loans support';
			// eslint-disable-next-line max-len
			return `100% of ${loanSupport} borrowers — we never take a fee. As a nonprofit, we rely on donations to advance our mission of expanding financial access.`;
		}
	},
	methods: {
		updateDonationTo(amount) {
			if (amount === undefined) {
				return;
			}
			this.amount = numeral(amount).format('0.00');
			this.updateDonation();
		},
		removeGivingFundDonation() {
			this.amount = numeral(0).format('0.00');
			this.updateDonation(true);
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
		updateDonation(clearMetadata = false) {
			// this will clear metadata if it exists
			// used when removing giving fund donations, essentially turning them into regular donations
			// with amount 0
			this.editDonation = false;
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.amount).format('0.00'),
					isTip: this.donation.isTip,
					clearMetadata,
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
@use '#src/assets/scss/settings' as *;

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
