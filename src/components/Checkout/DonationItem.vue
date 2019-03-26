<template>
	<div class="basket-donation-item row">
		<span class="hide-for-small-only medium-3 large-2">
			<span class="donation-icon">
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</span>
		</span>
		<span class="small-12 medium-5 large-7 donation-info-wrapper">
			<span class="donation-info featured-text">
				{{ donationTitle }}
			</span>
			<div>
				<div v-if="hasLoans" class="donation-tagline small-text">{{ donationTagLine }}</div>
				<a
					class="small-text donation-help-text"
					@click.prevent="triggerDefaultLightbox"
					v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']">
					{{ donationDetailsLink }}
				</a>
			</div>
		</span>
		<!-- <span class="small-3 show-for-small-only"></span> -->
		<span class="small-12 medium-4 large-3 medium-text-font-size">
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
			ref="nudgeLightbox"
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:nudge-lightbox-visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:has-custom-donation="hasCustomDonation"
			:header="donationNudgeHeader()"
			:experimental-header="donationNudgeExperimentalHeader"
			:description="donationNudgeDescription()"
			:percentage-rows="donationNudgePercentageRows"
			v-if="!donationNudgeBorrowerImageExperiment"
		/>
		<donation-nudge-lightbox-borrower-image
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:nudge-lightbox-visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:has-custom-donation="hasCustomDonation"
			:header="donationNudgeHeader()"
			:experimental-header="donationNudgeExperimentalHeader"
			:description="donationNudgeDescription()"
			:percentage-rows="donationNudgePercentageRows"
			v-else
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
import DonationNudgeLightbox from '@/components/Checkout/DonationNudge/DonationNudgeLightbox';
import DonationNudgeLightboxBorrowerImage from '@/components/Checkout/DonationNudge/DonationNudgeLightboxBorrowerImage';

