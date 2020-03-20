<template>
	<div class="checkout-receipt">
		<h2 class="checkout-receipt__headline">
			Order Confirmation
		</h2>
		<section data-test="lender-info" class="section">
			<div>{{ formattedTransactionTime }}</div>
			<div>{{ lender.firstName }} {{ lender.lastName }}</div>
			<div>{{ lender.email }}</div>
		</section>
		<section>
			<div
				data-test="print-kcard-msg"
				class="section text-center hide-for-print"
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
					class="section"
					v-for="loan in loans"
					:key="loan.id"
				>
					<div
						data-test="loan"
						class="loan"
					>
						<h3 class="loan__name">
							<router-link
								:to="`/lend/${loan.id}`"
							>
								{{ loan.loan.name }}
							</router-link>
						</h3>
						<div class="loan__meta">
							<p class="loan__meta-city">
								<template v-if="loan.loan.geocode && loan.loan.geocode.city">
									{{ loan.loan.geocode.city }},
								</template>
								<template v-if="loan.loan.geocode && loan.loan.geocode.country">
									{{ loan.loan.geocode.country.name }}
								</template>
							</p>
							<p v-if="loan.loan.use" class="loan__meta-use">
								A loan helps {{ loan.loan.use }}
							</p>
						</div>
						<div class="loan__amount">
							${{ loan.price }}
						</div>
					</div>
				</li>
				<!-- Kiva Cards -->
				<li
					class="section"
					v-for="card in kivaCards"
					:key="card.id"
				>
					<div
						data-test="kcard"
						class="loan kcard"
					>
						<template v-if="card.kivaCardObject.deliveryType === 'print'">
							<div>
								<h3 class="loan__name loan__name--inline">
									Print-it-yourself Kiva Card
								</h3>
								<icon-question-mark
									:id="`print-card-${card.id}`"
									class="loan__question-icon"
								/>
								<kv-tooltip :controller="`print-card-${card.id}`">
									You can print this card now. We'll also send it to
									you in an email so you can print it later.
								</kv-tooltip>
							</div>

							<kv-button
								class="smallest"
								target="_blank"
								:href="`/gifts/kiva-cards/print?giftCode=${card.kivaCardObject.redemptionCode}`"
							>
								Print Kiva Card
							</kv-button>
						</template>
						<template v-else-if="card.kivaCardObject.deliveryType === 'postal'">
							<h3 class="loan__name">
								Postal delivery Kiva Card
							</h3>
							<div class="loan__details">
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
							<h3 class="loan__name">
								Kiva Card
							</h3>
							<div
								class="loan__details"
								v-if="card.kivaCardObject.recipient.name"
							>
								For: {{ card.kivaCardObject.recipient.name }}
							</div>
						</template>
						<template v-else-if="card.kivaCardObject.deliveryType === 'email'">
							<h3 class="loan__name">
								Email delivery Kiva Card
							</h3>
							<div class="loan__details">
								For:
								<template v-if="card.kivaCardObject.recipient.name">
									{{ card.kivaCardObject.recipient.name }} &ndash;
								</template>
								{{ card.kivaCardObject.recipient.email }}
							</div>
						</template>
						<div class="loan__amount">
							${{ card.price }}
						</div>
					</div>
				</li>
				<li
					data-test="kcard-portfolio"
					class="section text-center"
					v-if="kivaCards.length > 0"
				>
					For more details about all your Kiva Card purchases, please visit your
					<router-link to="/portfolio/kiva-cards"
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
						data-test="donation"
					>
						<h3 class="loan__name">
							Donation to Kiva
						</h3>
						<router-link
							class="smallest"
							to="/portfolio/donations"
						>
							Print Donation Information
						</router-link>
						<div class="loan__amount">
							${{ receipt.totals.donationTotal }}
						</div>
					</div>
				</li>
				<li
					data-test="receipt-total"
					class="section total"
				>
					<h3 class="total__header">
						Total:
					</h3>
					<span class="total__amount">${{ receipt.totals.itemTotal }}</span>
				</li>
			</ul>
		</section>
		<section class="section payments">
			<h2 class="payments__header">
				Payments
			</h2>
			<ul class="payments__list">
				<li
					data-test="kcard-payment"
					class="total"
					v-if="receipt.totals.redemptionCodeAppliedTotal > 0"
				>
					<span class="total__header">Kiva Card:</span>
					<span class="total__amount">${{ receipt.totals.redemptionCodeAppliedTotal }}</span>
				</li>
				<li
					data-test="free-trial"
					class="total"
					v-if="receipt.totals.freeTrialAppliedTotal > 0"
				>
					<span class="total__header">Free Trial:</span>
					<span class="total__amount">Free!</span>
				</li>
				<li
					data-test="free-credit"
					class="total"
					v-if="receipt.totals.bonusAppliedTotal > 0"
				>
					<span class="total__header">Free credit:</span>
					<span class="total__amount">{{ receipt.totals.bonusAppliedTotal }}</span>
				</li>
				<li
					data-test="kiva-credit-added"
					class="total"
					v-if="receipt.totals.depositTotals.kivaCreditAdded > 0"
				>
					<span class="total__header">Kiva credit added:</span>
					<span class="total__amount">${{ receipt.totals.depositTotals.kivaCreditAdded }}</span>
				</li>
				<li
					data-test="kiva-credit-used"
					class="total"
					v-if="receipt.totals.depositTotals.kivaCreditUsed > 0"
				>
					<span class="total__header">Kiva credit:</span>
					<span class="total__amount">${{ receipt.totals.depositTotals.kivaCreditUsed }}</span>
				</li>
				<li
					data-test="amount-charged"
					class="total"
					v-if="parseFloat(receipt.totals.depositTotals.depositTotal) > 0"
				>
					<span class="total__header">Amount charged:</span>
					<span class="total__amount">
						${{ receipt.totals.depositTotals.depositTotal }}
					</span>
				</li>
			</ul>
		</section>
		<section class="section section--print hide-for-print">
			<button class="print" @click="printReceipt">
				<icon-print class="print__icon" />
				<span>Print this receipt</span>
			</button>
		</section>
	</div>
