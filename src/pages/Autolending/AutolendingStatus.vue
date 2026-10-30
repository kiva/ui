<template>
	<kv-settings-card title="Auto-lending status">
		<template #content>
			<p>
				Your auto-lending setting is currently
				<button
					class="tw-text-link tw-font-medium"
					@click="showLightbox = true"
					data-test="autolending-status"
				>
					<!-- eslint-disable-next-line max-len -->
					<span class="tw-uppercase">{{ autolendingStatus }}</span> <span v-if="autolendingStatus == 'paused'">until {{ pauseUntilDateFormatted }}</span>
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
						PAUSED
						<kv-select
							v-model="daysToPause"
							@change="triggerWatcher"
							id="days-to-pause-select"
							class="tw-mb-0"
						>
							<option v-if="savedPauseUntil" value="saved">
								until {{ formatPauseDate(savedPauseUntil) }}
							</option>
							<option :value="30">
								for 1 month
							</option>
							<option :value="90">
								for 3 months
							</option>
							<option :value="180">
								for 6 months
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
						@click="save"
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
import { gql } from 'graphql-tag';
import {
	format, addDays, parseISO, formatISO
} from 'date-fns';

import KvButton from '#src/components/Kv/KvButton';
import KvSelect from '#src/components/Kv/KvSelect';
import KvLoadingSpinner from '#src/components/Kv/KvLoadingSpinner';
import KvRadio from '#src/components/Kv/KvRadio';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import { KvLightbox } from '@kiva/kv-components';

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
			savedPauseUntil: null,
			daysToPause: 30,
			autolendingStatus: 'off'
		};
	},
	apollo: {
		query: gql`query autolendProfileStatus {
			autolending @client {
				id
				profileChanged
				currentProfile {
					id
					isEnabled
					pauseUntil
				}
				savedProfile {
					id
					pauseUntil
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.pauseUntil = _get(data, 'autolending.currentProfile.pauseUntil');
			this.savedPauseUntil = _get(data, 'autolending.savedProfile.pauseUntil') ?? null;
			this.isChanged = !!_get(data, 'autolending.profileChanged');

			if (this.savedPauseUntil && this.pauseUntil === this.savedPauseUntil) {
				this.daysToPause = 'saved';
			} else if (!this.savedPauseUntil && this.daysToPause === 'saved') {
				this.daysToPause = 30;
			}

			this.autolendingStatus = this.setAutolendingStatus({
				isEnabled: this.isEnabled,
				pauseUntil: this.pauseUntil
			});
		},
	},
	computed: {
		pauseUntilDateFormatted() {
			return this.formatPauseDate(this.pauseUntil);
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
					const pauseUntilDate = this.daysToPause === 'saved'
						? this.savedPauseUntil
						: formatISO(addDays(new Date(), this.daysToPause));
					this.apollo.mutate({
						mutation: gql`mutation pauseAutolending($pauseUntilDate: Date) {
							autolending @client {
								id
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
								id
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
								id
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
		// Changing only the pause duration leaves the status unchanged, so the watcher won't fire on its own
		triggerWatcher() {
			// Wait one tick to allow model to update before firing watcher.
			this.$nextTick(() => {
				if (this.autolendingStatus === 'paused') {
					this.watchAutolendingStatus();
				}
			});
		},
		formatPauseDate(date) {
			return date ? format(parseISO(date), 'MM/dd/yyyy') : '';
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
@use '#src/assets/scss/settings' as *;

.autolending-status-lightbox {
	.status-radio-wrapper {
		padding: 1.5rem 0;
	}

	.dropdown-wrapper {
		display: inline;
	}
}
</style>
