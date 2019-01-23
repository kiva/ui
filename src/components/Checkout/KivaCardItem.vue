<template>
	<div class="basket-item-wrapper row">
		<span class="hide-for-small-only medium-3 large-2">
			<span class="kiva-card-icon">
				<!-- Print Kiva Card -->
				<span v-if="cardType == 'print'">
					<img alt="print-kiva-card"
						class="card-preview"
						src="~@/assets/images/checkout/kiva_card_print_preview.jpg">
				</span>
				<!-- Postal Kiva Card -->
				<span v-if="cardType == 'postal'">
					<img alt="postal-kiva-card"
						class="card-preview"
						src="~@/assets/images/checkout/kiva_card_postal_preview.jpg">
				</span>
				<!-- Email Kiva Card -->
				<span v-if="cardType == 'email'">
					<img alt="email-kiva-card"
						class="card-preview"
						src="~@/assets/images/checkout/kiva_card_email_preview.jpg">
				</span>
			</span>
		</span>
		<span class="small-12 medium-5 large-7 kiva-card-info-wrapper">
			<!-- Main line text -->
			<span class="kiva-card-info featured-text">
				<!-- Print Kiva Card -->
				<span v-if="cardType == 'print'">Print-it-yourself Kiva Card
					<span v-if="quantity > 1">({{ quantity }})</span>
				</span>
				<!-- Postal Kiva Card -->
				<span v-if="cardType == 'postal'">Postal delivery Kiva Card
					<span v-if="quantity > 1">({{ quantity }})</span>
				</span>
				<!-- Email Kiva Card -->
				<span v-if="cardType == 'email'">Email delivery Kiva Card</span>

				<a :href="formedEditUrl"
					v-kv-track-event="['basket', 'Edit Kiva Card', cardType]"
				>
					<kv-icon
						class="edit-pencil-icon"
						name="pencil"/>
				</a>

				<div class="sub-text-container">
					<!-- Print Kiva Card -->
					<span v-if="cardType == 'print'">
						<div class="small-text">Available after checkout</div>
						<div class="small-text" v-if="recipientName">For {{ recipientName }}</div>
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
		<span class="small-12 medium-4 large-3 price-wrapper medium-text-font-size">
			<!-- Kiva card amount dropdown section -->
			<loan-price
				:ids-in-group="kivaCard.idsInGroup"
				:price="kivaCard.individualPrice"
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
			quantity: this.kivaCard.quantity,
			idsInGroup: this.kivaCard.idsInGroup
		};
	},
	computed: {
		deliveryDate() {
			return format(this.kivaCard.kivaCardObject.recipient.scheduledDeliveryDate, 'MM/DD/YYYY');
		},
		formedEditUrl() {
			let giftId = '';

			for (let i = 0; i < this.idsInGroup.length; i += 1) {
				giftId += `gift_ids[${i}]=${this.idsInGroup[i]}&`;
			}

			const formedEditURL = `/gifts/kiva-cards/?${giftId}#/${this.cardType}`;
			return formedEditURL;
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
}

.kiva-card-info {
	line-height: 0.8;
	font-weight: $global-weight-highlight;
}

.sub-text-container {
	color: $gray;
	font-weight: $global-weight-normal;
}

.sub-text-container div.small-text {
	margin-bottom: rem-calc(5);
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

.card-preview {
	height: rem-calc(80);
	width: rem-calc(80);
}
</style>
