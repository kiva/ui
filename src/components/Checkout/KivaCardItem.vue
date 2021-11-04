<template>
	<div class="basket-item-wrapper row">
		<div class="hide-for-small-only medium-3 large-2 columns">
			<div class="kiva-card-icon">
				<!-- Print Kiva Card -->
				<img
					v-if="cardType == 'print'"
					alt="print-kiva-card"
					class="card-preview"
					src="~@/assets/images/checkout/kiva_card_print_preview.jpg"
				>
				<!-- Postal Kiva Card -->
				<img
					v-if="cardType == 'postal'"
					alt="postal-kiva-card"
					class="card-preview"
					src="~@/assets/images/checkout/kiva_card_postal_preview.jpg"
				>
				<!-- Email Kiva Card -->
				<img
					v-if="cardType == 'email'"
					alt="email-kiva-card"
					class="card-preview"
					src="~@/assets/images/checkout/kiva_card_email_preview.jpg"
				>
			</div>
		</div>
		<div class="small-12 medium-5 large-7 columns kiva-card-info-wrapper">
			<!-- Main line text -->
			<div class="kiva-card-info">
				<!-- Print Kiva Card -->
				<h2 class="tw-text-h3 tw-inline-block" v-if="cardType == 'print'">
					Print-it-yourself Kiva Card
					<span v-if="quantity > 1">({{ quantity }})</span>
				</h2>
				<!-- Postal Kiva Card -->
				<h2 class="tw-text-h3 tw-inline-block" v-if="cardType == 'postal'">
					Postal delivery Kiva Card
					<span v-if="quantity > 1">({{ quantity }})</span>
				</h2>
				<!-- Email Kiva Card -->
				<h2 class="tw-text-h3 tw-inline-block" v-if="cardType == 'email'">
					Email delivery Kiva Card
				</h2>

				<a class="tw-inline-block" :href="formedEditUrl"
					v-kv-track-event="['basket', 'Edit Kiva Card', cardType]"
				>
					<kv-icon
						class="edit-pencil-icon"
						name="pencil"
					/>
				</a>
				<div class="sub-text-container tw-text-secondary">
					<!-- Print Kiva Card -->
					<div v-if="cardType == 'print'">
						<p class="tw-text-small">
							Available after checkout
						</p>
						<p class="tw-text-small" v-if="recipientName">
							For {{ recipientName }}
						</p>
					</div>
					<!-- Postal Kiva Card -->
					<div v-if="cardType == 'postal'">
						<p class="tw-text-small">
							{{ mailingFirstName }}
							{{ mailingLastName }}
							{{ mailingStreet }}
							{{ mailingCity }},
							{{ mailingState }}
							{{ mailingZip }}
						</p>
					</div>
					<!-- Email Kiva Card -->
					<div v-if="cardType == 'email'">
						<p class="tw-text-small">
							Scheduled to be sent  {{ deliveryDate }}
						</p>
						<p class="tw-text-small">
							For {{ recipientName }} {{ recipientEmail }}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="small-12 medium-4 large-3 columns price-wrapper medium-text-font-size">
			<!-- Kiva card amount dropdown section -->
			<loan-price
				:ids-in-group="kivaCard.idsInGroup"
				:price="kivaCard.individualPrice"
				type="kivaCard"
				@refreshtotals="onLoanUpdate($event)"
				@updating-totals="$emit('updating-totals', $event)"
			/>
		</div>
	</div>
</template>

<script>
import { format, parseISO } from 'date-fns';
import KvIcon from '@/components/Kv/KvIcon';
import LoanPrice from '@/components/Checkout/LoanPrice';

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
			return format(parseISO(this.kivaCard.kivaCardObject.recipient.scheduledDeliveryDate), 'MM/dd/yyyy');
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

.sub-text-container div.tw-text-small {
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
