<template>
	<kv-settings-card title="Who you’ll support" :disabled="!isEnabled">
		<template #content>
			<who-youll-support-text @click="showLightbox = true" />
			<inline-counter :strong="true" v-show="!kivaChooses" />

			<kv-lightbox
				class="autolending-who-lightbox"
				:visible="showLightbox"
				title="Choose who you’ll support"
				@lightbox-closed="showLightbox = false; showSelectedFilterOptions = false;"
			>
				<div class="who-inputs-wrapper">
					<transition :name="slideTransition" mode="out-in">
						<span v-if="!showSelectedFilterOptions"></span>
						<button
							class="tw-text-link back-to-options"
							v-if="showSelectedFilterOptions"
							@click="backToAllOptions"
						>
							<kv-icon
								class="arrow back-arrow tw-stroke-current tw-text-action"
								name="small-chevron"
								:from-sprite="true"
							/>
							Back to all options
						</button>
					</transition>
					<transition
						:name="slideTransition"
						mode="out-in"
					>
						<div v-if="!showSelectedFilterOptions" key="allFilters">
							<kiva-chooses-radios class="tw-mb-4" />
							<!-- basic criteria -->
							<div class="row" v-show="!kivaChooses">
								<div class="small-12 large-6 columns">
									<gender-radios class="tw-mb-4" />
								</div>
								<div class="small-12 large-6 columns">
									<group-radios class="tw-mb-4" />
								</div>
								<div class="small-12 large-6 columns">
									<country-radios
										class="tw-mb-4"
										@change="filterRadioChange"
										:selector-shown="showSelectedFilterOptions"
									/>
								</div>
								<div class="small-12 large-6 columns">
									<sector-radios
										class="tw-mb-4"
										@change="filterRadioChange"
										:selector-shown="showSelectedFilterOptions"
									/>
								</div>
							</div>
							<div class="row" v-show="!kivaChooses">
								<div class="column ">
									<!-- advanced settings -->
									<div class="row column">
										<button
											@click="showAdvanced = !showAdvanced"
											class="tw-text-link"
										>
											<!-- eslint-disable-next-line max-len -->
											{{ showAdvanced ? 'Hide' : 'Show' }} advanced options <kv-icon class="arrow more-options-arrow" :class="{'down': !showAdvanced, 'up': showAdvanced}" name="small-chevron" :from-sprite="true" />
										</button>
									</div>
									<kv-expandable>
										<div class="row tw-mt-2" v-show="showAdvanced">
											<div class="small-12 large-6 columns">
												<loan-increment-dropdown class="tw-mb-4" />
											</div>
											<div class="small-12 large-6 columns">
												<attribute-radios
													class="tw-mb-4"
													@change="filterRadioChange"
													:selector-shown="showSelectedFilterOptions"
												/>
											</div>
											<div class="small-12 large-6 columns">
												<loan-term-dropdown class="tw-mb-4" />
											</div>
											<div class="small-12 large-6 columns">
												<partner-radios
													class="tw-mb-4"
													@change="filterRadioChange"
													:selector-shown="showSelectedFilterOptions"
												/>
											</div>
											<div class="small-12 large-6 columns">
												<partner-del-rate-dropdown class="tw-mb-4" />
											</div>
											<div class="small-12 large-6 columns">
												<risk-rating-dropdown class="tw-mb-4" />
											</div>
											<div class="small-12 large-6 columns">
												<default-rate-dropdown class="tw-mb-4" />
											</div>
										</div>
									</kv-expandable>
								</div>
							</div>
						</div>
						<div v-if="showSelectedFilterOptions" key="specificFilter">
							<country-filter v-if="selectedFilterGroup =='country'" />
							<sector-filter v-if="selectedFilterGroup =='sector'" />
							<attribute-filter v-if="selectedFilterGroup =='theme'" />
							<partner-filter v-if="selectedFilterGroup =='partner'" />
						</div>
					</transition>
				</div>
				<template #controls>
					<div class="row">
						<div class="columns shrink">
							<save-button @autolendingSaved="settingsSaved" />
						</div>
						<div class="columns" v-show="!kivaChooses">
							<inline-counter />
						</div>
					</div>
				</template>
			</kv-lightbox>
		</template>
	</kv-settings-card>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';

