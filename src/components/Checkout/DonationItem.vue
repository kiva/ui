<template>
	<div class="basket-donation-item row">
		<span class="small-3 medium-2 large-1">
			<span class="donation-icon">
				<kv-icon class="dedicate-heart" name="dedicate-heart" />
			</span>
		</span>
		<span class="small-9 medium-7 large-9 donation-info-wrapper">
			<span class="donation-info featured-text">
				Donation to Kiva
			</span>
			<div>
				<div class="donation-tagline small-text">{{ donationTagLine }}</div>
				<a
					v-if="this.expVersion === 'control'"
					class="small-text donation-help-text"
					@click.prevent="triggerDefaultLightbox"
					v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']">
					How Kiva uses donations
				</a>
				<a
					v-if="this.expVersion !== 'control'"
					class="small-text"
					@click.prevent="changeDonationAmount">{{ changeDonationAmount }}
				</a>
				<!-- This lightbox will be replaced with a Popper tip message. -->
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
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-3 large-2 medium-text-font-size">
			<div
				v-if="!editDonation"
				class="donation-amount-wrapper">
				<span
					v-if="!editDonation"
					class="donation-amount"
					v-kv-track-event="['basket', 'Edit Donation']"
					@click.prevent="editDonation = true">{{ formattedAmount }}
					<kv-icon
						class="edit-donation"
						name="pencil"/>
				</span>
			</div>
			<div v-else class="small-12 donation-amount-input-wrapper">
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
		</span>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import donationExpQuery from '@/graphql/query/checkout/donationExpAssignment.graphql';
import donationDataQuery from '@/graphql/query/checkout/donationData.graphql';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import { readJSONSetting } from '@/util/settingsUtils';
import numeral from 'numeral';
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';

export default {
	components: {
		KvIcon,
		KvButton,
		KvLightbox
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
		}
	},
	data() {
		return {
			defaultLbVisible: false,
			amount: numeral(this.donation.price).format('$0,0.00'),
			cachedAmount: numeral(this.donation.price).format('$0,0.00'),
			editDonation: false,
			expVersion: '',
			expName: ''
		};
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: donationDataQuery
				}).then(() => {
					// Get the assigned experiment version
					client.query({ query: donationExpQuery }).then(resolve).catch(reject);
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
		serverAmount() {
			return numeral(this.donation.price).format('$0,0.00');
		},
		formattedAmount() {
			return numeral(this.amount).format('$0,0.00');
		},
		donationTagLine() {
			// Donation exp configuration lines 150-155
			if (this.expVersion === 'variant-a') {
				const tagline = 'Donations of $15 or more are matched by generous donors for a limited time!';

				return tagline;
			} else if (this.expVersion === 'variant-b') {
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
		changeDonationAmount() {
			if (numeral(this.serverAmount).value() < 15 && this.expVersion === 'variant-a') {
				return 'Boost your donation to $15 and double your impact.';
			} else if (numeral(this.serverAmount).value() < 10 && this.expVersion === 'variant-b') {
				return 'Boost your donation to $10 and double your impact.';
			}
		}
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		setupExperimentState() {
			// get experiment data from apollo cache
			const donationExpVersion = this.apollo.readQuery({ query: donationExpQuery });
			this.expVersion = _get(donationExpVersion, 'experiment.version') || null;

			// get experiment data from apollo cache
			const donationExpSetting = this.apollo.readQuery({ query: donationDataQuery });
			const expData = readJSONSetting(donationExpSetting, 'general.experiment.value') || {};

			if (this.expVersion && this.expVersion !== 'control') {
				this.expName = _get(expData, `variants[${this.expVersion}].name`) || null;
			}

			// if exp version a
			// return 15$ match case
			if (this.expVersion === 'variant-a') {

				// tracking info
				// ie: this.$kvTrackEvent('Ui-Register', 'EXP-RegFormFields', this.expName);
			}

			// if exp version c
			// return 10$ match case
			if (this.expVersion === 'variant-b') {

				// tracking info
				// ie: this.$kvTrackEvent('Ui-Register', 'EXP-RegFormFields', this.expName);
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
		height: rem-calc(55);
		width: rem-calc(55);
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
	margin-bottom: 5px;
}

.donation-help-text {
	display: block;
	margin-bottom: rem-calc(15);
}

.donation-amount-wrapper {
	margin-left: 0.6rem;
	width: 10.8rem;
	text-align: right;

	@include breakpoint(medium) {
		margin: 0;
		width: auto;
		text-align: right;
	}

	.donation-amount {
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

</style>
