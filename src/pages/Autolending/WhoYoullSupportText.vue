<template>
	<div>
		You’ll automatically lend to
		<template v-if="kivaChooses">
			<button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>
				borrowers
			</button>,
			<button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>
				countries
			</button>, and
			<button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>
				sectors
			</button> based on your lending history.
		</template>
		<template v-if="!kivaChooses">
			<button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>
				{{ borrowersText }}
			</button>, in
			<button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>
				{{ countriesText }}
			</button>,
			and <button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>
				{{ sectorText }}
			</button><span v-if="advancedText"> and <button
				class="tw-text-link tw-font-medium"
				data-test="autolending-who"
				@click="$emit('click', $event)"
			>{{ advancedText }}</button></span>.
		</template>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

export default {
	name: 'WhoYoullSupportText',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			gender: 'both',
			isGroup: 'both',
			currentIsoCodes: [],
			currentSectorIds: [],
			activatedAdvancedFilters: [],
			kivaChooses: true,
		};
	},
	apollo: {
		query: gql`query whoYoullSupport {
			autolending @client {
				currentProfile {
					id
					kivaChooses
					loanSearchCriteria {
						filters {
							gender
							isGroup
							country
							sector
							loanLimit
							theme
							lenderTerm {
								max
							}
							partner
							arrearsRate {
								max
							}
							riskRating {
								min
							}
							defaultRate {
								max
							}
						}
					}
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
			this.gender = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.gender') || 'both';
			this.isGroup = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.isGroup');
			this.currentIsoCodes = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.country') || [];
			this.currentSectorIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.sector') || [];
			// AdvancedFilters
			/* eslint-disable max-len */
			const loanIncrement = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.loanLimit');
			const attributeIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.theme');
			const loanTerm = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.lenderTerm.max');
			const partnerIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.partner');
			const delinquencyRate = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.arrearsRate.max');
			const riskRatingMin = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.riskRating.min');
			const defaultRateMax = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.defaultRate.max');
			/* eslint-enable max-len */
			// filter != null filters out both null and undefined values
			this.activatedAdvancedFilters = [
				loanIncrement === 25 ? null : loanIncrement, // default value is 25
				attributeIds,
				loanTerm,
				partnerIds,
				delinquencyRate,
				riskRatingMin === 0 ? null : riskRatingMin, // default value is 0
				defaultRateMax,
			].filter(filterValue => filterValue != null);
		}
	},
	computed: {
		groupText() {
			if (this.isGroup === true) {
				return 'groups only';
			}
			if (this.isGroup === false) {
				return 'individuals only';
			}
			return 'both individuals and groups';
		},
		genderText() {
			if (this.gender === 'male') {
				return 'men';
			}
			if (this.gender === 'female') {
				return 'women';
			}
			return 'all genders';
		},
		countriesText() {
			if (this.currentIsoCodes.length !== 0) {
				return `${this.currentIsoCodes.length} countries`;
			}
			return 'any countries';
		},
		sectorText() {
			if (this.currentSectorIds.length !== 0) {
				return `${this.currentSectorIds.length} sectors`;
			}
			return 'any sectors';
		},
		borrowersText() {
			if (this.genderText === 'all genders' && this.groupText === 'both individuals and groups') {
				return 'any borrower';
			}
			return `${this.genderText}, ${this.groupText}`;
		},
		advancedText() {
			if (this.activatedAdvancedFilters.length !== 0) {
				return `${this.activatedAdvancedFilters.length} advanced filters`;
			}
			return '';
		},
	}
};
</script>
