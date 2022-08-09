<template>
	<div class="checkout-receipt">
		<h2 class="checkout-receipt__headline">
			Order Confirmation
		</h2>
		<div class="checkout-receipt__wrapper tw-bg-primary tw-p-4 tw-rounded-sm tw-border tw-border-tertiary">
			<section data-testid="lender-info" class="section section--lender-info">
				<div>{{ formattedTransactionTime }}</div>
				<div class="fs-exclude">
					{{ lender.firstName }} {{ lender.lastName }}
				</div>
				<div class="fs-exclude">
					{{ lender.email }}
				</div>
			</section>
			<section>
				<div
					data-testid="print-kcard-msg"
					class="section tw-text-center hide-for-print"
					v-if="printableKivaCards.length > 0"
				>
					<h2>Print your Kiva {{ printableKivaCards.length > 1 ? 'Cards' : 'Card' }}</h2>
					<p>
						The print-it-yourself Kiva {{ printableKivaCards.length > 1 ? 'Cards' : 'Card' }} you
						ordered can be printed right now by clicking on the print
						{{ printableKivaCards.length > 1 ? 'buttons' : 'button' }} in the receipt below.
						Or, you can print a copy anytime directly from your email receipt.
					</p>
				</div>
				<ul class="checkout-receipt__item-list">
					<!-- Loans -->
					<li
						data-testid="receipt-item-loan"
						class="section"
						v-for="loan in loans"
						:key="loan.id"
					>
						<div
							data-testid="loan"
							class="loan"
						>
							<h3 class="loan__name fs-exclude" data-testid="loan-name">
								<template v-if="disableRedirects">
									{{ loan.loan.name }}
								</template>
								<router-link
									v-else
									:to="`/lend/${loan.id}`"
								>
									{{ loan.loan.name }}
								</router-link>
							</h3>
							<div class="tw-text-small">
								<p class="tw-text-secondary" data-testid="loan-country">
									<template v-if="loan.loan.geocode && loan.loan.geocode.city">
										{{ loan.loan.geocode.city }},
									</template>
									<template v-if="loan.loan.geocode && loan.loan.geocode.country">
										{{ loan.loan.geocode.country.name }}
									</template>
								</p>
								<p v-if="loan.loan.use" data-testid="loan-use">
									A loan helps {{ loan.loan.use }}
								</p>
							</div>
							<div class="loan__amount tw-text-h3" data-testid="loan-amount">
								${{ loan.price }}
							</div>
						</div>
					</li>
					<!-- Kiva Cards -->
					<li
						data-testid="receipt-item-kcard"
						class="section"
						v-for="card in kivaCards"
						:key="card.id"
					>
						<div
							data-testid="kcard"
							class="loan kcard"
						>
							<template v-if="card.kivaCardObject.deliveryType === 'print'">
								<div>
									<h3
										class="loan__name loan__name--inline"
										data-testid="kcard-type-print"
									>
										Print-it-yourself Kiva Card
									</h3>
									<kv-icon
										data-testid="kcard-tool-tip-control"
										name="question"
										:id="`print-card-${card.id}`"
										class="loan__question-icon tw-fill-current tw-text-tertiary"
									/>
									<kv-tooltip
										data-testid="kcard-tool-tip-text"
										:controller="`print-card-${card.id}`" theme="mint"
									>
										You can print this card now. We'll also send it to
										you in an email so you can print it later.
									</kv-tooltip>
								</div>

								<kv-button
									data-testid="kcard-print-button"
									class="tw-mb-2"
									target="_blank"
									:href="`/gifts/kiva-cards/print?giftCode=${card.kivaCardObject.redemptionCode}`"
								>
									Print Kiva Card
								</kv-button>
							</template>
							<template v-else-if="card.kivaCardObject.deliveryType === 'postal'">
								<h3 class="loan__name" data-testid="kcard-type-postal">
									Postal delivery Kiva Card
								</h3>
								<div class="loan__details fs-exclude" data-testid="kcard-details">
									For: {{ card.kivaCardObject.mailingInfo.firstName }}
									{{ card.kivaCardObject.mailingInfo.lastName }}<br>
									{{ card.kivaCardObject.mailingInfo.address }}<br>
									<template v-if="card.kivaCardObject.mailingInfo.address2">
										{{ card.kivaCardObject.mailingInfo.address2 }}<br>
									</template>
									{{ card.kivaCardObject.mailingInfo.city }},
									{{ card.kivaCardObject.mailingInfo.state }}
									{{ card.kivaCardObject.mailingInfo.zip }}
								</div>
							</template>
							<template v-else-if="card.kivaCardObject.deliveryType === 'lender'">
								<h3 class="loan__name" data-testid="kcard-type-lender">
									Kiva Card
								</h3>
								<div
									data-testid="kcard-details"
									class="loan__details fs-exclude"
									v-if="card.kivaCardObject.recipient.name"
								>
									For: {{ card.kivaCardObject.recipient.name }}
								</div>
							</template>
							<template v-else-if="card.kivaCardObject.deliveryType === 'email'">
								<h3 class="loan__name" data-testid="kcard-type-email">
									Email delivery Kiva Card
								</h3>
								<div class="loan__details fs-exclude" data-testid="kcard-details">
									For:
									<template v-if="card.kivaCardObject.recipient.name">
										{{ card.kivaCardObject.recipient.name }} &ndash;
									</template>
									{{ card.kivaCardObject.recipient.email }}
								</div>
							</template>
							<div class="loan__amount tw-text-h3" data-testid="kcard-amount">
								${{ card.price }}
							</div>
						</div>
					</li>
					<li
						data-testid="kcard-portfolio"
						class="section tw-text-center"
						v-if="kivaCards.length > 0"
					>
						For more details about all your Kiva Card purchases, please visit your
						<router-link
							to="/portfolio/kiva-cards"
							v-kv-track-event="['Thanks','click', 'kiva-card-portfolio']"
						>
							Kiva portfolio
						</router-link>.
					</li>
				</ul>
			</section>
			<section>
				<ul class="checkout-receipt__item-list">
					<li class="section">
						<div
							class="loan"
							data-testid="donation"
						>
							<h3 class="loan__name">
								Donation to Kiva
							</h3>
							<router-link
								v-if="receipt.totals.donationTotal > 0"
								data-testid="print-donation-information"
								class="smallest"
								to="/portfolio/donations"
							>
								Print Donation Information
							</router-link>
							<div class="loan__amount tw-text-h3" data-testid="donation-amount">
								${{ receipt.totals.donationTotal }}
							</div>
						</div>
					</li>
					<li
						data-testid="receipt-total"
						class="section total"
					>
						<h3 class="total__header tw-text-h3">
							Total:
						</h3>
						<span
							class="total__amount tw-text-h3"
							data-testid="total-amount"
						>${{ receipt.totals.itemTotal }}</span>
					</li>
				</ul>
			</section>
			<section class="section payments">
				<h3 class="tw-text-secondary">
					Payments
				</h3>
				<ul class="payments__list">
					<li
						data-testid="payment-type-kcard"
						class="total"
						v-if="receipt.totals.redemptionCodeAppliedTotal > 0"
					>
						<span class="total__header tw-text-h3">Kiva Card:</span>
						<span class="total__amount tw-text-h3" data-testid="kcard-payment-amount">
							${{ receipt.totals.redemptionCodeAppliedTotal }}
						</span>
					</li>
					<li
						data-testid="payment-type-free-trial"
						class="total"
						v-if="receipt.totals.freeTrialAppliedTotal > 0"
					>
						<span class="total__header tw-text-h3">Free Trial:</span>
						<span class="total__amount tw-text-h3" data-testid="free-trial-payment-amount">Free!</span>
					</li>
					<li
						data-testid="payment-type-free-credit"
						class="total"
						v-if="receipt.totals.bonusAppliedTotal > 0"
					>
						<span class="total__header tw-text-h3">Free credit:</span>
						<span
							class="total__amount tw-text-h3"
							data-testid="free-credit-payment-amount"
						>{{ receipt.totals.bonusAppliedTotal }}</span>
					</li>
					<li
						data-testid="payment-type-kiva-credit-added"
						class="total"
						v-if="receipt.totals.depositTotals.kivaCreditAdded > 0"
					>
						<span class="total__header tw-text-h3">Kiva credit added:</span>
						<span class="total__amount tw-text-h3" data-testid="kiva-credit-added-payment-amount">
							${{ receipt.totals.depositTotals.kivaCreditAdded }}
						</span>
					</li>
					<li
						data-testid="payment-kiva-credit-used"
						class="total"
						v-if="receipt.totals.depositTotals.kivaCreditUsed > 0"
					>
						<span class="total__header tw-text-h3">Kiva credit:</span>
						<span class="total__amount tw-text-h3" data-testid="kiva-credit-use-payment-amount">
							${{ receipt.totals.depositTotals.kivaCreditUsed }}
						</span>
					</li>
					<li
						data-testid="payment-type-amount-charged"
						class="total"
						v-if="parseFloat(receipt.totals.depositTotals.depositTotal) > 0"
					>
						<span class="total__header tw-text-h3">Amount charged:</span>
						<span class="total__amount tw-text-h3" data-testid="amount-charged-payment-amount">
							${{ receipt.totals.depositTotals.depositTotal }}
						</span>
					</li>
				</ul>
			</section>
			<section class="section section--print hide-for-print">
				<button
					data-testid="print-receipt"
					class="print tw-text-link tw-flex tw-items-center tw-gap-1"
					@click="printReceipt"
				>
					<kv-icon name="print" class="print__icon tw-fill-current" />
					<span>Print this receipt</span>
				</button>
			</section>
		</div>
	</div>