import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';

import AttributeFilter from './AttributeFilter';
import AttributeRadios from './AttributeRadios';
import CountryFilter from './CountryFilter';
import CountryRadios from './CountryRadios';
import DefaultRateDropdown from './DefaultRateDropdown';
import GenderRadios from './GenderRadios';
import GroupRadios from './GroupRadios';
import InlineCounter from './InlineCounter';
import KivaChoosesRadios from './KivaChoosesRadios';
import LoanIncrementDropdown from './LoanIncrementDropdown';
import LoanTermDropdown from './LoanTermDropdown';
import PartnerDelRateDropdown from './PartnerDelRateDropdown';
import PartnerFilter from './PartnerFilter';
import PartnerRadios from './PartnerRadios';
import RiskRatingDropdown from './RiskRatingDropdown';
import SaveButton from './SaveButton';
import SectorFilter from './SectorFilter';
import SectorRadios from './SectorRadios';
import WhoYoullSupportText from './WhoYoullSupportText';

export default {
	name: 'AutolendingWho',
	inject: ['apollo', 'cookieStore'],
	components: {
		AttributeFilter,
		AttributeRadios,
		CountryFilter,
		CountryRadios,
		DefaultRateDropdown,
		GenderRadios,
		GroupRadios,
		InlineCounter,
		KivaChoosesRadios,
		KvExpandable,
		KvIcon,
		KvLightbox,
		KvSettingsCard,
		LoanIncrementDropdown,
		LoanTermDropdown,
		PartnerDelRateDropdown,
		PartnerFilter,
		PartnerRadios,
		RiskRatingDropdown,
		SaveButton,
		SectorFilter,
		SectorRadios,
		WhoYoullSupportText,
	},
	data() {
		return {
			isEnabled: false,
			showLightbox: false,
			showAdvanced: false,
			kivaChooses: true,
			showSelectedFilterOptions: false,
			selectedFilterGroup: '',
		};
	},
	apollo: {
		query: gql`query autolendProfileWho {
			autolending @client {
				profileChanged
				currentProfile {
					id
					isEnabled
					kivaChooses
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
		},
	},
	computed: {
		slideTransition() {
			return !this.showSelectedFilterOptions ? 'kv-slide-right' : 'kv-slide-left';
		}
	},
	methods: {
		settingsSaved() {
			this.showLightbox = false;
			this.showSelectedFilterOptions = false;
		},
		backToAllOptions() {
			this.showSelectedFilterOptions = false;
		},
		filterRadioChange({ radioKey, value }) {
			if (value === 'some') {
				this.showSelectedFilterOptions = true;
			}
			this.selectedFilterGroup = radioKey;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.autolending-who-lightbox {
	.who-inputs-wrapper {
		padding: 1.5rem 0 1.5rem 0.15rem;
		overflow: hidden;

		> button { // set to full width so animation is smoother
			width: 100%;
			text-align: left;
		}
	}

	::v-deep .kv-lightbox {
		.who-inputs-wrapper {
			max-width: 100%;

			@include breakpoint('large') {
				width: rem-calc(530);
			}

			@include breakpoint('xxlarge') {
				width: rem-calc(680);
			}
		}

		.filter-title {
			font-size: 1rem;
			margin: 1rem auto 0.5rem auto;
			font-weight: $global-weight-highlight;
		}
	}

	.button {
		margin-bottom: 1.75rem;
	}

	.dropdown-wrapper {
		display: inline;
	}

	.back-to-options {
		margin-bottom: 1.75rem;
		display: block;
	}

	.arrow {
		width: rem-calc(13);
		height: rem-calc(9);

		&.more-options-arrow {
			margin-left: 0.75rem;

			&.up {
				transform: rotate(180deg);
			}
		}

		&.back-arrow {
			transform: rotate(90deg);
		}
	}
}
</style>
