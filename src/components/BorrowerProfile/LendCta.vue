<template>
	<div class="lg:tw-mb-1.5">
		<div class="tw-fixed
					tw-left-0
					md:tw-relative
					md:tw-left-unset
					tw-bottom-0
					tw-right-0
					md:tw-rounded-b
					md:tw-rounded-t-none
					lg:tw-rounded-t
					tw-bg-white
					tw-border
					tw-bt-1
					tw-border-gray-300
					md:tw-border-none
					tw-pt-1
					tw-px-2.5
					md:tw-pt-0
					md:tw-pb-2
					lg:tw-px-4
					lg:tw-py-1"
		>
			<p class="tw-text-h3 tw-pt-3 lg:tw-mb-3 tw-hidden lg:tw-inline-block">
				{{ lgScreenheadline }}
			</p>
			<span class="tw-flex tw-pb-1 lg:tw-pb-3">
				<kv-ui-select
					v-if="hideShowLendDropdown"
					id="LoanAmountDropdown"
					class="tw-pr-2.5 tw--mb-2"
					v-model="selectedOption"
				>
					<option
						v-for="priceOption in prices"
						:key="priceOption"
						:value="priceOption"
					>
						${{ priceOption }}
					</option>
				</kv-ui-select>
				<!-- Lend button -->
				<kv-ui-button
					v-if="!showAdding && !inBasket"
					class="tw-inline-flex tw-flex-1"
					@click="addToBasket"
				>
					{{ ctaButtonText }}
				</kv-ui-button>
				<!-- Continue to checkout button -->
				<kv-ui-button
					v-if="inBasket"
					class="tw-inline-flex tw-flex-1"
					:to="'/basket'"
				>
					Continue to checkout
				</kv-ui-button>
				<!-- Adding to basket button -->
				<kv-ui-button
					v-if="showAdding"
					class="tw-inline-flex tw-flex-1"
				>
					Adding to basket...
				</kv-ui-button>
			</span>
			<!-- Do I need another check here,
				right now just checking if user has free credit.
				Is there an additional/different check on loan for free
				credit eligibilty of loan? -->
			<p
				v-if="freeCreditWarning && !allSharesReserved"
				class="tw-text-h4 tw-text-gray-500 tw-inline-block tw-text-center tw-w-full"
			>
				Not eligilble for lending credit
			</p>
			<p
				v-if="allSharesReserved"
				class="tw-text-h4 tw-text-gray-500 tw-inline-block tw-text-center tw-w-full"
			>
				All shares reserved
			</p>
		</div>
		<div v-if="lenderCountVisibilty"
			class="tw-fixed
					md:tw-static
					tw-left-3
					tw-right-3
					tw-bottom-8
					tw-rounded
					tw-bg-white
					tw-text-h4
					tw-justify-center
					tw-mt-1
					tw-mb-1
					md:tw-mr-3
					lg:tw-mb-0
					tw-flex
					md:tw-w-3/5
					lg:tw-w-full
					md:tw-float-right
					lg:tw-float-none
					tw-p-1"
		>
			<kv-material-icon
				class="tw-h-2.5 tw-pointer-events-none"
				:icon="mdiLightningBolt"
			/>
			powered by {{ numLenders }} lenders
		</div>
	</div>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import * as Sentry from '@sentry/browser';
