<template>
	<div
		class="tw-py-2.5 tw-px-2 tw-border-b tw-border-tertiary tw-bg-primary data-hj-suppress"
		:class="{ '!tw-bg-gray-50': index % 2 === 1, 'tw-border-t': index === 0 }"
	>
		<KvGrid class="tw-grid-cols-12 tw-gap-2">
			<!-- Recipient / redeemer -->
			<div class="tw-col-span-12 md:tw-col-span-5">
				<!-- Redeemed by a public lender: avatar + profile link -->
				<template v-if="isRedeemed && redeemer">
					<div v-if="redeemer.isPublic" class="tw-flex tw-items-center">
						<a
							:href="lenderUrl"
							class="tw-shrink-0 tw-mr-1.5"
							v-kv-track-event="[
								'portfolio', 'click', 'View Kiva Card redeemer', redeemer.lenderPublicId
							]"
						>
							<KvUserAvatar
								:lender-name="redeemer.name"
								:lender-image-url="redeemer.image?.url || ''"
								class="tw-w-10 tw-h-10"
							/>
						</a>
						<a
							:href="lenderUrl"
							class="tw-text-action tw-font-semibold tw-no-underline"
							v-kv-track-event="[
								'portfolio', 'click', 'View Kiva Card redeemer', redeemer.lenderPublicId
							]"
						>
							{{ redeemer.name }}
						</a>
					</div>
					<!-- Redeemed by a private lender: name only -->
					<div v-else>
						{{ redeemer.name }}
					</div>
				</template>
				<div v-else-if="isRedeemed">
					Redeemer not found
				</div>
				<!-- Not redeemed: intended recipient details -->
				<template v-else>
					<template v-if="isPostalDelivery && mailing">
						<div class="tw-text-secondary">
							Intended for:
						</div>
						<div>
							{{ mailing.firstName }} {{ mailing.lastName }}<br>
							{{ mailing.address }} {{ mailing.address2 }}<br>
							{{ mailing.city }}, {{ mailing.state }} {{ mailing.zip }}
						</div>
					</template>
					<template v-else-if="card.recipientName || card.recipientEmail">
						<div class="tw-text-secondary">
							{{ recipientLabel }}
						</div>
						<div>{{ recipientValue }}</div>
					</template>

					<a
						v-if="showRemind"
						:href="remindUrl"
						class="tw-inline-block tw-mt-1 tw-px-1.5 tw-py-0.5 tw-border tw-border-action
							tw-rounded tw-text-action tw-text-small tw-no-underline"
						v-kv-track-event="['portfolio', 'click', 'Remind Kiva Card recipient', card.id]"
					>
						Remind
					</a>

					<div class="tw-text-secondary tw-mt-1">
						Delivery Method:
					</div>
					<div>{{ deliveryLabel }}</div>
				</template>
			</div>

			<!-- Amount + code -->
			<div class="tw-col-span-12 md:tw-col-span-3">
				<div class="tw-text-secondary">
					Amount:
				</div>
				<div>{{ formattedAmount }}</div>

				<div class="tw-text-secondary tw-mt-1">
					Code:
				</div>
				<div>{{ card.code }}</div>
			</div>

			<!-- Status -->
			<div class="tw-col-span-12 md:tw-col-span-4">
				<div class="tw-text-secondary">
					Purchased on Date:
				</div>
				<div>{{ formatDate(card.createTime) }}</div>

				<template v-if="isRedeemed">
					<div class="tw-text-secondary tw-mt-1">
						Redeemed on Date:
					</div>
					<div>{{ formatDate(card.redeemTime) }}</div>
				</template>
				<template v-else>
					<template v-if="card.notifyRecipient && card.actualDeliveryDate">
						<div class="tw-text-secondary tw-mt-1">
							Delivered on Date:
						</div>
						<div>{{ formatDate(card.actualDeliveryDate) }}</div>
					</template>
					<template v-else-if="card.notifyRecipient && card.scheduledDeliveryDate > 0">
						<div class="tw-text-secondary tw-mt-1">
							Target Delivery Date:
						</div>
						<div>{{ formatDate(card.scheduledDeliveryDate) }}</div>
					</template>

					<template v-if="isExpired">
						<div class="tw-text-secondary tw-mt-1">
							Converted to donation on:
						</div>
						<div>{{ formatDate(card.expiresOn) }}</div>
					</template>
					<template v-else-if="isCancelled">
						<div class="tw-text-secondary tw-mt-1">
							Cancelled on Date:
						</div>
						<div>{{ formatDate(card.cancelTime) }}</div>
					</template>

					<template v-if="isActive && card.expiresOn > 0">
						<div class="tw-text-secondary tw-mt-1">
							Will become a donation on:
						</div>
						<div>{{ formatDate(card.expiresOn) }}</div>
					</template>

					<template v-if="isActive">
						<div class="tw-text-secondary tw-mt-1">
							Status:
						</div>
						<div>Not redeemed</div>
						<a
							:href="printUrl"
							class="tw-no-underline"
							v-kv-track-event="['portfolio', 'click', 'Print Kiva Card', card.id]"
						>(print this Kiva Card)</a>
					</template>
				</template>
			</div>
		</KvGrid>
	</div>
