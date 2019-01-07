<template>
	<div class="basket-donation-item row">
		<span class="small-3 large-2">
			<span class="donation-icon">
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</span>
		</span>
		<span class="small-9 medium-5 large-7 donation-info-wrapper">
			<span class="donation-info featured-text">
				Donation to Kiva
			</span>
			<div>
				<div v-if="hasLoans" class="donation-tagline small-text">{{ donationTagLine }}</div>
				<a
					v-if="this.expVersion === 'variant-b' && hasLoans"
					class="small-text"
					:class="boostApplied"
					v-kv-track-event="['basket', 'EXP-CASH-173-Nov2018', 'click-basket-edit-tip', 15]"
					@click.prevent="updateDonationExp()">{{ donationUpsellText }}
				</a>
				<a
					v-else-if="this.expVersion === 'variant-c' && hasLoans"
					class="small-text"
					:class="boostApplied"
					v-kv-track-event="['basket', 'EXP-CASH-173-Nov2018', 'click-basket-edit-tip', 10]"
					@click.prevent="updateDonationExp()">{{ donationUpsellText }}
				</a>
				<a
					v-else
					class="small-text donation-help-text"
					@click.prevent="triggerDefaultLightbox"
					v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']">
					How Kiva uses donations
				</a>
			</div>
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-4 large-3 medium-text-font-size">
			<div
				v-show="!editDonation"
				class="donation-amount-wrapper">
				<span
					class="donation-amount"
					v-kv-track-event="['basket', 'Edit Donation']"
					@click.prevent="enterEditDonation"
					title="Edit Donation">{{ formattedAmount }}
					<kv-icon
						role="img"
						aria-label="Edit Donation"
						title="Edit Donation"
						class="edit-donation"
						name="pencil"/>
				</span>
			</div>
			<div v-show="editDonation" class="small-12 donation-amount-input-wrapper">
				<input
					type="input"
					class="donation-amount-input"
					name="donation"
					id="donation"
					v-model="amount"
					@blur="validateInput"
					@keyup.enter.prevent="updateDonation()">
				<kv-button
					class="secondary"
					@click.native.prevent.stop="updateDonation()"
				>Update</kv-button>
				<div
					class="show-for-medium remove-wrapper"
					@click="updateLoanAmount('remove')">
					<kv-icon class="remove-x" name="small-x" />
				</div>
			</div>
			<donate-repayments
				v-if="hasLoans"
				@updating-totals="$emit('updating-totals', $event)"
				@refreshtotals="$emit('refreshtotals')" />
		</span>
		<donation-nudge-lightbox
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:nudge-lightbox-visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:has-custom-donation="hasCustomDonation"
		/>
		<kv-lightbox
			:visible="defaultLbVisible"
			@lightbox-closed="lightboxClosed">
			<h2 slot="title">How does Kiva use donations?</h2>
			<div>
				100% of every dollar you lend on Kiva goes directly to funding loans.
				We rely on small optional donations from you and others to keep Kiva running.
				Every $1 donated to Kiva makes $8 in loans possible around the world.
				Your donation will enable us to:
				<ul style="list-style-type: disc;">
					<li>Send expert staff to over 60 countries to vet and monitor loans and partners.</li>
					<li>Build and maintain a website that facilitates over $1 million in loans each week.</li>
					<li>Provide comprehensive customer support to thousands of lenders worldwide.</li>
					<li>Train and support hundreds of volunteers -- 4 for every 1 staff member at Kiva.</li>
				</ul>
				If you live in the United States, your donation is tax-deductible.
				Thank you for considering a donation to Kiva.
			</div>
		</kv-lightbox>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import DonateRepayments from '@/components/Checkout/DonateRepaymentsToggle';
import donationDataQuery from '@/graphql/query/checkout/donationData.graphql';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import numeral from 'numeral';
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';
import DonationNudgeLightbox from '@/components/Checkout/DonationNudgeLightbox';