</template>

<script>
import { format } from 'date-fns';
import KvButton from '@/components/Kv/KvButton';
import KvTooltip from '@/components/Kv/KvTooltip';
import IconQuestionMark from '@/assets/inline-svgs/icons/question-mark.svg';
import IconPrint from '@/assets/inline-svgs/icons/print.svg';

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
	components: {
		IconQuestionMark,
		IconPrint,
		KvTooltip,
		KvButton,
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
	},
	computed: {
		formattedTransactionTime() {
			return `${format(getUTCDate(this.receipt.transactionTime), 'MMMM dd, yyyy h:mm A')} GMT`;
		},
		loans() {
			return this.receipt.items.values.filter(item => item.basketItemType === 'loan_reservation');
		},
		kivaCards() {
			return this.receipt.items.values.filter(item => item.basketItemType === 'kiva_card');
		},
		printableKivaCards() {
			return this.kivaCards.filter(card => card.kivaCardObject.deliveryType === 'print');
		},
		donations() {
			return this.receipt.items.values.filter(item => item.basketItemType === 'donation');
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
	border-bottom: solid rem-calc(1) $light-gray;
	padding: $global-margin 0;
	display: block;
	overflow: hidden;

	&--print {
		border-bottom: 0;
	}

	@media print {
		page-break-inside: avoid;
	}
}

.checkout-receipt {
	background: #fff;
	padding: 2rem;
	border: 1px solid $subtle-gray;

	&__headline {
		@include impact-text();

		text-align: center;
	}

	&__item-list {
		list-style: none;
		margin: 0;
		width: 100%;
	}
}

.loan {
	&__name {
		font-size: $medium-text-font-size;
		font-weight: $global-weight-bold;
	}

	&__name--inline {
		display: inline-block;
	}

	&__question-icon {
		width: 1rem;
		fill: $light-gray;
	}

	&__meta {
		@include small-text();
	}

	&__meta-city {
		color: $kiva-text-light;
		margin: 0;
	}

	&__meta-use {
		margin: 0;
	}

	&__amount {
		font-size: $medium-text-font-size;
		font-weight: $global-weight-bold;
		text-align: right;
	}
}

.total {
	display: flex;

	&__header,
	&__amount {
		font-size: $medium-text-font-size;
		font-weight: $global-weight-bold;
		text-align: right;
		flex: 1;
	}

	&__amount {
		flex-grow: 0.33;
	}
}

.payments {
	&__header {
		color: $kiva-text-light;
	}

	&__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	&__type {
		display: flex;
		text-align: right;
	}

	&__type-title,
	&__type-amount {
		flex: 1;
	}

	@media print {
		border-bottom: none;
	}
}

.print {
	display: flex;
	margin: 0 auto;
	color: $anchor-color;
	text-decoration: $anchor-text-decoration;

	&__icon {
		width: rem-calc(16);
		margin-right: 0.5rem;

		path {
			fill: $anchor-color;
		}
	}

	&:hover,
	&:focus {
		text-decoration: $anchor-text-decoration-hover;
		color: $anchor-color-hover;

		.print__icon path {
			fill: $anchor-color-hover;
		}
	}
}

</style>
