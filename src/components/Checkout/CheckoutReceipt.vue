<template>
	<div class="checkout-receipt">
		<h2 class="checkout-receipt__headline">
			Order Confirmation
		</h2>
		<section class="section">
			TODO: Date<br>
			{{ lender.firstName }} {{ lender.lastName }}<br>
			{{ lender.email }}
		</section>
		<section>
			<ul class="checkout-receipt__loan-list">
				<li
					class="section"
					v-for="loan in receiptData.items.values"
					:key="loan.id"
				>
					<div
						class="loan"
						v-if="loan.basketItemType === 'loan_reservation'"
					>
						<h3>
							<router-link
								class="loan__name"
								:to="`/lend/${loan.id}`"
							>
								{{ loan.name }}
							</router-link>
						</h3>
						<div class="loan__meta">
							<p class="loan__meta-city">
								<span v-if="loan.geocode && loan.geocode.city">{{ loan.geocode.city }},</span>
								<span v-if="loan.geocode && loan.geocode.country">{{ loan.geocode.country.name }}</span>
							</p>
							<p>{{ loan.use }}</p>
						</div>
						<div class="loan__amount">
							${{ loan.price }}
						</div>
					</div>

					<div
						class="loan"
						v-else-if="loan.basketItemType === 'donation'"
					>
						<h3 class="loan__name">
							Donation
						</h3>
						<div class="loan__amount">
							${{ loan.price }}
						</div>
					</div>
				</li>
			</ul>
		</section>
		<section class="section split total">
			<h3 class="total__header split__item">
				Total:
			</h3>
			<span class="total__amount split__item split__item--end">{{ receiptData.totals.itemTotal }}</span>
		</section>
		<section class="section payments">
			<h2 class="payments__header">
				Payments
			</h2>
			<ul class="payments__list">
				<li
					class="total split"
					v-if="receiptData.totals.depositTotals.depositTotal > 0"
				>
					<span class="total__header split__item">Kiva Credit:</span>
					<span class="total__amount split__item split__item--end">
						-${{ receiptData.totals.depositTotals.kivaCreditUsed }}
					</span>
				</li>
				<li
					class="total split"
					v-if="receiptData.totals.depositTotals.kivaCreditUsed > 0"
				>
					<span class="total__header split__item">Kiva Credit:</span>
					<span class="total__amount split__item split__item--end">
						-${{ receiptData.totals.depositTotals.kivaCreditUsed }}
					</span>
				</li>
			</ul>
		</section>
		<section class="section">
			<button class="print" @click="printReceipt">
				<icon-print class="print__icon" />
				<span>Print this receipt</span>
			</button>
		</section>
	</div>
</template>

<script>
import IconPrint from '@/assets/inline-svgs/icons/print.svg';

export default {
	components: {
		IconPrint,
	},
	props: {
		lender: {
			type: Object,
			required: true
		},
		receiptData: {
			type: Object,
			required: true
		},
	},
	methods: {
		printReceipt() {
			if (typeof window !== 'undefined') {
				window.print();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.checkout-receipt {
	&__headline {
		@include impact-text();

		text-align: center;
	}

	&__loan-list {
		list-style: none;
		margin: 0;
	}
}

.loan {
	&__name {
		font-size: $medium-text-font-size;
		font-weight: $global-weight-bold;
	}

	&__meta {
		@include small-text();
	}

	&__meta-city {
		color: $kiva-text-light;
		margin: 0;
	}

	&__amount {
		font-size: $medium-text-font-size;
		font-weight: $global-weight-bold;
		text-align: right;
	}
}

.total {
	&__header,
	&__amount {
		font-size: $medium-text-font-size;
		font-weight: $global-weight-bold;
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

.section {
	border-bottom: solid rem-calc(1) $light-gray;
	padding: $global-margin 0;
	display: block;
	overflow: hidden;
}

.split {
	display: flex;

	&__item {
		text-align: right;
		flex: 1;

		&--end {
			flex-grow: 0.33;
		}
	}
}
</style>
