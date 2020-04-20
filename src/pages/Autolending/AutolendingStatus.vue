<template>
	<div class="row status-area">
		<div class="column large-8 settings-card">
			<div class="icon-wrapper">
				<kv-icon
					v-show="isEnabled"
					class="icon"
					title="Auto-lending On"
					name="auto-icon-on"
				/>
				<kv-icon
					v-show="!isEnabled"
					class="icon"
					title="Auto-lending Off"
					name="auto-icon-off"
				/>
			</div>
			<div class="title-wrapper">
				<h3>Auto-lending status</h3>
			</div>
			<div class="content-wrapper">
				Your auto-lending setting is currently

				<a
					data-test="autolending-status"
					class="uppercase"
					role="button"
					@click.prevent="showLightbox = true"
				>{{ userFriendlyStatus }}</a>.

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
						<div class="is-enabled-radios">
							<kv-radio
								id="is-enabled-true"
								data-test="is-enabled-true"
								radio-value="true"
								v-model="isEnabled"
							>
								ON
							</kv-radio>
							<kv-radio
								id="is-enabled-false"
								data-test="is-enabled-false"
								radio-value="false"
								v-model="isEnabled"
							>
								OFF
							</kv-radio>
						</div>
					</div>
					<template slot="controls">
						<hr>
						<kv-button
							data-test="status-save-button" class="smaller button" v-if="!isSaving" @click.native="save"
						>
							Save
						</kv-button>
						<kv-button data-test="status-save-button" class="smaller button" v-else>
							Saving <kv-loading-spinner />
						</kv-button>
					</template>
				</kv-lightbox>
				<!-- TODO remove this slot when content has been incorporated into new design -->
				<slot name="tempContentWrapper">
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import KvRadio from '@/components/Kv/KvRadio';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	inject: ['apollo'],
	components: {
		KvIcon,
		KvLightbox,
		KvButton,
		KvRadio,
		KvLoadingSpinner
	},
	data() {
		return {
			isSaving: false,
			isEnabled: false,
			showLightbox: false,
			isChanged: false,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					isEnabled
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.isChanged = !!_get(data, 'autolending.profileChanged');
		},
	},
	watch: {
		isEnabled(enabled, previouslyEnabled) {
			if (enabled !== previouslyEnabled) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { isEnabled: ${enabled} })
						}
					}`,
				});
			}
		}
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
	computed: {
		userFriendlyStatus() {
			if (this.isEnabled) {
				return 'on';
			}
			return 'off';
		}
	}

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

	::v-deep .button {
		margin-bottom: 1.75rem;
	}
}

.status-area {
	.loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;

		& >>> .line {
			background-color: $white;
		}
	}

	.settings-card {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		gap: 1rem 1rem;
		grid-template-areas: "icon-wrapper title-wrapper" "icon-wrapper content-wrapper";
	}

	.icon-wrapper {
		grid-area: icon-wrapper;

		.icon {
			margin-top: 1px;
			height: 1.75rem;
			width: 1.75rem;
		}
	}

	.title-wrapper {
		grid-area: title-wrapper;

		h3 {
			font-weight: $global-weight-bold;
		}
	}

	.content-wrapper { grid-area: content-wrapper; }

	.uppercase {
		text-transform: uppercase;
	}

	.is-enabled-radios {
		max-width: 15rem;
	}
}
</style>
