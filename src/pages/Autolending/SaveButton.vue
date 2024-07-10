<template>
	<div class="save-button-wrapper">
		<kv-button
			data-test="save-button"
			class="smaller"
			v-if="!saving"
			@click.native="checkSave"
			:disabled="!isChanged"
		>
			Save
		</kv-button>
		<kv-button data-test="save-button" class="smaller" v-else>
			Saving <kv-loading-spinner />
		</kv-button>
		<kv-lightbox
			:visible="warningVisible"
			@lightbox-closed="closeWarning"
			title="Criteria too narrow"
			class="lightbox"
		>
			<p class="tw-mb-4 tw-text-subhead">
				There {{ beVerb }} {{ loansLeft }} that {{ matchVerb }} your criteria -
				we may not be able to lend your funds.
			</p>
			<template #controls>
				<div class="warning-buttons">
					<kv-button class="smallest secondary" @click.native="save">
						Continue anyway
					</kv-button>
					<kv-button class="smallest" @click.native="closeWarning">
						Add more categories
					</kv-button>
				</div>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'SaveButton',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvLightbox,
		KvLoadingSpinner,
	},
	props: {
		showWarning: {
			type: Boolean,
			default: true,
		},
		warningThreshold: {
			type: Number,
			default: 25,
		},
	},
	data() {
		return {
			isChanged: false,
			loanCount: 0,
			saving: false,
			warningVisible: false,
		};
	},
	computed: {
		beVerb() {
			return this.loanCount === 1 ? 'is' : 'are';
		},
		loansLeft() {
			if (this.loanCount > 0) {
				return `only ${this.loanCount} loan${this.loanCount !== 1 ? 's' : ''}`;
			}
			return '0 loans';
		},
		matchVerb() {
			return this.loanCount === 1 ? 'matches' : 'match';
		},
	},
	apollo: {
		query: gql`query autolendProfileChanged {
			autolending @client {
				id
				currentLoanCount
				profileChanged
				savingProfile
				currentProfile {
					id
					kivaChooses
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isChanged = _get(data, 'autolending.profileChanged');
			this.loanCount = _get(data, 'autolending.currentLoanCount');
			this.saving = _get(data, 'autolending.savingProfile');
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
		},
	},
	methods: {
		checkSave() {
			if (!this.saving) {
				if (this.showWarning && this.loanCount < this.warningThreshold && !this.kivaChooses) {
					this.warningVisible = true;
				} else {
					this.save();
				}
			}
		},
		closeWarning() {
			this.warningVisible = false;
		},
		save() {
			this.closeWarning();
			this.apollo.mutate({
				mutation: gql`mutation saveProfile {
					autolending @client {
						id
						saveProfile
					}
				}`
			}).then(() => {
				this.$emit('autolendingSaved', 'success');
				this.$showTipMsg('Your settings have been saved');
			}).catch(e => {
				console.error(e);
				this.$emit('autolendingSaved', 'error');
				this.$showTipMsg('There was a problem saving your settings', 'error');
				// TODO: handle api.authenticationRequired (delay then send to login)
			});
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.save-button-wrapper {
	.loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;

		& >>> .line {
			background-color: $white;
		}
	}

	.warning-buttons {
		display: grid;
		grid-gap: 1rem;
		grid-template-rows: auto auto;

		@include breakpoint('large') {
			grid-template-rows: auto;
			grid-template-columns: max-content max-content;
		}
	}
}

.lightbox {
	--kv-lightbox-title-color: #{$kiva-accent-red};
}
</style>