import gql from 'graphql-tag';
import { buildPriceArray } from '@/util/loanUtils';
import numeral from 'numeral';
import basketItemsQuery from '@/graphql/query/basketItems.graphql';
import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		price: {
			type: [Number, String],
			default: 25,
		},
	},
	components: {
		KvUiSelect,
		KvUiButton,
		KvMaterialIcon,
	},
	data() {
		return {
			mdiLightningBolt,
			defaultSelectorAmount: 25,
			selectedOption: '25',
			loanAmount: '',
			isExpiringSoon: false,
			fundedAmount: '',
			reservedAmount: '',
			unreservedAmount: '',
			lentPreviously: false,
			amountInBasket: '',
			minNoteSize: '',
			status: '',
			numLenders: 0,
			lenderCountVisibilty: false,
			isAdding: false,
			inBasket: false,
			hasFreeCredit: false,
		};
	},
	apollo: {
		query: gql`
			query lendCta($loanId: Int!, $basketId: String,) {
				lend {
					loan(id: $loanId) {
						id
						status
						minNoteSize
						loanAmount
						unreservedAmount @client
						loanFundraisingInfo {
							fundedAmount
							reservedAmount
							isExpiringSoon
						}
						userProperties {
							lentTo
							amountInBasket
						}
						lenders{
							totalCount
						}
					}
				}
				shop (basketId: $basketId) {
					id
					basket {
						id
						hasFreeCredits
						items {
							values {
								id
							}
						}
					}
				}
			}
		`,
		preFetch: false,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;

			this.loanAmount = loan?.loanAmount ?? '0';
			this.status = loan?.status ?? '';
			this.minNoteSize = loan?.minNoteSize ?? '';
			this.fundedAmount = loan?.loanFundraisingInfo?.fundedAmount ?? '';
			this.reservedAmount = loan?.loanFundraisingInfo?.reservedAmount ?? '';
			this.unreservedAmount = loan?.unreservedAmount ?? '';
			this.isExpiringSoon = loan?.loanFundraisingInfo?.isExpiringSoon ?? false;
			this.lentPreviously = loan?.userProperties?.lentTo ?? false;
			this.amountInBasket = loan?.userProperties?.amountInBasket ?? '';
			this.numLenders = loan?.lenders?.totalCount ?? 0;
			this.hasFreeCredit = result?.data?.basket?.hasFreeCredits ?? false;

			if (this.status === 'fundraising') {
				this.lenderCountVisibilty = true;
			}
		},
	},
	methods: {
		addToBasket() {
			const price = numeral(this.price).format('0.00');
			this.isAdding = true;
			this.apollo.mutate({
				mutation: gql`mutation addToBasket($loanId: Int!, $price: Money!, $basketId: String) {
					shop (basketId: $basketId) {
						id
						updateLoanReservation (loanReservation: {
							id: $loanId
							price: $price
						}) {
							id
							price
						}
					}
				}`,
				variables: {
					loanId: this.loanId,
					price,
				},
				optimisticResponse: {
					__typename: 'Mutation',
					shop: {
						__typename: 'ShopMutation',
						updateLoanReservation: {
							__typename: 'LoanReservation',
							id: this.loanId,
							price,
						},
					},
				},
				awaitRefetchQueries: true,
				refetchQueries: [
					{
						query: basketItemsQuery,
						variables: {
							basketId: this.cookieStore.get('kvbskt'),
						}
					},
				]
			}).then(result => {
				this.isAdding = false;
				if (result.error) {
					this.handleError(result.error);
				}
			}).catch(error => {
				this.isAdding = false;
				this.handleError(error);
			});
		},
		handleError(err) {
			console.error(err);
			this.$showTipMsg('There was a problem adding the loan to your basket', 'error');
			try {
				Sentry.withScope(scope => {
					scope.setTag('loan_id', this.loanId);
					Sentry.captureException(err);
				});
			} catch (e) {
				// no-op
			}
		}
	},
	computed: {
		prices() {
			const minAmount = parseFloat(this.minNoteSize);
			// limit at 20 price options
			return buildPriceArray(parseFloat(this.unreservedAmount), minAmount).slice(0, 20);
		},
		lgScreenheadline() {
			if (this.status === 'fundraising') {
				return 'Help fund this loan';
			}
			if (this.status === 'funded') {
				return 'Help more borrowers like this';
			}
			// refuned, expired or all shares reserved
			if (this.status === 'refuned' || this.status === 'expired' || this.allSharesReserved === true) {
				return 'Help fund other borrowers';
			}
			return 'Loading...';
		},
		ctaButtonText() {
			if (this.status === 'fundraising' && this.lentPreviously) {
				return 'Lend again';
			}
			if (this.status === 'fundraising') {
				return 'Lend now';
			}
			if (this.status === 'funded') {
				return 'Find another loan like this';
			}
			// refuned, expired or all shares reserved
			if (this.status === 'refuned' || this.status === 'expired' || this.allSharesReserved === true) {
				return 'Find another loan';
			}
			return 'Loading...';
		},
		state() {
			if (this.isAdding) {
				return 'adding';
			}
			if (this.amountInBasket !== '') {
				return 'basketed';
			}
			if (this.lentPreviously) {
				return 'lent-to';
			}
			return 'lend';
		},
		showAdding() {
			return this.state === 'adding';
		},
		hideShowLendDropdown() {
			if (this.status !== 'fundraising' || this.amountInBasket !== '' || this.allSharesReserved) {
				return false;
			}
			return true;
		},
		freeCreditWarning() {
			if (this.hasFreeCredit === true) {
				return true;
			}
			return false;
		},
		allSharesReserved() {
			if (parseFloat(this.unreservedAmount) === 0) {
				return true;
			}
			return false;
		}
	},
};

</script>
