<template>
	<div class="basket-item-wrapper tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
		<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
			<div class="kiva-card-icon" data-testid="basket-kiva-card-image-container">
				<!-- Print Kiva Card -->
				<img
					v-if="cardType == 'print'"
					alt="print-kiva-card"
					class="card-preview tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
					src="~@/assets/images/checkout/kiva_card_print_preview.jpg"
				>
				<!-- Postal Kiva Card -->
				<img
					v-if="cardType == 'postal'"
					alt="postal-kiva-card"
					class="card-preview tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
					src="~@/assets/images/checkout/kiva_card_postal_preview.jpg"
				>
				<!-- Email or Lender Kiva Card -->
				<img
					v-if="cardType === 'email' || cardType === 'lender'"
					alt="email-kiva-card"
					class="card-preview tw-w-12 lg:tw-w-13 tw-h-12 lg:tw-h-13 tw-rounded"
					src="~@/assets/images/checkout/kiva_card_email_preview.jpg"
				>
			</div>
		</div>
		<div class="tw-flex-auto kiva-card-info-wrapper">
			<!-- Main line text -->
			<div class="kiva-card-info">
				<div class="tw-flex tw-mb-0.5">
					<!-- Print Kiva Card -->
					<h2 class="tw-text-h3" v-if="cardType == 'print'" data-testid="basket-kiva-card-title">
						Print-it-yourself Kiva Card
						<span v-if="quantity > 1">({{ quantity }})</span>
					</h2>
					<!-- Postal Kiva Card -->
					<h2 class="tw-text-h3" v-if="cardType == 'postal'" data-testid="basket-kiva-card-title">
						Postal delivery Kiva Card
						<span v-if="quantity > 1">({{ quantity }})</span>
					</h2>
					<!-- Email or Lender Kiva Card -->
					<h2
						class="tw-text-h3"
						v-if="cardType === 'email' || cardType === 'lender'"
						data-testid="basket-kiva-card-title"
					>
						Email delivery Kiva Card
					</h2>

					<a
						class="tw-flex-none tw-mr-auto tw-ml-1"
						data-testid="basket-kiva-card-edit-button"
						style="margin-top: 0.25rem;"
						:href="formedEditUrl"
						v-kv-track-event="['basket', 'Edit Kiva Card', cardType]"
					>
						<kv-material-icon
							class="tw-w-2 tw-h-2"
							:icon="mdiPencil"
						/>
					</a>

					<remove-basket-item
						class="md:tw-hidden tw-flex-none tw-ml-1 tw-mt-0.5 tw-h-1.5"
						:ids-in-group="kivaCard.idsInGroup"
						type="kivaCard"
						@refreshtotals="onLoanUpdate($event)"
						@updating-totals="$emit('updating-totals', $event)"
					/>
				</div>

				<div class="tw-text-secondary">
					<!-- Print Kiva Card -->
					<div v-if="cardType == 'print'">
						<p class="tw-text-small tw-mb-1" data-testid="basket-kiva-card-info-1">
							Available after checkout
						</p>
						<p class="tw-text-small tw-mb-1" v-if="recipientName" data-testid="basket-kiva-card-info-2">
							For {{ recipientName }}
						</p>
					</div>
					<!-- Postal Kiva Card -->
					<div v-if="cardType == 'postal'">
						<p class="tw-text-small tw-mb-1" data-testid="basket-kiva-card-info-1">
							{{ mailingFirstName }}
							{{ mailingLastName }}
							{{ mailingStreet }}
							{{ mailingCity }},
							{{ mailingState }}
							{{ mailingZip }}
						</p>
					</div>
					<!-- Email or Lender Kiva Card -->
					<div v-if="cardType === 'email' || cardType === 'lender'">
						<p class="tw-text-small tw-mb-1" data-testid="basket-kiva-card-info-1">
							Scheduled to be sent  {{ deliveryDate }}
						</p>
						<p class="tw-text-small tw-mb-1" data-testid="basket-kiva-card-info-2">
							For {{ recipientName }} {{ recipientEmail }}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div
			class="
			tw-flex-none
			tw-w-full
			md:tw-w-auto
			md:tw-ml-3
			lg:tw-ml-4.5
			tw-mt-1.5
			md:tw-mt-0
			price-wrapper"
		>
			<!-- Kiva card amount dropdown section -->
			<loan-price
				data-testid="basket-kiva-card-price-selector"
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
import { mdiPencil } from '@mdi/js';
import LoanPrice from '@/components/Checkout/LoanPrice';
import RemoveBasketItem from '@/components/Checkout/RemoveBasketItem';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'KivaCardItem',
	components: {
		KvMaterialIcon,
		LoanPrice,
		RemoveBasketItem,
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
			mdiPencil,
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
