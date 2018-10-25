<template>
	<div class="basket-item-wrapper row">
		<span class="small-3 medium-2 large-1">
			<span class="kiva-card-icon">
				<!-- Print Kiva Card -->
				<span v-if="cardType == 'print'">
					<img alt="print-kiva-card"
						class="card-preview"
						src="../../assets/images/checkout/kiva_card_print_preview.jpg">
				</span>
				<!-- Postal Kiva Card -->
				<span v-if="cardType == 'postal'">
					<img alt="postal-kiva-card"
						class="card-preview"
						src="../../assets/images/checkout/kiva_card_postal_preview.jpg">
				</span>
				<!-- Email Kiva Card -->
				<span v-if="cardType == 'email'">
					<img alt="email-kiva-card"
						class="card-preview"
						src="../../assets/images/checkout/kiva_card_email_preview.jpg">
				</span>
			</span>
		</span>
		<span class="small-9 medium-7 large-9 kiva-card-info-wrapper">
			<!-- Main line text -->
			<span class="kiva-card-info featured-text">
				<!-- Print Kiva Card -->
				<span v-if="cardType == 'print'">Print-it-yourself Kiva Card ({{ quantity }})</span>
				<!-- Postal Kiva Card -->
				<span v-if="cardType == 'postal'">Postal delivery Kiva Card ({{ quantity }})</span>
				<!-- Email Kiva Card -->
				<span v-if="cardType == 'email'">Email delivery Kiva Card</span>

				<!-- current link in kiva/main -->
				<!-- <a class="editGift small" href="{kvurl page=gift action=kivaCards
				gift_ids=$kiva_card.display_details.ids_in_group}#/{$kiva_card.kc_object->deliveryType}"
				>Edit</a> -->

				<kv-icon
					class="edit-pencil-icon"
					name="pencil"/>

				<!-- href="gifts/kiva-cards?{{gift_ids}} /cardType" -->

				<div class="sub-text-container">
					<!-- Print Kiva Card -->
					<span v-if="cardType == 'print'">
						<div class="small-text">Available after checkout</div>
						<div class="small-text">For {{ recipientName }}</div>
					</span>
					<!-- Postal Kiva Card -->
					<span v-if="cardType == 'postal'">
						<div class="small-text">
							{{ mailingFirstName }}
							{{ mailingLastName }}
							{{ mailingStreet }}
							{{ mailingCity }},
							{{ mailingState }}
							{{ mailingZip }}
						</div>
					</span>
					<!-- Email Kiva Card -->
					<span v-if="cardType == 'email'">
						<div class="small-text">Scheduled to be sent  {{ deliveryDate }}</div>
						<div class="small-text">For {{ recipientName }} {{ recipientEmail }}</div>
					</span>
				</div>
			</span>
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-3 large-2 price-wrapper medium-text-font-size">
			<!-- Kiva card amount dropdown section -->
			<loan-price
				:kiva-card-id="kivaCard.id"
				:price="individualPrice"
				type="kivaCard"
				@refreshtotals="onLoanUpdate($event)"
				@updating-totals="$emit('updating-totals', $event)"
			/>
		</span>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import LoanPrice from '@/components/Checkout/LoanPrice';
import { format } from 'date-fns';

export default {
	components: {
		KvIcon,
		LoanPrice
	},
	props: {
		kivaCard: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			cardType: this.kivaCard.kivaCardObject.deliveryType,
			recipientName: this.kivaCard.kivaCardObject.recipient.name,
			recipientEmail: this.kivaCard.kivaCardObject.recipient.email,
			mailingFirstName: this.kivaCard.kivaCardObject.mailingInfo.firstName,
			mailingLastName: this.kivaCard.kivaCardObject.mailingInfo.lastName,
			mailingStreet: this.kivaCard.kivaCardObject.mailingInfo.address,
			mailingCity: this.kivaCard.kivaCardObject.mailingInfo.city,
			mailingState: this.kivaCard.kivaCardObject.mailingInfo.state,
			mailingZip: this.kivaCard.kivaCardObject.mailingInfo.zip,
			quantity: this.kivaCard.quantity
		};
	},
	computed: {
		deliveryDate() {
			return format(this.kivaCard.kivaCardObject.recipient.scheduledDeliveryDate, 'MM/DD/YYYY');
		},
		individualPrice() {
			const convertedQuantity = parseInt(this.kivaCard.quantity, 10);
			const convertedPrice = parseFloat(this.kivaCard.price);
			// Not yet working
			if (convertedQuantity < 1) {
				return String(convertedPrice / convertedQuantity);
			}
			return this.kivaCard.price;
		}
	},
	methods: {
		onLoanUpdate($event) {
			this.$emit('refreshtotals', $event);
			if ($event === 'removeLoan') {
				this.loanVisible = false;
			}
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.basket-item-wrapper {
	margin-bottom: rem-calc(30);
	padding-right: rem-calc(20);
}

.kiva-card-info-wrapper {
	padding-left: rem-calc(10);
}

.kiva-card-info {
	font-weight: $global-weight-highlight;
}

.sub-text-container {
	color: $gray;
	font-weight: $global-weight-normal;
}

.edit-pencil-icon {
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

.price-wrapper {
	padding-left: rem-calc(10);
}

.card-preview {
	height: rem-calc(71);
	width: rem-calc(71);
	padding: rem-calc(4);

	@include breakpoint(medium) {
		height: rem-calc(55);
		width: rem-calc(55);
	}
}
</style>
