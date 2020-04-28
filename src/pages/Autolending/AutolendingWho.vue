<template>
	<div class="row who-area" :class="{ obscure: !isEnabled }">
		<div class="column large-8 settings-card">
			<div class="icon-wrapper">
				<kv-icon
					class="icon"
					title="Who you’ll support"
					name="auto-icon-who"
				/>
			</div>
			<div class="title-wrapper">
				<h3>Who you’ll support</h3>
			</div>
			<div class="content-wrapper">
				<who-youll-support-text @click="showLightbox = true" />
				<inline-counter :strong="true" v-show="!kivaChooses" />

				<kv-lightbox
					class="autolending-who-lightbox"
					:no-padding-bottom="true"
					:no-padding-top="true"
					:visible="showLightbox"
					@lightbox-closed="showLightbox = false"
				>
					<template slot="title">
						<h3>
							Choose who you’ll support
						</h3>
						<hr>
					</template>
					<div class="who-inputs-wrapper">
						<kiva-chooses-radios />

						<!-- basic criteria -->
						<div class="row" v-show="!kivaChooses">
							<div class="column">
								<!-- row for criteria components -->
								<div class="row">
									<div class="small-12 large-6 columns setting-column">
										<gender-radios />
									</div>
									<div class="small-12 large-6 columns setting-column">
										<group-radios />
									</div>
									<div class="small-12 large-6 columns setting-column">
										<country-filter />
									</div>
									<div class="small-12 large-6 columns setting-column">
										<sector-filter />
									</div>
								</div>
								<!-- advanced settings -->
								<div class="row column">
									<button @click="showAdvanced = !showAdvanced" class="advanced-options-toggle">
										<!-- eslint-disable-next-line max-len -->
										{{ showAdvanced ? 'Hide' : 'Show' }} advanced options <kv-icon class="more-options-arrow" :class="{'down': !showAdvanced, 'up': showAdvanced}" name="small-chevron" :from-sprite="true" />
									</button>
								</div>
								<kv-expandable>
									<div class="row" v-show="showAdvanced">
										<div class="small-12 large-6 columns setting-column">
											<loan-increment-radios />
										</div>
										<div class="small-12 large-6 columns setting-column">
											<attribute-filter />
										</div>
										<div class="small-12 large-6 columns setting-column">
											<loan-term-dropdown />
										</div>
										<div class="small-12 large-6 columns setting-column">
											<partner-filter />
										</div>
										<div class="small-12 large-6 columns setting-column">
											<partner-del-rate-dropdown />
										</div>
										<div class="small-12 large-6 columns setting-column">
											<risk-rating-dropdown />
										</div>
										<div class="small-12 large-6 columns setting-column">
											<default-rate-dropdown />
										</div>
									</div>
								</kv-expandable>
							</div>
						</div>
					</div>
					<template slot="controls">
						<hr>
						<div class="row">
							<div class="columns shrink">
								<kv-button
									data-test="who-save-button"
									class="smaller button"
									v-if="!isSaving"
									@click.native="save"
									:disabled="!isChanged"
								>
									Save
								</kv-button>
								<kv-button data-test="who-save-button" class="smaller button" v-else>
									Saving <kv-loading-spinner />
								</kv-button>
							</div>
							<div class="columns">
								<inline-counter />
							</div>
						</div>
					</template>
				</kv-lightbox>
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
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import AttributeFilter from './AttributeFilter';
import KvExpandable from '@/components/Kv/KvExpandable';
import CountryFilter from './CountryFilter';
import InlineCounter from './InlineCounter';
import GenderRadios from './GenderRadios';
import PartnerFilter from './PartnerFilter';
import SectorFilter from './SectorFilter';
import RiskRatingDropdown from './RiskRatingDropdown';
import LoanTermDropdown from './LoanTermDropdown';
import GroupRadios from './GroupRadios';
import PartnerDelRateDropdown from './PartnerDelRateDropdown';
import LoanIncrementRadios from './LoanIncrementRadios';
import DefaultRateDropdown from './DefaultRateDropdown';
import KivaChoosesRadios from './KivaChoosesRadios';
import WhoYoullSupportText from './WhoYoullSupportText';


export default {
	inject: ['apollo'],
	components: {
		AttributeFilter,
		KvIcon,
		KvLightbox,
		KvButton,
		KvLoadingSpinner,
		KvExpandable,
		CountryFilter,
		InlineCounter,
		GenderRadios,
		PartnerFilter,
		SectorFilter,
		RiskRatingDropdown,
		LoanTermDropdown,
		GroupRadios,
		PartnerDelRateDropdown,
		LoanIncrementRadios,
		DefaultRateDropdown,
		KivaChoosesRadios,
		WhoYoullSupportText,
	},
	data() {
		return {
			isSaving: false,
			isEnabled: false,
			showLightbox: false,
			isChanged: false,
			showAdvanced: false,
			kivaChooses: true,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				profileChanged
				currentProfile {
					isEnabled
					kivaChooses
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
			this.isChanged = !!_get(data, 'autolending.profileChanged');
		},
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

.autolending-who-lightbox {
	::v-deep .kv-lightbox {
		max-width: 680px;
	}

	::v-deep .kv-lightbox .filter-title {
		font-size: 1rem;
		margin: 1rem auto 0.5rem auto;
		font-weight: $global-weight-highlight;
	}

	h3 {
		margin-top: 1.75rem;
		display: inline-block;
		font-weight: $global-weight-bold;
	}

	.who-inputs-wrapper {
		padding: 1.5rem 0;
	}

	.button {
		margin-bottom: 1.75rem;
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

.advanced-options-toggle {
	color: $kiva-textlink;
	font-weight: 300;

	.more-options-arrow {
		stroke: $blue;
		width: rem-calc(13);
		height: rem-calc(9);
		margin-left: 0.75rem;

		&.up {
			transform: rotate(180deg);
		}
	}
}
</style>
