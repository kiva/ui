<template>
	<kv-settings-card title="Auto-lending status">
		<template #content>
			<p>
				Your auto-lending setting is currently
				<button
					class="tw-text-link tw-font-medium"
					@click="showLightbox = true; triggerWatcher()"
					data-test="autolending-status"
				>
					<span class="tw-uppercase">{{ autolendingStatus }}</span>
					<span v-if="autolendingStatus == 'paused'">until {{ pauseUntilDateFormatted }}</span>
				</button>.
			</p>

			<kv-lightbox
				class="autolending-status-lightbox"
				:visible="showLightbox"
				title="Change your auto-lending status"
				@lightbox-closed="showLightbox = false"
			>
				<div class="status-radio-wrapper">
					<kv-radio
						data-test="is-autolending-on"
						id="is-autolending-on"
						radio-value="on"
						v-model="autolendingStatus"
					>
						ON
					</kv-radio>
					<kv-radio
						data-test="is-autolending-paused"
						id="is-autolending-paused"
						radio-value="paused"
						v-model="autolendingStatus"
					>
						PAUSED for
						<kv-select
							v-model="daysToPause"
							@change="triggerWatcher"
							id="days-to-pause-select"
							class="tw-mb-0"
						>
							<option value="30">
								1 Month
							</option>
							<option value="90">
								3 Months
							</option>
							<option value="180">
								6 Months
							</option>
						</kv-select>
					</kv-radio>
					<kv-radio
						data-test="is-autolending-off"
						id="is-autolending-off"
						radio-value="off"
						v-model="autolendingStatus"
					>
						OFF
					</kv-radio>
				</div>
				<template #controls>
					<kv-button
						data-test="status-save-button"
						class="smaller button"
						v-if="!isSaving"
						@click.native="save"
						:disabled="!isChanged"
					>
						Save
					</kv-button>
					<kv-button data-test="status-save-button" class="smaller button" v-else>
						Saving <kv-loading-spinner />
					</kv-button>
				</template>
			</kv-lightbox>
		</template>
	</kv-settings-card>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import {
	format, addDays, parseISO, formatISO
} from 'date-fns';

import KvButton from '@/components/Kv/KvButton';
import KvSelect from '@/components/Kv/KvSelect';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvRadio from '@/components/Kv/KvRadio';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';

export default {
	name: 'AutolendingStatus',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvLightbox,
		KvButton,
		KvRadio,
		KvLoadingSpinner,
		KvSelect,
		KvSettingsCard
	},
	data() {
		return {
			isSaving: false,
			isEnabled: false,
			showLightbox: false,
			isChanged: false,
			pauseUntil: null,
			daysToPause: 30,
			autolendingStatus: 'off'
		};
	},
	apollo: {
		query: gql`query autolendProfileStatus {
			autolending @client {
				profileChanged
				currentProfile {
					id
					isEnabled
					pauseUntil
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.pauseUntil = _get(data, 'autolending.currentProfile.pauseUntil');
			this.isChanged = !!_get(data, 'autolending.profileChanged');

			this.autolendingStatus = this.setAutolendingStatus({
				isEnabled: this.isEnabled,
				pauseUntil: this.pauseUntil
			});
		},
	},
	computed: {
		pauseUntilDateFormatted() {
			if (this.pauseUntil) {
				return format(parseISO(this.pauseUntil), 'MM/dd/yyyy');
			}
			return '';
		}
	},
	mounted() {
		// After initial value is loaded, setup watch
		this.$watch('autolendingStatus', this.watchAutolendingStatus);
	},
	methods: {
		watchAutolendingStatus() {
			switch (this.autolendingStatus) {
				case 'paused': {
					const pauseUntilDate = `${formatISO(addDays(new Date(), this.daysToPause))}`;
					this.apollo.mutate({
						mutation: gql`mutation pauseAutolending($pauseUntilDate: Date) {
							autolending @client {
								editProfile(profile: {
									isEnabled: true,
									pauseUntil: $pauseUntilDate
								})
							}
						}`,
						variables: {
							pauseUntilDate,
						}
					});
					break;
				}
				case 'on': {
					this.apollo.mutate({
						mutation: gql`mutation enableAutolending {
							autolending @client {
								editProfile(profile: { isEnabled: true, pauseUntil: null })
							}
						}`,
					});
					break;
				}
				case 'off': {
					this.apollo.mutate({
						mutation: gql`mutation disableAutolending {
							autolending @client {
								editProfile(profile: { isEnabled: false, pauseUntil: null })
							}
						}`,
					});
					break;
				}

				default:
					break;
			}
		},
		// If value is paused, manually trigger watch function.
		// This allows a paused user to see the save button when modal opens up
		// allowing them to change their pause duration without changing status
		triggerWatcher() {
			// Wait one tick to allow model to update before firing watcher.
			this.$nextTick(() => {
				if (this.autolendingStatus === 'paused') {
					this.watchAutolendingStatus();
				}
			});
		},
		setAutolendingStatus({ isEnabled, pauseUntil }) {
			if (pauseUntil) {
				return 'paused';
			}
			if (isEnabled) {
				return 'on';
			}
			return 'off';
		},
		save() {
			this.isSaving = true;
			this.apollo.mutate({
				mutation: gql`mutation saveAutolendProfile {
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

.autolending-status-lightbox {
	.status-radio-wrapper {
		padding: 1.5rem 0;
	}

	.dropdown-wrapper {
		display: inline;
	}
}
</style>
