<template>
	<kv-lightbox
		:visible="visible"
		:no-padding-sides="true"
		:no-padding-bottom="true"
		:no-padding-top="true"
		@lightbox-closed="closeNudgeLightbox"
		:title="title"
	>
		<template #header>
			<h2 class="tw-flex-1">
				{{ title }}
			</h2>
		</template>
		<div id="nudge-donation-container" data-testid="nudge-donation-container">
			<div id="nudge-donation-top">
				<how-kiva-uses-donation />
				<donation-nudge-boxes
					ref="nudgeBoxes"
					id="nudge-donation-top-boxes-wrapper"
					class="tw-mb-3"
					:percentage-rows="percentageRows"
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
				<!-- eslint-disable max-len -->
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
								Kiva donations are more efficient than the average charity, which uses 37% on overhead. Kiva only asks for a 15% donation to help cover our costs.
							</p>
						</div>
					</div>
				</div>
				<!-- eslint-enable max-len -->
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import DonationNudgeBoxes from '#src/components/Checkout/DonationNudge/DonationNudgeBoxes';
import KvCharityNavigator from '#src/components/Kv/KvCharityNavigator';
import { mdiInformation } from '@mdi/js';
import HowKivaUsesDonation from '#src/components/Checkout/HowKivaUsesDonation';
import { gql } from 'graphql-tag';
import { readBoolSetting } from '#src/util/settingsUtils';
import KvLightbox from '#kv-components/KvLightbox';
import KvMaterialIcon from '#kv-components/KvMaterialIcon';

export default {
	name: 'DonationNudgeLightbox',
	data() {
		return {
			mdiInformation,
			title: 'Loans change lives. Your donations make them possible.',
			seasonalTipRateEnabled: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: gql`query seasonalTipRateIncrease {
				general {
					seasonalTipRateEnabled: featureSetting(key: "seasonal_tip_rate.enabled") {
						key
						value
					}
				}
			}
		`,
		preFetch: true,
		result({ data }) {
			this.seasonalTipRateEnabled = readBoolSetting(data, 'general.seasonalTipRateEnabled.value');
		}
	},
	components: {
		KvLightbox,
		KvMaterialIcon,
		KvCharityNavigator,
		DonationNudgeBoxes,
		HowKivaUsesDonation,
	},
	props: {
		experimentalFooter: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			required: true,
		},
		closeNudgeLightbox: {
			type: Function,
			required: true,
		},
		updateDonationTo: {
			type: Function,
			required: true,
		},
		loanCount: {
			type: Number,
			default: 0
		},
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		currentDonationAmount: {
			type: String,
			default: ''
		},
	},
	computed: {
		percentageRows() {
			return [
				{
					percentage: this.seasonalTipRateEnabled ? 18 : 15,
					appeal: `Cover the cost to facilitate ${this.loanCount > 1 ? 'these loans' : 'this loan'}`,
					appealIsHorizontallyPadded: false,
				},
				{
					percentage: this.seasonalTipRateEnabled ? 24 : 20,
					appeal: 'Reach more people around the world!',
					appealIsHorizontallyPadded: false,
				},
			];
		},
	},
	methods: {
		setDonationAndClose(amount, source) {
			if (amount > 0) {
				const clickSource = source ? ` - ${source}` : '';
				this.$kvTrackEvent('basket', 'Update Nudge Donation', `Update Success${clickSource}`, amount * 100);
			} else {
				this.$kvTrackEvent('basket', 'click', `Update Nudge Donation - ${source}`, amount * 100);
			}
			this.updateDonationTo(amount);
			this.closeNudgeLightbox();
		},
		expandNudgeLightbox() {
			this.$refs.nudgeBoxes.afterLightboxOpens();
		},
	},
};
</script>
