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
					@lightbox-closed="showLightbox = false; showSelectedFilterOptions = false;"
				>
					<template slot="title">
						<div class="who-titles-wrapper">
							<transition :name="slideTransition" mode="out-in">
								<h3 v-if="!showSelectedFilterOptions">
									Choose who you’ll support
								</h3>
								<a
									v-if="showSelectedFilterOptions"
									role="button"
									class="back-to-options"
									@click.prevent="backToAllOptions"
								>
									<kv-icon class="arrow back-arrow" name="small-chevron" :from-sprite="true" />
									Back to all options</a>
							</transition>
							<hr>
						</div>
					</template>
					<div class="who-inputs-wrapper">
						<transition
							:name="slideTransition"
							mode="out-in"
						>
							<div v-if="!showSelectedFilterOptions" key="allFilters">
								<kiva-chooses-radios />
								<!-- basic criteria -->
								<div class="row" v-show="!kivaChooses">
									<div class="small-12 large-6 columns setting-column">
										<gender-radios />
									</div>
									<div class="small-12 large-6 columns setting-column">
										<group-radios />
									</div>
									<div class="small-12 large-6 columns setting-column">
										<country-radios
											@change="filterRadioChange"
											:selector-shown="showSelectedFilterOptions"
										/>
									</div>
									<div class="small-12 large-6 columns setting-column">
										<sector-filter />
									</div>
								</div>
								<div class="row" v-show="!kivaChooses">
									<div class="column ">
										<!-- advanced settings -->
										<div class="row column">
											<button
												@click="showAdvanced = !showAdvanced"
												class="advanced-options-toggle"
											>
												<!-- eslint-disable-next-line max-len -->
												{{ showAdvanced ? 'Hide' : 'Show' }} advanced options <kv-icon class="arrow more-options-arrow" :class="{'down': !showAdvanced, 'up': showAdvanced}" name="small-chevron" :from-sprite="true" />
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
							<div v-if="showSelectedFilterOptions" key="specificFilter">
								<country-filter v-if="selectedFilterGroup =='countries'" />
							</div>
						</transition>
					</div>
					<template slot="controls">
						<hr>
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
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';

import AttributeFilter from './AttributeFilter';
import CountryFilter from './CountryFilter';
import CountryRadios from './CountryRadios';
import DefaultRateDropdown from './DefaultRateDropdown';
import GenderRadios from './GenderRadios';
import GroupRadios from './GroupRadios';
import InlineCounter from './InlineCounter';
import KivaChoosesRadios from './KivaChoosesRadios';
import LoanIncrementRadios from './LoanIncrementRadios';
import LoanTermDropdown from './LoanTermDropdown';
import PartnerDelRateDropdown from './PartnerDelRateDropdown';
import PartnerFilter from './PartnerFilter';
import RiskRatingDropdown from './RiskRatingDropdown';
import SaveButton from './SaveButton';
import SectorFilter from './SectorFilter';
import WhoYoullSupportText from './WhoYoullSupportText';

export default {
	inject: ['apollo'],
	components: {
		AttributeFilter,
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
		LoanIncrementRadios,
		LoanTermDropdown,
		PartnerDelRateDropdown,
		PartnerFilter,
		RiskRatingDropdown,
		SaveButton,
		SectorFilter,
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
	::v-deep .kv-lightbox {
		max-width: 680px;

		.filter-title {
			font-size: 1rem;
			margin: 1rem auto 0.5rem auto;
			font-weight: $global-weight-highlight;
		}
	}

	h3 {
		margin-top: 1.75rem;
		display: inline-block;
		font-weight: $global-weight-bold;
	}

	.who-inputs-wrapper {
		padding: 1.5rem 0 1.5rem 0.15rem;
		overflow: hidden;
	}

	.who-titles-wrapper {
		overflow: hidden;

		h3,
		a {
			width: 80%; // sets h3 and a to same width so animation is smoother
		}
	}

	.button {
		margin-bottom: 1.75rem;
	}

	.dropdown-wrapper {
		display: inline;
	}

	.back-to-options {
		margin-top: 1.75rem;
		line-height: rem-calc(32);
		display: inline-block;
	}

	.arrow {
		stroke: $blue;
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

	.advanced-options-toggle {
		color: $kiva-textlink;
		font-weight: 300;
	}
}

::v-deep .dropdown {
	margin-bottom: 0;
}

</style>
