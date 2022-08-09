<template>
	<kv-lightbox
		:visible="nudgeLightboxVisible"
		:no-padding-sides="true"
		:no-padding-bottom="true"
		:no-padding-top="true"
		@lightbox-closed="closeNudgeLightbox"
		:title="header"
	>
		<div id="nudge-donation-container" data-testid="nudge-donation-container">
			<div id="nudge-donation-top">
				<p>{{ description }}</p>
				<donation-nudge-boxes
					ref="nudgeBoxes"
					id="nudge-donation-top-boxes-wrapper"
					class="tw-mb-3"
					:percentage-rows="percentageRows"
					:has-custom-donation="hasCustomDonation"
					:loan-reservation-total="loanReservationTotal"
					:set-donation-and-close="setDonationAndClose"
					:current-donation-amount="currentDonationAmount"
				/>
				<div class="tw-text-center tw-pb-4">
					<button
						class="tw-text-link"
						id="no-donation-link"
						@click="setDonationAndClose(0, 'No Donation Link')"
						data-testid="nudge-donation-no-donoation-btn"
						tabindex="12"
					>
						No donation to Kiva
					</button>
				</div>
			</div>
			<div
				id="nudge-donation-bottom"
				class="tw-px-12"
				:class="{ 'show-for-large': !experimentalFooter}"
			>
				<div class="row">
					<div class="large-10 large-offset-1 columns">
						<kv-charity-navigator
							v-if="!experimentalFooter"
							title="Kiva has been awarded Charity Navigator's highest rating for operational efficiency."
							:wide-icon="true"
							subtitle="Your donation is eligible for a tax deduction if you live in the U.S."
						/>
						<div v-else class="charity-overhead tw-text-center tw-my-1">
							<h3>
								<kv-material-icon name="info" icon="mdiInformation" class="info-icon" />
								<span>Did you know?</span>
							</h3>
							<p class="tw-text-lg">
								Kiva donations are more efficient than the average charity,
								which uses 37% on overhead. Kiva only asks for a 15% donation to help cover our costs.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import DonationNudgeBoxes from '@/components/Checkout/DonationNudge/DonationNudgeBoxes';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';
import donationNudgeLightboxMixin from '@/components/Checkout/DonationNudge/donationNudgeLightboxMixin';
import { mdiInformation } from '@mdi/js';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'DonationNudgeLightbox',
	data() {
		return {
			mdiInformation,
		};
	},
	components: {
		KvLightbox,
		KvMaterialIcon,
		KvCharityNavigator,
		DonationNudgeBoxes,
	},
	mixins: [
		donationNudgeLightboxMixin,
	],
	props: {
		experimentalFooter: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
