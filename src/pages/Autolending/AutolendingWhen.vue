<template>
	<div class="row when-area" :class="{ obscure: !isEnabled }">
		<div class="column large-8 settings-card">
			<div class="icon-wrapper">
				<kv-icon
					class="icon"
					title="When your balance will be lent"
					name="auto-icon-when"
				/>
			</div>
			<div class="title-wrapper">
				<h3>When your balance will be lent</h3>
			</div>
			<div class="content-wrapper">
				Your balance will be automatically lent
				<span v-if="lendAfterDaysIdle === 0"><a
					role="button"
					@click.prevent="showLightbox = true;"
				>as soon as possible</a>
				</span><span v-if="lendAfterDaysIdle !== 0">
					if you haven’t made a loan
					<a
						role="button"
						@click.prevent="showLightbox = true;"
					>after {{ lendAfterDaysIdle }} days</a>
				</span>, and will include a <a
					role="button"
					@click.prevent="showLightbox = true;"
				>{{ donation }}% donation</a> to Kiva.

				<kv-lightbox
					class="autolending-when-lightbox"
					:visible="showLightbox"
					title="Choose when your balance will be auto-lent"
					@lightbox-closed="showLightbox = false"
				>
					<div class="when-inputs-wrapper">
						<lend-timing-dropdown />
						<kv-radio
							data-test="is-autolending-donation-on"
							id="is-autolending-donation-on"
							radio-value="on"
							v-model="donationToggle"
						>
							Include a donation to Kiva of
							<kv-dropdown-rounded v-model="donation">
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
							</kv-dropdown-rounded>
						</kv-radio>
						<kv-radio
							data-test="is-autolending-donation-off"
							id="is-autolending-donation-off"
							radio-value="off"
							v-model="donationToggle"
						>
							No donation to Kiva
						</kv-radio>
					</div>
					<template slot="controls">
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
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import _isFinite from 'lodash/isFinite';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import KvRadio from '@/components/Kv/KvRadio';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

import LendTimingDropdown from './LendTimingDropdown';
import LendTimingMessaging from './LendTimingMessaging';


export default {
	inject: ['apollo'],
	components: {
		KvIcon,
		KvLightbox,
		KvButton,
		KvRadio,
		KvLoadingSpinner,
		KvDropdownRounded,
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
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				profileChanged
				currentProfile {
					isEnabled
					donationPercentage
					lendAfterDaysIdle
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			const donationPercentage = _get(data, 'autolending.currentProfile.donationPercentage');
			this.lendAfterDaysIdle = _get(data, 'autolending.currentProfile.lendAfterDaysIdle');
			this.isChanged = !!_get(data, 'autolending.profileChanged');
			this.donation = _isFinite(donationPercentage) ? donationPercentage : 15;
			this.donationToggle = this.donation !== 0 ? 'on' : 'off';
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
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { donationPercentage: ${donation} })
						}
					}`,
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
				mutation: gql`mutation {
					autolending @client {
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
