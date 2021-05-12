<template>
	<div class="basket-donation-item row">
		<div class="hide-for-small-only medium-3 large-2 columns">
			<div class="donation-icon">
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</div>
		</div>
		<div class="small-12 medium-5 large-7 columns donation-info-wrapper">
			<div class="donation-info featured-text">
				{{ donationTitle }}
			</div>
			<div v-if="hasLoans">
				<div class="donation-tagline small-text" v-html="donationTagLine">
				</div>
				<button
					class="small-text donation-help-text"
					@click="triggerDefaultLightbox"
					v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
				>
					{{ donationDetailsLink }}
				</button>
			</div>
		</div>
		<div class="small-12 medium-4 large-3 columns medium-text-font-size">
			<div
				v-show="!editDonation"
				class="donation-amount-wrapper"
			>
				<button
					class="donation-amount"
					v-kv-track-event="['basket', 'Edit Donation']"
					@click="enterEditDonation"
					title="Edit Donation"
				>
					{{ formattedAmount }}
					<kv-icon
						role="img"
						aria-label="Edit Donation"
						title="Edit Donation"
						class="edit-donation"
						name="pencil"
					/>
				</button>
			</div>
			<div v-show="editDonation" class="small-12 columns donation-amount-input-wrapper">
				<input
					type="input"
					class="donation-amount-input"
					name="donation"
					id="donation"
					v-model="amount"
					@blur="validateInput"
					@keyup.enter.prevent="updateDonation()"
				>
				<kv-button
					class="secondary update-donation-inline-button"
					@click.native.prevent.stop="updateDonation()"
				>
					Update
				</kv-button>
				<button
					class="show-for-medium remove-wrapper"
					@click="updateLoanAmount('remove')"
				>
					<kv-icon class="remove-x" name="small-x" :from-sprite="true" title="Remove donation" />
				</button>
			</div>
			<donate-repayments
				v-if="hasLoans"
				@updating-totals="$emit('updating-totals', $event)"
				@refreshtotals="$emit('refreshtotals')"
			/>
		</div>
		<donation-nudge-lightbox
			v-if="!donationNudgeFellows"
			ref="nudgeLightbox"
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:nudge-lightbox-visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:has-custom-donation="hasCustomDonation"
			:experimental-footer="showCharityOverheadFooter"
			:description="donationNudgeDescription()"
			:percentage-rows="donationNudgePercentageRows"
			:current-donation-amount="amount"
		/>
		<donation-nudge-lightbox-image
			v-else
			ref="nudgeLightbox"
			:loan-count="loanCount"
			:loan-reservation-total="loanReservationTotal"
			:nudge-lightbox-visible="nudgeLightboxVisible"
			:close-nudge-lightbox="closeNudgeLightbox"
			:update-donation-to="updateDonationTo"
			:has-custom-donation="hasCustomDonation"
			:header="donationNudgeFellowsHeader"
			:experimental-footer="showCharityOverheadFooter"
			:description="donationNudgeDescription()"
			:percentage-rows="donationNudgePercentageRows"
			:current-donation-amount="amount"
		/>
		<kv-lightbox
			:visible="defaultLbVisible"
			@lightbox-closed="lightboxClosed"
			title="How does Kiva use donations?"
		>
			<p>
				100% of money lent on Kiva goes to funding loans,
				so we rely on donations to continue this important work.
				Each dollar helps us invest in systemic change and spread financial inclusion around the world.
			</p>
			<p>
				We’re investing in lasting solutions for a more inclusive world through your donations.
				Projects like...
			</p>
			<ul style="margin-bottom: 1rem;">
				<li>
					Kiva Protocol, giving unbanked people a digital identity and secure control over their
					own credit information in places like Sierra Leone.
				</li>
				<li>
					Kiva Capital, scaling our model for institutional investors.
				</li>
				<li>
					Kiva Labs, supporting small and growing social enterprises around the world.
				</li>
			</ul>
			<p>
				Your donations also help over 100 Kiva employees and more than 400 volunteers
				make your loans happen!
			</p>
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import gql from 'graphql-tag';
import _forEach from 'lodash/forEach';
import { processPageContentFlat } from '@/util/contentfulUtils';

import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import DonateRepayments from '@/components/Checkout/DonateRepaymentsToggle';
import donationDataQuery from '@/graphql/query/checkout/donationData.graphql';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import DonationNudgeLightbox from '@/components/Checkout/DonationNudge/DonationNudgeLightbox';
import DonationNudgeLightboxImage from '@/components/Checkout/DonationNudge/DonationNudgeLightboxImage';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const donationItemQuery = gql`query donationItemQuery {
	contentful {
		entries (contentType: "page", contentKey: "checkout")
	}
}`;

