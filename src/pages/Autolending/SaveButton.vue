<template>
	<div class="save-button-wrapper" v-show="isChanged">
		<kv-button class="smaller" v-if="!saving" @click.native="checkSave">
			Save settings
		</kv-button>
		<kv-button class="smaller" v-else>
			Saving settings <kv-loading-spinner />
		</kv-button>
		<kv-lightbox
			:visible="warningVisible"
			:no-padding-top="true"
			:no-padding-sides="true"
			:no-padding-bottom="true"
			@lightbox-closed="closeWarning"
		>
			<template #title>
				<h2 class="warning-title">
					Criteria too narrow
				</h2>
			</template>
			<p class="warning-text">
				There are {{ loansLeft }} that match your criteria - we may not be able to lend your funds.
			</p>
			<template #controls>
				<kv-button class="smallest warning-button" @click.native="closeWarning">
					Add more categories
				</kv-button>
				<kv-button class="smallest secondary warning-button" @click.native="save">
					Continue anyway
				</kv-button>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	inject: ['apollo'],
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
		loansLeft() {
			if (this.loanCount > 0) {
				return `only ${this.loanCount} loan${this.loanCount !== 1 ? 's' : ''}`;
			}
			return '0 loans';
		}
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentLoanCount
				profileChanged
				savingProfile
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isChanged = _get(data, 'autolending.profileChanged');
			this.loanCount = _get(data, 'autolending.currentLoanCount');
			this.saving = _get(data, 'autolending.savingProfile');
		},
	},
	methods: {
		checkSave() {
			if (!this.saving) {
				if (this.showWarning && this.loanCount < this.warningThreshold) {
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
				mutation: gql`mutation {
					autolending @client {
						saveProfile
					}
				}`
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

	.kv-lightbox-wrap .kv-lightbox .lightbox-row .lightbox-columns {
		max-width: rem-calc(524);

		.lightbox-content {
			text-align: center;
			padding: 1rem 1.5rem 0.5rem;
		}
	}

	.warning-title {
		color: $kiva-accent-red;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.warning-text {
		font-size: rem-calc(18);
		margin-bottom: 1.5rem;
	}

	.warning-button {
		display: block;
		margin: 0 auto 1rem;
	}
}
</style>
