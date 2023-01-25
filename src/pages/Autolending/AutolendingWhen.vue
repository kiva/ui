<template>
	<kv-settings-card title="When your balance will be lent" :disabled="!isEnabled">
		<template #content>
			<p>
				Your balance will be automatically lent
				<span v-if="lendAfterDaysIdle === 0">
					<button
						class="tw-text-link tw-font-medium"
						@click="showLightbox = true;"
					>as soon as possible</button>
				</span><span v-if="lendAfterDaysIdle !== 0">
					if you haven’t made a loan <button
						class="tw-text-link tw-font-medium"
						@click="showLightbox = true;"
					>after {{ lendAfterDaysIdle }} days</button>
				</span><span>, and will include a <button
					class="tw-text-link tw-font-medium"
					@click="showLightbox = true;"
				>{{ donation }}% donation</button> to Kiva.</span>
			</p>
			<kv-lightbox
				class="autolending-when-lightbox"
				:visible="showLightbox"
				title="Choose when your balance will be auto-lent"
				@lightbox-closed="showLightbox = false"
			>
				<div class="when-inputs-wrapper">
					<lend-timing-dropdown />
					<!--
							While lenders with an auto-deposit donation should not have an auto-lending donation after
							the fixes for AUTO-44 and AUTO-206, the check below includes donation===0
							for graceful degradation, so that users with both donations still see the actual value.
						-->
					<p v-if="hasAutoDepositDonation && donation === 0">
						Your auto-deposit includes a donation, so auto-lending donations are disabled.
					</p>
					<div v-else>
						<kv-radio
							data-test="is-autolending-donation-on"
							id="is-autolending-donation-on"
							radio-value="on"
							v-model="donationToggle"
						>
							Include a donation to Kiva of
							<kv-select v-model="donation">
								<option :value="0">
									0%
								</option>
								<option :value="5">
									5%
								</option>
								<option :value="10">
									10%
								</option>
								<option :value="15">
									15%
								</option>
								<option :value="20">
									20%
								</option>
							</kv-select>
						</kv-radio>
						<kv-radio
							data-test="is-autolending-donation-off"
							id="is-autolending-donation-off"
							radio-value="off"
							v-model="donationToggle"
						>
							No donation to Kiva.
						</kv-radio>
					</div>
				</div>
				<template #controls>
					<kv-button
						data-test="when-save-button"
						class="smaller button"
						v-if="!isSaving"
						@click.native="save"
						:disabled="!isChanged"
					>
						Save
					</kv-button>
					<kv-button data-test="when-save-button" class="smaller button" v-else>
						Saving <kv-loading-spinner />
					</kv-button>
				</template>
			</kv-lightbox>

			<lend-timing-messaging />
		</template>
	</kv-settings-card>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import _isFinite from 'lodash/isFinite';

import KvButton from '@/components/Kv/KvButton';
import KvSelect from '@/components/Kv/KvSelect';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvRadio from '@/components/Kv/KvRadio';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';

import LendTimingDropdown from './LendTimingDropdown';
import LendTimingMessaging from './LendTimingMessaging';

export default {
	name: 'AutolendingWhen',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvSelect,
		KvLightbox,
		KvLoadingSpinner,
		KvRadio,
		KvSettingsCard,
		LendTimingDropdown,
		LendTimingMessaging,
	},
	data() {
		return {
			isSaving: false,
			isEnabled: false,
			showLightbox: false,
			isChanged: false,
			lendAfterDaysIdle: 0,
			donation: 15,
			donationToggle: 'on',
			hasAutoDepositDonation: false,
		};
	},
	apollo: {
		query: gql`query autolendProfileWhen {
			autolending @client {
				id
				profileChanged
				currentProfile {
					id
					isEnabled
					donationPercentage
					lendAfterDaysIdle
				}
			}
			my {
				autoDeposit {
					id
					donateAmount
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.lendAfterDaysIdle = _get(data, 'autolending.currentProfile.lendAfterDaysIdle');
			this.isChanged = !!_get(data, 'autolending.profileChanged');
			const donationPercentage = _get(data, 'autolending.currentProfile.donationPercentage');
			this.donation = _isFinite(donationPercentage) ? donationPercentage : 15;
			this.donationToggle = this.donation !== 0 ? 'on' : 'off';
			this.hasAutoDepositDonation = _get(data, 'my.autoDeposit.donateAmount') > 0;
		},
	},
	mounted() {
		// After initial value is loaded, setup watch
		this.$watch('donation', (donation, previousDonation) => {
			if (donation !== previousDonation) {
				if (donation === 0) {
					this.donationToggle = 'off';
				}
				this.apollo.mutate({
					mutation: gql`mutation editDonation($donation: Int) {
						autolending @client {
							id
							editProfile(profile: { donationPercentage: $donation })
						}
					}`,
					variables: {
						donation,
					},
				});
			}
		});
		// After initial value is loaded, setup watch
		// Set donation accordingly when flipping donationToggle
		this.$watch('donationToggle', (donationToggle, previousDonationToggle) => {
			if (donationToggle !== previousDonationToggle) {
				if (donationToggle === 'on' && this.donation === 0) {
					// set default donation if 0
					this.donation = 15;
				} else if (donationToggle === 'off') {
					// set to 0 when toggleing to off
					this.donation = 0;
				}
			}
		});
	},
	methods: {
		save() {
			this.isSaving = true;
			this.apollo.mutate({
				mutation: gql`mutation saveProfile {
					autolending @client {
						id
						saveProfile
					}
				}`
			}).then(() => {
				this.$showTipMsg('Settings saved!');
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem saving your settings', 'error');
			}).finally(() => {
				this.isSaving = false;
				this.showLightbox = false;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.autolending-when-lightbox {
	.when-inputs-wrapper {
		padding: 1.5rem 0;
	}

	.dropdown-wrapper {
		display: inline;
	}
}

.kv-radio {
	min-height: 2.7rem;
	line-height: 2.7rem;
}

::v-deep .dropdown {
	margin-bottom: 0;
}
</style>
