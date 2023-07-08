<template>
	<kv-lightbox
		:visible="visible"
		:no-padding-sides="true"
		:no-padding-bottom="true"
		:no-padding-top="true"
		@lightbox-closed="closeLightbox"
		:title="title"
	>
		<template #header>
			<h2 v-if="!zeroUpsellVisible" class="tw-text-h3 tw-flex-1">
				{{ title }}
			</h2>
			<div v-if="zeroUpsellVisible" class="tw-pl-4 tw-flex tw-flex-col tw-items-center">
				<heart-icon class="tw-w-10 tw-h-10 tw-mb-2" />
				<h2 class="tw-text-h4 tw-text-brand">
					Make this moment matter
				</h2>
			</div>
		</template>
		<div v-if="!zeroUpsellVisible" id="nudge-donation-container" data-testid="nudge-donation-container">
			<div id="nudge-donation-top">
				<p>
					<!-- eslint-disable-next-line max-len -->
					Reaching financially excluded people around the world requires things like performing due diligence in over 80 countries, training hundreds of volunteer translators, and maintaining the infrastructure to facilitate over $1B in loans.
				</p>
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
		<div
			v-if="zeroUpsellVisible"
			data-testid="zero-donation-upsell"
			style="max-width: 454px;"
			class="tw-flex tw-flex-col tw-items-center tw-mx-auto"
		>
			<!-- upsell body -->
			<p class="tw-text-h2 tw-mb-3 tw-text-center">
				<!-- eslint-disable-next-line max-len -->
				Every bit counts. Can you spare <em class="tw-text-brand tw-not-italic">$1</em> to cover a portion of the cost of your loan?
			</p>
			<!-- CTAs -->
			<kv-button @click="closeZeroUpsell(1)" class="tw-w-full tw-mb-2">
				Yes, donate $1
			</kv-button>
			<kv-button @click="closeZeroUpsell(0)" variant="secondary" class="tw-w-full">
				No, thank you
			</kv-button>
		</div>
	</kv-lightbox>
</template>

<script>
import DonationNudgeBoxes from '@/components/Checkout/DonationNudge/DonationNudgeBoxes';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';
import { mdiInformation } from '@mdi/js';
import HeartIcon from '@/assets/icons/inline/heart-icon.svg';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'DonationNudgeLightbox',
	data() {
		return {
			mdiInformation,
			zeroUpsellVisible: false,
			title: 'We rely on donations to reach the people who need it the most',
		};
	},
	components: {
		KvButton,
		KvLightbox,
		KvMaterialIcon,
		KvCharityNavigator,
		DonationNudgeBoxes,
		HeartIcon,
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
					percentage: 15,
					appeal: `Cover the cost to facilitate ${this.loanCount > 1 ? 'these loans' : 'this loan'}`,
					appealIsHorizontallyPadded: false,
				},
				{
					percentage: 20,
					appeal: 'Reach more people around the world!',
					appealIsHorizontallyPadded: false,
				},
			];
		},
	},
	methods: {
		setDonationAndClose(amount, source) {
			if (amount === 0 && !this.zeroUpsellVisible) {
				this.zeroUpsellVisible = true;
			} else {
				const clickSource = source ? ` - ${source}` : '';
				this.updateDonationTo(amount);
				this.$kvTrackEvent('basket', 'Update Nudge Donation', `Update Success${clickSource}`, amount * 100);
				this.closeNudgeLightbox();
			}
		},
		expandNudgeLightbox() {
			this.$refs.nudgeBoxes.afterLightboxOpens();
		},
		closeZeroUpsell(amount) {
			this.setDonationAndClose(amount, 'Zero Donation Upsell');
			this.zeroUpsellVisible = false;
		},
		closeLightbox() {
			if (this.zeroUpsellVisible) {
				return this.closeZeroUpsell(0);
			}
			return this.closeNudgeLightbox();
		}
	},
};
</script>
