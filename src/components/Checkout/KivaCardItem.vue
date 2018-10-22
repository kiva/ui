<template>
	<div class="basket-donation-item row">
		<span class="small-3 medium-2 large-1">
			<!-- IMAGE -->
			<span class="donation-icon">
				<!-- This will have if condions for images based on kiva card type -->
				<!-- <kv-icon class="dedicate-heart" name="dedicate-heart" /> -->
			</span>
		</span>
		<span class="small-9 medium-7 large-9 donation-info-wrapper">
			<!-- Main line text -->
			<span class="kiva-card-info featured-text">
				<!-- Postal Kiva Card -->
				<span v-if="postal">Print-it-yourself </span>
				<!-- Print Kiva Card -->
				<span v-if="print">Postal delivery </span>
				<!-- Donation to Kiva -->
				<!-- Email Kiva Card -->
				<span v-if="email">Email delivery </span>
				<span>Kiva Card</span>
				<kv-icon
					class="edit-pencil-icon"
					name="pencil"/>
			</span>
		</span>
		<span class="small-3 show-for-small-only"></span>
		<span class="small-9 medium-3 large-2 medium-text-font-size">
			<!-- Kiva card amount dropdown section -->
			<div
				v-if="!editDonation"
				class="donation-amount-wrapper">
				<span
					v-if="!editDonation"
					class="donation-amount"
					v-kv-track-event="['basket', 'Edit Donation']"
					@click.prevent="editDonation = true">{{ formattedAmount }}
				</span>
			</div>
			<div v-else class="small-12 donation-amount-input-wrapper">
				<input
					type="input"
					class="donation-amount-input"
					name="donation"
					id="donation"
					v-model="amount"
					@blur="validateInput"
					@keyup.enter.prevent="updateDonation()">
				<kv-button
					class="secondary"
					@click.native.prevent.stop="updateDonation()"
				>Update</kv-button>
				<div
					class="show-for-medium remove-wrapper"
					@click="updateLoanAmount('remove')">
					<kv-icon class="remove-x" name="small-x" />
				</div>
			</div>
		</span>
	</div>

</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	props: {
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

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

</style>