export default {
	components: {
		KvIcon,
		KvButton,
		KvLightbox,
		DonateRepayments,
		DonationNudgeLightbox,
		DonationNudgeLightboxBorrowerImage,
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
			checkoutDonation100TextExperiment: '',
			nudgeLightboxVisible: false,
			isCash80Running: false,
			hasCustomDonation: false,
			donationNudgeExperimentalHeader: false,
			donationNudgeExperimentalDescription: false,
			loanHistoryCount: null,
			donationNudgeBorrowerImageExperiment: false,
			donationDetailsLink: 'How Kiva uses donations',
			donationTitle: 'Donation to Kiva',
		};
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: donationDataQuery
				}).then(() => {
					// Get the assigned experiment version for Donation Nudge Lightbox
					client.query({
						query: experimentAssignmentQuery,
						variables: {
							id: 'donation_nudge_lightbox_custom_tip',
						},
					}).then(resolve).catch(reject);
					// Get the assigned experiment version for Donation Nudge Lending Cost
					client.query({
						query: experimentAssignmentQuery,
						variables: {
							id: 'donation_nudge_lending_cost',
						},
					}).then(resolve).catch(reject);
					// Get the assigned experiment version for Checkout Donation Lending Cost
					client.query({
						query: experimentAssignmentQuery,
						variables: {
							id: 'checkout_donation_100_text',
						},
					}).then(resolve).catch(reject);
					// Get the assigned experiment version for Donation Nudge Borrower Image Experiment
					client.query({
						query: experimentAssignmentQuery,
						variables: {
							id: 'donation_nudge_borrower_image',
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
			/* eslint-disable max-len */
			const coverOurCosts = `${this.loanCount > 1 ? 'These loans cost' : 'This loan costs'} Kiva more than ${numeral(Math.floor(this.loanReservationTotal * 0.15)).format('$0,0')} to facilitate. Will you help us cover our costs?`;
			return this.checkoutDonation100TextExperiment === 'variant-b'
				? `${coverOurCosts} 100% of every dollar lent goes to funding loans.`
				: coverOurCosts;
			/* eslint-enable max-len */
		},
		donationNudgePercentageRows() {
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
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		setupExperimentState() {
			// get experiment data from apollo cache
			const checkoutDonation100TextExpVersion = this.apollo.readQuery({
				query: experimentAssignmentQuery,
				variables: { id: 'checkout_donation_100_text' },
			});
			// eslint-disable-next-line max-len
			this.checkoutDonation100TextExperiment = _get(checkoutDonation100TextExpVersion, 'experiment.version') || null;

			// eslint-disable-next-line max-len
			if (this.checkoutDonation100TextExperiment === 'variant-a') {
				this.$kvTrackEvent('basket', 'EXP-CASH-570-Feb2019', 'a');
			}
			if (this.checkoutDonation100TextExperiment === 'variant-b') {
				this.$kvTrackEvent('basket', 'EXP-CASH-570-Feb2019', 'b');
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

			// Experiment: CASH-386
			const totalLoansLentQuery = this.apollo.readQuery({
				query: donationDataQuery,
			});
			this.loanHistoryCount = _get(totalLoansLentQuery, 'my.loans.totalCount') || null;

			const nudgeLendingCostExperimentVersion = this.apollo.readQuery({
				query: experimentAssignmentQuery,
				variables: { id: 'donation_nudge_lending_cost' },
			});
			// eslint-disable-next-line max-len
			const nudgeLendingCostExperimentVersionString = _get(nudgeLendingCostExperimentVersion, 'experiment.version') || null;
			if (this.hasLoans && this.loanHistoryCount > 0 && nudgeLendingCostExperimentVersionString === 'variant-a') {
				this.$kvTrackEvent('basket', 'EXP-CASH-386-Jan2019', 'a');
				// eslint-disable-next-line max-len
			} else if (this.hasLoans && this.loanHistoryCount > 0 && nudgeLendingCostExperimentVersionString === 'variant-b') {
				this.$kvTrackEvent('basket', 'EXP-CASH-386-Jan2019', 'b');
				this.donationNudgeExperimentalHeader = true;
				this.donationNudgeExperimentalDescription = true;
			}

			// CASH-379: Donation Nudge Borrower Image Experiment
			const nudgeBorrowerImageExperimentVersion = this.apollo.readQuery({
				query: experimentAssignmentQuery,
				variables: { id: 'donation_nudge_borrower_image' },
			});
			// eslint-disable-next-line max-len
			const nudgeBorrowerImageExperimentVersionString = _get(nudgeBorrowerImageExperimentVersion, 'experiment.version') || null;
			if (this.hasLoans && nudgeBorrowerImageExperimentVersionString === 'variant-a') {
				this.$kvTrackEvent('basket', 'EXP-CASH-379-Feb2019', 'a');
			} else if (this.hasLoans && nudgeBorrowerImageExperimentVersionString === 'variant-b') {
				this.$kvTrackEvent('basket', 'EXP-CASH-379-Feb2019', 'b');
				this.donationNudgeBorrowerImageExperiment = true;
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
			this.$refs.nudgeLightbox.openNudgeLightbox();
		},
		donationNudgeHeader() {
			const newLoanCount = this.loanHistoryCount + this.loanCount;
			/* eslint-disable max-len */
			return this.donationNudgeExperimentalHeader
				? `${this.loanCount > 1 ? 'These loans' : 'This loan'} will bring you to ${newLoanCount} ${newLoanCount > 1 ? 'loans' : 'loan'} made on Kiva!`
				: 'We rely on donations to reach the people who need it the most';
			/* eslint-enable max-len */
		},
		donationNudgeDescription() {
			/* eslint-disable max-len */
			return this.donationNudgeExperimentalDescription
				? 'Did you know every $25 lent on Kiva costs over $3 to facilitate?'
				: 'Reaching financially excluded people around the world requires things like performing due diligence in over 80 countries, training hundreds of volunteer translators, and maintaining the infrastructure to facilitate over $1B in loans.';
			/* eslint-enable max-len */
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donation-icon {
	padding: 0;
}

.dedicate-heart {
	border: 1px solid $light-gray;
	padding: rem-calc(12);
	height: rem-calc(80);
	width: rem-calc(80);
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
		padding: rem-calc(6) 0;
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