export default {
	components: {
		KvIcon,
		KvButton,
		KvLightbox,
		DonateRepayments,
		DonationNudgeLightbox,
		DonationNudgeLightboxImage,
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
	},
	data() {
		return {
			defaultLbVisible: false,
			amount: numeral(this.donation.price).format('$0,0.00'),
			cachedAmount: numeral(this.donation.price).format('$0,0.00'),
			editDonation: false,
			nudgeLightboxVisible: false,
			isCash80Running: true,
			donationTagLineExperiment: false,
			hasCustomDonation: true,
			donationNudgeExperimentalDescription: false,
			loanHistoryCount: null,
			donationNudgeBorrowerImageExperiment: false,
			donationDetailsLink: 'How Kiva uses donations',
			showCharityOverheadFooter: false,
			donationNudgeFellows: false,
			donationNudgeFellowsHeader: 'Donations enable Kiva Fellows to reach the people who need it most',
			dynamicDonationItem: ''
		};
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: donationDataQuery
				}).then(() => {
					Promise.all([
						// Get the assigned experiment version for Donation Nudge Borrower Image Experiment
						client.query({ query: experimentAssignmentQuery, variables: { id: 'charity_overhead' } }),
						// Get the assigned experiment version for Donation nudge fellows experiment
						client.query({ query: experimentAssignmentQuery, variables: { id: 'donation_nudge_fellows' } }),
						// Get the assigned experiment version for GROW-74
						client.query({ query: experimentAssignmentQuery, variables: { id: 'checkout_donation_tag_line' } }), // eslint-disable-line max-len
						// Get contentful dynamic content
						client.query({ query: donationItemQuery })
					]).then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		this.setupExperimentState();
		this.setupContentfulContent();
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
		donationTagLine() {
			const loanCost = numeral(Math.floor(this.loanReservationTotal * 0.12)).format('$0,0');
			// if there is dynamic donation tagline from contentful, use that.
			if (this.dynamicDonationItem) {
				// process contentful content as rich text
				const contentfulHTML = documentToHtmlString(this.dynamicDonationItem);
				// replace magic variable ###loan_costs###
				return contentfulHTML.replace(/###loan_costs###/g, loanCost);
			}

			let coverOurCosts = `${this.loanCount > 1 ? 'These loans cost' : 'This loan costs'}`;
			if (this.donationTagLineExperiment) {
				coverOurCosts = 'During the COVID-19 pandemic, Kiva is working with lenders, Field Partners, borrowers and more to ensure a rapid and impactful global response. Your donations help us fight this global crisis.'; // eslint-disable-line max-len
			} else {
				coverOurCosts += ` Kiva more than ${loanCost} to facilitate. Will you help us cover our costs?`;
			}
			return coverOurCosts;
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
		setupContentfulContent() {
			if (this.hasLoans) {
				const contentfulContentRaw = this.apollo.readQuery({
					query: donationItemQuery,
				});
				const pageEntry = contentfulContentRaw?.contentful?.entries?.items?.[0] ?? null;
				const pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
				// eslint-disable-next-line max-len
				this.dynamicDonationItem = pageData?.page?.contentGroups?.checkoutDonationItem?.contents?.[0]?.richText ?? '';
			}
		},
		setupExperimentState() {
			// get experiment data from apollo cache
			// CASH-1022: Show charity overhead footer
			if (this.hasLoans) {
				const charityOverheadExp = this.apollo.readFragment({
					id: 'Experiment:charity_overhead',
					fragment: experimentVersionFragment,
				}) || {};
				if (charityOverheadExp.version === 'control') {
					this.$kvTrackEvent('basket', 'EXP-CASH-1022-Jul2019', 'a');
				} else if (charityOverheadExp.version === 'shown') {
					this.$kvTrackEvent('basket', 'EXP-CASH-1022-Jul2019', 'b');
					this.showCharityOverheadFooter = true;
				}
			}
			// CASH-1111: Donation Nudge Fellows
			if (this.hasLoans) {
				const donationNudgeFellowsExp = this.apollo.readFragment({
					id: 'Experiment:donation_nudge_fellows',
					fragment: experimentVersionFragment,
				}) || {};
				if (donationNudgeFellowsExp.version === 'control') {
					this.$kvTrackEvent('basket', 'EXP-CASH-1111-Aug2019', 'a');
				} else if (donationNudgeFellowsExp.version === 'shown') {
					this.$kvTrackEvent('basket', 'EXP-CASH-1111-Aug2019', 'b');
					this.donationNudgeFellows = true;
				}
			}
			// GROW-74: Donation tag line
			if (this.hasLoans) {
				const donationTagLineExperiment = this.apollo.readFragment({
					id: 'Experiment:checkout_donation_tag_line',
					fragment: experimentVersionFragment,
				}) || {};
				if (donationTagLineExperiment.version === 'control') {
					this.$kvTrackEvent('Checkout', 'EXP-GROW-74-Apr2020', 'a');
				} else if (donationTagLineExperiment.version === 'shown') {
					this.$kvTrackEvent('Checkout', 'EXP-GROW-74-Apr2020', 'b');
					this.donationTagLineExperiment = true;
				}
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
		donationNudgeDescription() {
			/* eslint-disable max-len */
			return 'Reaching financially excluded people around the world requires things like performing due diligence in over 80 countries, training hundreds of volunteer translators, and maintaining the infrastructure to facilitate over $1B in loans.';
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
	fill: $kiva-icon-green;
}

.donation-info {
	line-height: 1.25;
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
		min-height: 2rem;
		vertical-align: top;

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
	border: 1px solid $charcoal;
	border-radius: $button-radius;
	text-align: center;
	font-weight: $global-weight-highlight;
	color: $charcoal;
	margin-bottom: rem-calc(15);

	@include breakpoint(medium) {
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