</template>

<script>
import { format } from 'date-fns';
import KvIcon from '@/components/Kv/KvIcon';
import KvTooltip from '@/components/Kv/KvTooltip';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

// Ensures the date renders the same on client or SSR in any timezone.
// Taken from https://github.com/date-fns/date-fns/issues/376#issuecomment-353871093
const getUTCDate = (dateString = Date.now()) => {
	const date = new Date(dateString);

	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
	);
};

export default {
	name: 'CheckoutReceipt',
	components: {
		KvButton,
		KvIcon,
		KvTooltip,
	},
	props: {
		lender: {
			type: Object,
			required: true
		},
		receipt: {
			type: Object,
			required: true
		},
		disableRedirects: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		formattedTransactionTime() {
			return `${format(getUTCDate(this.receipt.transactionTime), 'MMMM dd, yyyy h:mm a')} GMT`;
		},
		loans() {
			if (!this.receiptValues.length) return [];
			return this.receipt.items.values.filter(item => item.basketItemType === 'loan_reservation');
		},
		kivaCards() {
			if (!this.receiptValues.length) return [];
			return this.receipt.items.values.filter(item => item.basketItemType === 'kiva_card');
		},
		printableKivaCards() {
			if (!this.receiptValues.length) return [];
			return this.kivaCards.filter(card => card.kivaCardObject.deliveryType === 'print');
		},
		donations() {
			return this.receipt.items.values.filter(item => item.basketItemType === 'donation');
		},
		receiptValues() {
			return this.receipt?.items?.values ?? [];
		}
	},
	methods: {
		printReceipt() {
			if (typeof window !== 'undefined') {
				window.print();
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.section {
	border-bottom: solid rem-calc(1) rgb(var(--border-tertiary));
	padding: $global-margin 0;
	display: block;
	overflow: hidden;

	&--lender-info {
		padding-top: 0;
	}

	&--print {
		border-bottom: 0;
	}

	@media print {
		page-break-inside: avoid;
	}
}

.checkout-receipt {
	&__headline {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	&__item-list {
		list-style: none;
		margin: 0;
		width: 100%;
	}
}

.loan {
	&__name {
		margin-bottom: 0.5rem;
	}

	&__name--inline {
		display: inline-block;
	}

	&__question-icon {
		width: 1rem;
	}

	&__amount {
		text-align: right;
	}
}

.total {
	display: flex;
	align-items: baseline;

	&__header,
	&__amount {
		text-align: right;
		flex: 1;
	}

	&__amount {
		flex-grow: 0.33;
	}
}

.payments {
	border-bottom: none;

	&__type {
		display: flex;
		text-align: right;
	}

	&__type-title,
	&__type-amount {
		flex: 1;
	}
}

.print {
	margin: 0 auto;

	&__icon {
		height: rem-calc(16);
		width: rem-calc(16);
	}
}
</style>