export default {
	components: {
		KvIcon,
		KvButton,
		KvLightbox,
		DonateRepayments,
		DonationNudgeLightbox,
	},
	inject: ['apollo'],
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
	},
	data() {
		return {
			defaultLbVisible: false,
			amount: numeral(this.donation.price).format('$0,0.00'),
			cachedAmount: numeral(this.donation.price).format('$0,0.00'),
			editDonation: false,
			expVersion: '',
			nudgeLightboxVisible: false,
			isCash80Running: false,
			hasCustomDonation: false,
		};
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: donationDataQuery
				}).then(() => {
					// Get the assigned experiment version for Donation Boost
					client.query({
						query: experimentAssignmentQuery,
						variables: {
							id: 'donation_boost',
						},
					}).then(resolve).catch(reject);
					// Get the assigned experiment version for Donation Nudge Lightbox
					client.query({
						query: experimentAssignmentQuery,
						variables: {
							id: 'donation_nudge_lightbox_custom_tip',
						},
					}).then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		this.setupExperimentState();
	},
	watch: {
		// watching the computed serverAmount property allows us to get set updates based on nested data props
		serverAmount() {
			this.amount = numeral(this.donation.price).format('0,0.00');
		},
	},
	computed: {
		hasLoans() {
			return this.loanCount > 0;
		},
		serverAmount() {
			return numeral(this.donation.price).format('$0,0.00');
		},
		formattedAmount() {
			return numeral(this.amount).format('$0,0.00');
		},
		donationTagLine() {
			// Donation exp configuration lines 150-155
			if (this.expVersion === 'variant-b') {
				const tagline = 'Donations of $15 or more are matched by generous donors for a limited time!';

				return tagline;
			} else if (this.expVersion === 'variant-c') {
				const tagline = 'Donations of $10 or more are matched by generous donors for a limited time!';

				return tagline;
			}
			// Control for donation boost experiment
			const tagline = 'An optional 15% donation covers Kiva\'s costs for ';

			if (this.loanCount > 1) {
				return `${tagline} these loans`;
			}
			return `${tagline} this loan`;
		},
		donationBoostExpAmount() {
			if (this.expVersion === 'variant-b') {
				return numeral(15).format('$0');
			} else if (this.expVersion === 'variant-c') {
				return numeral(10).format('$0');
			}
		},
		donationUpsellText() {
			if (numeral(this.serverAmount).value() < numeral(this.donationBoostExpAmount).value()) {
				// on click of this text, updateDonation(15) replace text with 'Thanks for doubling your impact';
				return `Boost your donation to ${this.donationBoostExpAmount} and double your impact.`;
			}
			return 'Thanks for doubling your impact.';
		},
		boostApplied() {
			if (this.expVersion === 'variant-b') {
				return numeral(this.serverAmount).value() < 15 ? '' : 'boost-applied';
			}
			if (this.expVersion === 'variant-c') {
				return numeral(this.serverAmount).value() < 10 ? '' : 'boost-applied';
			}
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
		enterEditDonation() {
			if (this.hasLoans && this.isCash80Running) {
				this.openNudgeLightbox();
			} else {
				this.editDonation = true;
			}
		},
		updateDonationExp() {
			// if the server amount is greater than the donationBoostAmount return false
			if (numeral(this.serverAmount).value() >= numeral(this.donationBoostExpAmount).value()) {
				return false;
			}
			if (this.expVersion === 'variant-b') {
				this.amount = numeral(15).format('0.00');
				this.updateDonation();
			}
			if (this.expVersion === 'variant-c') {
				this.amount = numeral(10).format('0.00');
				this.updateDonation();
			}
		},
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		setupExperimentState() {
			// get experiment data from apollo cache
			const donationExpVersion = this.apollo.readQuery({
				query: experimentAssignmentQuery,
				variables: { id: 'donation_boost' },
			});
			this.expVersion = _get(donationExpVersion, 'experiment.version') || null;

			if (this.expVersion && this.expVersion === 'variant-a') {
				this.$kvTrackEvent('basket', 'EXP-CASH-173-Nov2018', 'a');
			}
			if (this.expVersion === 'variant-b') {
				this.$kvTrackEvent('basket', 'EXP-CASH-173-Nov2018', 'b');
			}
			if (this.expVersion === 'variant-c') {
				this.$kvTrackEvent('basket', 'EXP-CASH-173-Nov2018', 'c');
			}

			const nudgeExperimentVersion = this.apollo.readQuery({
				query: experimentAssignmentQuery,
				variables: { id: 'donation_nudge_lightbox_custom_tip' },
			});
			this.donationNudgeLightboxExpVersion = _get(nudgeExperimentVersion, 'experiment.version') || null;
			if (this.hasLoans && this.donationNudgeLightboxExpVersion === 'variant-a') {
				this.isCash80Running = true;
				this.$kvTrackEvent('basket', 'EXP-CASH-80-Jan2019', 'a');
			} else if (this.hasLoans && this.donationNudgeLightboxExpVersion === 'variant-b') {
				this.$kvTrackEvent('basket', 'EXP-CASH-80-Jan2019', 'b');
				this.isCash80Running = true;
				this.hasCustomDonation = true;
			}
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
					_forEach(data.errors, ({ message }) => {
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
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.basket-donation-item {
	padding-right: rem-calc(20);
}

.donation-icon {
	padding: 0;
}

.dedicate-heart {
	border: 1px solid $light-gray;
	height: rem-calc(71);
	width: rem-calc(71);
	padding: rem-calc(4);

	@include breakpoint(medium) {
		height: rem-calc(80);
		width: rem-calc(80);
	}
}

.donation-info-wrapper {
	padding-left: rem-calc(10);
}

.donation-info {
	line-height: 0.8;
	font-weight: $global-weight-highlight;
}

.donation-tagline {
	color: $gray;
}

.donation-help-text {
	display: block;
	margin-bottom: rem-calc(15);
}

.donation-amount-wrapper {
	margin-left: 0.6rem;
	width: 10.8rem;
	text-align: left;

	@include breakpoint(medium) {
		margin: 0;
		width: auto;
		text-align: right;
	}

	.donation-amount {
		display: inline-block;
		cursor: pointer;
		font-weight: $global-weight-highlight;
		font-size: $medium-text-font-size;

		@include breakpoint(medium) {
			font-size: inherit;
		}

		.edit-donation {
			width: 1rem;
			height: 1rem;
			margin: 0 0.4rem 0 0.6rem;
			cursor: pointer;

			@include breakpoint(medium) {
				width: 0.8rem;
				height: 0.8rem;
				margin: 0 0.2rem 0 0.8rem;
			}
		}
	}
}

.donation-amount-input-wrapper {
	padding-left: rem-calc(10);

	@include breakpoint(medium) {
		float: right;
		white-space: nowrap;
	}
}

.donation-amount-input {
	display: block;
	border: 1px solid $charcoal;
	border-radius: $button-radius;
	width: rem-calc(132);
	text-align: center;
	font-weight: $global-weight-highlight;
	color: $charcoal;
	margin-bottom: rem-calc(15);

	@include breakpoint(medium) {
		width: rem-calc(90);
		font-size: $normal-text-font-size;
		height: rem-calc(36);
	}
}

.show-for-medium {
	&.remove-wrapper {
		display: inline;
		padding-left: rem-calc(10);
		visibility: hidden;
	}

	.remove-x {
		fill: $subtle-gray;
		display: inline-block;
		width: 1.1rem;
		height: rem-calc(36);
	}
}

input {
	width: rem-calc(100);
	text-align: right;
	padding-right: rem-calc(5);
	height: rem-calc(50);
	margin-bottom: rem-calc(20);
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		height: rem-calc(32);
	}
}

.basket-donation-item .secondary {
	color: $kiva-accent-blue;
	border: 1px solid $kiva-accent-blue;
	box-shadow: 0 1px $kiva-accent-blue;
	visibility: visible;
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		padding: rem-calc(6) 1.1rem;
		margin-bottom: rem-calc(19);
		width: inherit;
		font-size: $normal-text-font-size;
		height: rem-calc(36);
	}
}

.boost-applied {
	color: #333;
	text-decoration: none;
	cursor: inherit;
}
</style>