</template>

<script>
import { KvGrid, KvUserAvatar } from '@kiva/kv-components';
import {
	ACTIVE, REDEEMED, EXPIRED, CANCELLED,
} from '#src/api/fixtures/KivaCardStatusEnum';
import { LENDER, POSTAL } from '#src/api/fixtures/KivaCardDeliveryEnum';
import { capitalize } from '#src/util/stringParserUtils';

export default {
	name: 'KivaCardListItem',
	components: {
		KvGrid,
		KvUserAvatar,
	},
	props: {
		card: {
			type: Object,
			required: true,
		},
		index: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		redeemer() {
			return this.card.redeemer;
		},
		mailing() {
			return this.card.mailing;
		},
		deliveryType() {
			return this.card.deliveryType;
		},
		isRedeemed() {
			return this.card.status === REDEEMED;
		},
		isActive() {
			return this.card.status === ACTIVE;
		},
		isExpired() {
			return this.card.status === EXPIRED;
		},
		isCancelled() {
			return this.card.status === CANCELLED;
		},
		isPostalDelivery() {
			return this.deliveryType === POSTAL;
		},
		deliveryLabel() {
			if (!this.deliveryType) return '';
			return capitalize(this.deliveryType);
		},
		formattedAmount() {
			return this.$filters.numeral(this.card.amount, '$0,0.00');
		},
		lenderUrl() {
			return this.redeemer?.lenderPublicId ? `/lender/${this.redeemer.lenderPublicId}` : null;
		},
		recipientLabel() {
			// Label reflects the recipient state: not-yet-notified vs sent vs pending delivery.
			if (!this.card.notifyRecipient) {
				return 'Intended for:';
			}
			return this.card.actualDeliveryDate ? 'Sent to:' : 'Will be sent to:';
		},
		recipientValue() {
			// When the recipient isn't notified, "Intended for:" always shows the recipient name,
			// regardless of delivery type. Only the notified (Sent to / Will be sent to) states use
			// the lender name or the "name at <email>" format.
			if (!this.card.notifyRecipient) {
				return this.card.recipientName;
			}
			if (this.deliveryType === LENDER) {
				return this.card.recipientLender;
			}
			if (this.card.recipientEmail) {
				return `${this.card.recipientName || ''} at <${this.card.recipientEmail}>`.trim();
			}
			return this.card.recipientName;
		},
		showRemind() {
			// Remind only for delivered, non-expired cards with a recipient email.
			return Boolean(this.card.recipientEmail) && !this.isExpired && Boolean(this.card.actualDeliveryDate);
		},
		remindUrl() {
			return `/gifts/kiva-cards/remind?id=${this.card.id}`;
		},
		printUrl() {
			// The print endpoint expects the raw (undashed) code.
			const rawCode = (this.card.code || '').replace(/-/g, '');
			return `/gifts/kiva-cards/print?giftCode=${rawCode}`;
		},
	},
	methods: {
		formatDate(timestamp) {
			if (!timestamp) return '';
			return new Date(timestamp * 1000).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		},
	},
};
</script>
