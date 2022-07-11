<template>
	<div class="tw-max-w-5xl tw-mx-auto">
		<div class="tw-w-full tw-mb-8 lg:tw-mb-12 lg:tw-mt-2 tw-px-2 tw-py-3">
			<div>
				<div class="tw-flex tw-flex-col lg:tw-flex-row tw-w-full tw-items-center">
					<div class="tw-w-full lg:tw-w-2/5 tw-pt-2 lg:tw-pl-3">
						<h2 class="tw-text-h2">
							Three borrowers recommended for you.
						</h2>

						<p class="tw-text-subhead tw-mt-2 tw-mb-3 tw-pr-2">
							{{ bundleText }}
						</p>

						<div class="tw-hidden lg:tw-block tw-mt-1">
							<kv-button
								type="button"
								@click="addBundleToBasket"
							>
								Lend to all three
							</kv-button>

							<p class="tw-text-small tw-mt-1">
								Lend now for as little as ${{ totalAmount }}
							</p>
						</div>
					</div>
					<div class="tw-w-full lg:tw-w-3/5">
						<kiva-classic-loan-carousel-exp
							:is-visible="showCarousel"
							:loan-ids="selectedChannelLoanIds"
							:selected-channel="selectedChannel"
							:show-view-more-card="showViewMoreCard"
							:is-bundle="true"
							:is-personalized="true"
							id="carousel_exp"
							@get-detailed-loan="getDetailedLoan"
						/>

						<div class="lg:tw-hidden tw-flex tw-flex-col tw-items-center tw-mt-3">
							<kv-button
								type="button"
								@click="addBundleToBasket"
								class="tw-w-full"
							>
								Lend to all three
							</kv-button>

							<p class="tw-text-small tw-mt-1">
								Lend now for as little as ${{ totalAmount }}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<kv-expandable :delay="150" easing="linear">
					<div ref="detailedLoanCardContainer" class="tw-w-full tw-mt-2">
						<loan-card-controller
							v-if="detailedLoan"
							loan-card-type="DetailedLoanCard"
							:loan="detailedLoan"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							:disable-redirects="true"
							:is-visitor="isVisitor"
							:hide-lend-cta="true"
							@close-detailed-loan-card="handleCloseLoanCard"
						/>
					</div>
				</kv-expandable>
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import KivaClassicLoanCarouselExp from '@/components/LoanCollections/KivaClassicLoanCarouselExp';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LoansBundleExpWrapper',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvExpandable,
		KvButton,
		KivaClassicLoanCarouselExp,
		LoanCardController
	},
	props: {
		firstName: {
			type: String,
			default: ''
		},
		personalizedLoans: {
			type: Array,
			default: () => [],
		},
		recommendedLoans: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			bundleLoans: [],
			selectedChannel: {},
			showCarousel: true,
			showViewMoreCard: false,
			detailedLoan: null,
			isVisitor: true,
			itemsInBasket: [],
		};
	},
	computed: {
		selectedChannelLoanIds() {
			return this.personalizedLoans?.map(element => element.id) ?? [];
		},
		bundleText() {
			let text = `${this.firstName}, grow your impact with these handpicked loans`;
			if (this.personalizedLoans[0] && this.personalizedLoans[1] && this.personalizedLoans[2]) {
				text = `${this.firstName}, grow your impact with these handpicked loans to
				${this.personalizedLoans[0].name}, ${this.personalizedLoans[1].name}
				and ${this.personalizedLoans[2].name}.`;
			}
			return text;
		},
		totalAmount() {
			let total = 0;
			this.personalizedLoans.forEach(element => {
				const { loanAmount, loanFundraisingInfo } = element;
				const { fundedAmount } = loanFundraisingInfo;
				const leftAmount = loanAmount - fundedAmount;
				if (leftAmount < 25) {
					total += leftAmount;
				} else {
					total += 25;
				}
			});
			return total;
		}
	},
	methods: {
		async addBundleToBasket() {
			try {
				await this.updateLoanReservation(0).then(async () => {
					await this.updateLoanReservation(1).then(async () => {
						await this.updateLoanReservation(2);
					});
				});

				this.$kvTrackEvent(
					'basket',
					'bundle-add-to-basket-funded-loan',
				);
				const idsString = this.selectedChannelLoanIds.join(', ').toString();
				this.$kvTrackEvent(
					'Lending',
					'click-loan-bundle-cta',
					'Lend to all three now - personalized',
					idsString,
					null
				);

				this.$router.push({ path: '/checkout' });
			} catch (e) {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			}
		},
		updateLoanReservation(id) {
			return Promise.resolve(
				this.apollo.mutate({
					mutation: updateLoanReservation,
					variables: {
						loanid: this.selectedChannelLoanIds[id],
						price: numeral(25).format('0.00'),
					},
				})
			);
		},
		getDetailedLoan(loanDetails) {
			this.detailedLoan = loanDetails;
		},
		handleCloseLoanCard() {
			this.detailedLoan = null;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

@include breakpoint(xxlarge) {
	#carousel_exp >>> section > div:nth-child(2) {
		display: none;
	}
}

#carousel_exp >>> section > div:nth-child(1) {
	column-gap: 0.8rem !important;
}

#carousel_exp >>> section > div:nth-child(1) > div {
	max-width: 188px !important;
}
</style>
