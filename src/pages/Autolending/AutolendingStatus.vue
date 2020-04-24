<template>
	<div class="row status-area">
		<div class="column large-8 settings-card">
			<div class="icon-wrapper">
				<kv-icon
					v-show="autolendingStatus == 'on'"
					class="icon"
					title="Auto-lending On"
					name="auto-icon-on"
				/>
				<kv-icon
					v-show="autolendingStatus == 'off'"
					class="icon"
					title="Auto-lending Off"
					name="auto-icon-off"
				/>
				<kv-icon
					v-show="autolendingStatus == 'paused'"
					class="icon"
					title="Auto-lending Paused"
					name="auto-icon-pause"
				/>
			</div>
			<div class="title-wrapper">
				<h3>Auto-lending status</h3>
			</div>
			<div class="content-wrapper">
				Your auto-lending setting is currently
				<a
					data-test="autolending-status"
					role="button"
					@click.prevent="showLightbox = true; triggerWatcher()"
				>
					<span class="uppercase">{{ autolendingStatus }}</span>
					<span v-if="autolendingStatus == 'paused'">until {{ pauseUntilDateFormatted }}</span>
				</a>.

				<kv-lightbox
					class="autolending-status-lightbox"
					:no-padding-bottom="true"
					:no-padding-top="true"
					:visible="showLightbox"
					@lightbox-closed="showLightbox = false"
				>
					<template slot="title">
						<h3>
							Change your auto-lending status
						</h3>
						<hr>
					</template>
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
							<kv-dropdown-rounded v-model="daysToPause" @change="triggerWatcher">
								<option value="30">
									1 Month
								</option>
								<option value="90">
									3 Months
								</option>
								<option value="180">
									6 Months
								</option>
							</kv-dropdown-rounded>
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
					<template slot="controls">
						<hr>
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
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import {
	format, addDays, parseISO, formatISO
} from 'date-fns';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import KvRadio from '@/components/Kv/KvRadio';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default {
	inject: ['apollo'],
	components: {
		KvIcon,
		KvLightbox,
		KvButton,
		KvRadio,
		KvLoadingSpinner,
		KvDropdownRounded
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
		query: gql`{
			autolending @client {
				profileChanged
				currentProfile {
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
			console.log('watch is triggered');
			switch (this.autolendingStatus) {
				case 'paused': {
					const pauseUntilDate = `${formatISO(addDays(new Date(), this.daysToPause))}`;
					this.apollo.mutate({
						mutation: gql`mutation($pauseUntilDate: [String]) {
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
						mutation: gql`mutation {
							autolending @client {
								editProfile(profile: { isEnabled: true, pauseUntil: null })
							}
						}`,
					});
					break;
				}
				case 'off': {
					this.apollo.mutate({
						mutation: gql`mutation {
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

.autolending-status-lightbox {
	::v-deep .kv-lightbox {
		max-width: 520px;
	}

	h3 {
		margin-top: 1.75rem;
		display: inline-block;
		font-weight: $global-weight-bold;
	}

	.status-radio-wrapper {
		padding: 1.5rem 0;
	}

	.button {
		margin-bottom: 1.75rem;
	}

	.dropdown-wrapper {
		display: inline;
	}
}

.uppercase {
	text-transform: uppercase;
}

.kv-radio {
	min-height: 2.7rem;
	line-height: 2.7rem;
}

::v-deep .dropdown {
	margin-bottom: 0;
}
</style>
