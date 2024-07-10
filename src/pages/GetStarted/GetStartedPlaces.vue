<template>
	<div>
		<kv-progress-bar class="progress-bar" value="66" max="100" />
		<form
			class="get-started__form tw-bg-primary tw-rounded"
			@submit.prevent="onSubmitForm"
			:disabled="selectedCountries.length === 0"
		>
			<fieldset>
				<div class="row align-middle collapse">
					<div class="small-12 xlarge-6 columns get-started__intro">
						<h1 class="tw-text-h2">
							Choose places <br class="xlu">you want to support
						</h1>
						<p class="tw-text-subhead tw-text-secondary">
							You can lend to people in 6 continents and 77 countries thanks to our Field Partners
							— local banks, NGOs, and social enterprises in each region. 100% of your loan goes
							into the field, where our global community of borrowers lives and works.
						</p>
					</div>
					<div class="tw-text-center small-12 xlarge-6 columns" v-if="countryList.length === 0">
						<kv-loading-spinner />
					</div>
					<div v-else class="small-12 xlarge-6 columns">
						<div class="country-filter">
							<label
								class="country-filter__label"
								for="country_filter"
							>
								Filter
							</label>
							<kv-icon
								class="country-filter__search-icon"
								name="magnify-glass"
								:from-sprite="true"
							/>

							<input
								class="
									country-filter__input
									tw-w-full tw-rounded-full
									tw-bg-secondary focus:tw-bg-primary tw-border tw-border-tertiary "
								type="text"
								id="country_filter"
								placeholder="Search continents or countries"
								autocomplete="off"
								name="country_filter"
								v-model="filterTerm"
								@focus="focusSearchInput"
							>
							<button
								v-if="filterTerm"
								class="
									country-filter__clear-btn
									tw-fill-current tw-text-tertiary hover:tw-text-secondary"
								type="button"
								@click="clearFilter"
							>
								<kv-icon
									class="country-filter__clear-icon"
									name="small-x"
									:from-sprite="true"
								/>
							</button>
						</div>
						<div
							class="
							get-started__list-wrapper
							after:block after:tw-h-4 after:tw-w-full
							after:tw-bg-gradient-to-t after:tw-from-primary after:tw-to-transparent
							after:tw-absolute after:tw-left-0 after:tw-bottom-0 after:tw-z-2"
						>
							<ul class="get-started__list">
								<li
									class="get-started__list-item country"
									v-for="country in filteredCountryList"
									:key="`country-${country.code}`"
								>
									<input
										class="country__checkbox tw-peer"
										type="checkbox"
										:id="`country-${country.code}`"
										:value="country.code"
										:checked="country.checked"
										@change="onChangeCountrySelection($event, country.code)"
									>
									<label
										class="
											country__label
											peer-checked:tw-text-white
											tw-rounded-full tw-bg-primary tw-border-2 tw-border-tertiary"
										:for="`country-${country.code}`"
									>

										<span class="country__circle">
											<span class="country__check-icon-wrapper">
												<kv-icon
													class="country__check-icon"
													name="checkmark"
												/>
											</span>
											<kv-flag
												class="country__img"
												:country="country.code"
												aspect-ratio="1x1"
											/>
										</span>

										<span class="country__name tw-font-medium">{{ country.name }}</span>
										<span class="country__region">{{ country.region }}</span>
									</label>
								</li>
							</ul>
						</div>
						<button
							class="get-started__select-all-btn"
							@click.prevent="toggleAllCountries(!selectAll)"
							v-kv-track-event="[
								'Lending',
								'click-country-all',
								'select all'
							]"
						>
							<span
								class="get-started__select-all-icon-wrapper tw-rounded-full"
								:class="{'tw-bg-primary-inverse tw-border-2 tw-border-primary-inverse': selectAll }"
							>
								<kv-icon
									class="tw-w-3 tw-h-3 tw-fill-current tw-text-primary"
									:class="{'tw-text-primary-inverse': selectAll }"
									name="checkmark"
								/>
							</span>
							<span>{{ selectAll ? 'deselect all' : 'select all' }}</span>
						</button>
						<p
							class="get-started__summary tw-text-center"
							v-if="selectedCountries.length === 0"
						>
							<strong>Pick as many places as you'd like.</strong>
						</p>
						<p
							class="get-started__summary tw-text-center"
							v-if="selectedCountries.length !== 0"
						>
							We'll show you loans in
							<span v-html="selectedCountriesString"></span>
							<kv-button
								class="text-link"
								v-if="selectedCountries.length !== 0"
								@click.prevent.native="toggleAllCountries(false)"
								v-kv-track-event="['Lending', 'click-place-clear', 'clear']"
							>
								Clear
							</kv-button>
						</p>
					</div>
					<kv-button
						class="get-started__submit-btn"
						type="submit"
						:disabled="selectedCountries.length === 0"
					>
						Next
					</kv-button>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script>
import _orderBy from 'lodash/orderBy';
import { gql } from '@apollo/client';
import Fuse from 'fuse.js/dist/fuse.common';
// import Fuse from 'fuse.js'; // re-enabled after https://github.com/krisk/Fuse/pull/383 is merged

import countryListQuery from '@/graphql/query/countryList.graphql';

import logReadQueryError from '@/util/logReadQueryError';

import KvButton from '@/components/Kv/KvButton';
import KvFlag from '@/components/Kv/KvFlag';
import KvIcon from '@/components/Kv/KvIcon';
import KvProgressBar from '@/components/Kv/KvProgressBar';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

const lendingPreferencesPlaces = gql`query lendingPreferences($visitorId: String) {
	general {
		lendingPreferences(visitorId: $visitorId) {
			id
			countries {
				values {
					isoCode
				}
			}
		}
	}
}`;

export default {
	name: 'GetStartedPlaces',
	components: {
		KvButton,
		KvFlag,
		KvIcon,
		KvProgressBar,
		KvLoadingSpinner,
	},
	metaInfo: {
		title: 'Places - Get Started'
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			countryList: [],
			fuseCountryList: [],
			filterTerm: '',
			selectAll: false,
		};
	},
	apollo: {
		preFetch(config, client, { cookieStore }) {
			const lendingPrefs = client.query({
				variables: {
					visitorId: cookieStore.get('uiv') || null,
				},
				query: lendingPreferencesPlaces,
			});

			const countryList = client.query({
				query: countryListQuery,
			});

			return Promise.all([
				lendingPrefs,
				countryList
			]);
		}
	},
	computed: {
		selectedCountries() {
			return this.countryList.filter(country => country.checked);
		},
		selectedCountriesString() {
			if (this.selectedCountries.length === 1) {
				return `<strong>${this.selectedCountries[0].name}<strong>`;
			}
			const lengthOfCountriesToList = 6;
			// the selected items limited to 6
			const selectedCountriesShortList = this.selectedCountries.slice(0, lengthOfCountriesToList);
			// the count of countries that aren't being displayed
			const countriesRemaining = this.selectedCountries.length - lengthOfCountriesToList;

			const lastCountry = selectedCountriesShortList.slice(-1)[0];
			const otherCountries = selectedCountriesShortList.slice(0, -1);
			const arrayOfOtherCountryNames = otherCountries.map(country => country.name).join(', ');

			if (this.selectedCountries.length <= 6) {
				return `<strong>${arrayOfOtherCountryNames}</strong> and <strong>${lastCountry.name}</strong>`;
			}
			// eslint-disable-next-line max-len
			return `<strong>${arrayOfOtherCountryNames}</strong>, <strong>${lastCountry.name}</strong> and ${countriesRemaining} more.`;
		},
		filteredCountryList() {
			// eslint-disable-next-line max-len
			return this.countryList.filter(country => this.fuseCountryList.find(fuseCountry => fuseCountry.code === country.code));
		}
	},
	mounted() {
		this.fuseCountryList = this.countryList;
		// After we have a countryList, prep for filtering
		this.fuse = new Fuse(this.countryList, {
			threshold: 0.20,
			includeMatches: true,
			ignoreLocation: true,
			keys: ['name', 'region'],
		});
	},
	watch: {
		filterTerm() {
			if (this.filterTerm === '') {
				this.fuseCountryList = this.countryList;
			} else {
				this.fuseCountryList = this.fuse.search(this.filterTerm).map(result => result.item);
			}
		}
	},
	methods: {
		clearFilter() {
			this.filterTerm = '';
		},
		toggleAllCountries(state) {
			this.selectAll = state;
			this.fuseCountryList.forEach(fuseCountry => {
				this.countryList.find(country => country.code === fuseCountry.code).checked = this.selectAll;
			});
		},
		onChangeCountrySelection(event, countryCode) {
			// check item in countryList
			const item = this.countryList.find(country => country.code === countryCode);
			item.checked = event.target.checked;
			if (event.target.checked) {
				this.$kvTrackEvent(
					'Lending',
					'click-place-country',
					this.countryList.find(country => country.code === countryCode).name
				);
			}
		},
		async onSubmitForm() {
			const uiv = this.cookieStore.get('uiv');

			const userCountryCodes = this.selectedCountries.map(country => country.code);

			this.$kvTrackEvent('Lending', 'click-place-next', userCountryCodes.join());

			try {
				const saveLendingPreferences = gql`mutation savePrefs($visitorId: String!, $countries: [String]) {
					general {
						saveLendingPreferences(visitorId: $visitorId, countries: $countries) {
							id
						}
					}
				}`;

				await this.apollo.mutate({
					mutation: saveLendingPreferences,
					variables: {
						visitorId: uiv,
						countries: userCountryCodes
					}
				});

				this.$router.push({
					path: '/get-started/results'
				});
			} catch (err) {
				console.error(err);
				this.$showTipMsg('There was a problem saving your places', 'error');
			}
		},
		focusSearchInput() {
			this.$kvTrackEvent('Lending', 'click-place-search');
		}
	},
	created() {
		let countryList;
		let lendingPrefs;

		try {
			lendingPrefs = this.apollo.readQuery({
				variables: {
					visitorId: this.cookieStore.get('uiv') || null,
				},
				query: lendingPreferencesPlaces,
			});
		} catch (e) {
			logReadQueryError(e, 'LendingPreferencesPlaces lendingPreferencesQuery');
		}

		try {
			countryList = this.apollo.readQuery({
				query: countryListQuery,
			});
		} catch (e) {
			logReadQueryError(e, 'LendingPreferencesPlaces countryListQuery');
		}

		const countryValues = lendingPrefs?.general?.lendingPreferences?.countries?.values || [];
		const previouslySelectedPlaces = countryValues.map(countryObj => countryObj.isoCode);

		const countries = countryList?.lend?.countryFacets || [];

		this.countryList = _orderBy(countries, ['country.name'], ['asc']).map(countryObj => {
			return {
				name: countryObj.country.name,
				code: countryObj.country.isoCode,
				region: countryObj.country.region,
				checked: !!previouslySelectedPlaces.includes(countryObj.country.isoCode),
			};
		});
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
$box-shadow: 0 rem-calc(2) rem-calc(30) 0 rgba(0, 0, 0, 0.15);
$box-shadow-hover: 0 rem-calc(2) rem-calc(10) 0 rgba(0, 0, 0, 0.35);

.get-started {
	&__form {
		padding: 1.5rem;
		margin: 2rem auto;
		width: 98%;
		max-width: rem-calc(1088);

		@include breakpoint(medium) {
			box-shadow: 0 2px 100px 0 rgba(0, 0, 0, 0.1);
		}

		@include breakpoint(large) {
			margin: 4.5rem auto;
			padding: 3.75rem 3.25rem 0.75rem 3.75rem;
		}
	}

	&__intro {
		text-align: center;
		margin-bottom: 1rem;

		@include breakpoint(xlarge) {
			text-align: left;
		}

		h1 {
			margin-bottom: 1.5rem;

			@include breakpoint(large) {
				margin-bottom: 0;
			}
		}

		p {
			@include breakpoint(xlarge) {
				padding: 1rem 25% 1rem 0;
			}
		}
	}

	&__list-wrapper {
		height: calc(90vh - #{rem-calc(450)});
		min-height: 15rem;
		margin: 0 auto;
		padding-bottom: 1rem;
		position: relative;
		overflow: hidden;

		@include breakpoint(xlarge) {
			height: calc(90vh - #{rem-calc(250)});
		}
	}

	&__list {
		list-style: none;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: 0;
		padding-bottom: 1rem;
		overflow-y: scroll;
	}

	&__list-item {
		display: flex;
	}

	&__select-all-btn {
		display: flex;
		align-items: center;
		margin: 0.5rem 0 1rem 1.15rem;
		padding: 0.25rem;
	}

	&__select-all-icon-wrapper {
		display: flex;
		width: rem-calc(25);
		height: rem-calc(25);
		padding: 0.2rem;
		align-items: center;
		justify-content: center;
		border: rem-calc(2) solid $charcoal;
		margin-right: 0.5rem;
	}

	&__summary {
		margin: 0 0 2.5rem auto;
	}

	&__submit-btn {
		display: block;
		margin: 0 1.25rem 3rem auto;
	}
}

.country-filter {
	position: relative;
	margin: 0.5rem;

	&__label {
		@include visually-hidden();
	}

	&__input {
		padding: rem-calc(10) rem-calc(32) rem-calc(10) rem-calc(42);
	}

	&__clear-btn {
		position: absolute;
		right: 0;
		z-index: 2;
		width: rem-calc(48);
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__clear-icon {
		width: 1rem;
		height: 1rem;
	}

	&__search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		fill: $kiva-text-light;
		width: 1rem;
		height: 1rem;
	}
}

.country {
	margin: 0.5rem;

	&__label {
		display: flex;
		align-items: center;
		width: 100%;
		padding: rem-calc(9) rem-calc(11);
		margin: 0;
		line-height: 1;
		position: relative;

		&:hover {
			color: $kiva-textlink-hover;
			box-shadow: $box-shadow-hover;
		}
	}

	&__circle {
		width: rem-calc(25);
		height: rem-calc(25);
	}

	&__check-icon-wrapper {
		display: flex;
		width: rem-calc(25);
		height: rem-calc(25);
		padding: 0.2rem;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: rem-calc(2) solid #fff;
		opacity: 0;
		z-index: 2;
		position: absolute;
	}

	&__check-icon {
		width: rem-calc(16);
		height: rem-calc(12);
		fill: #fff;
	}

	&__img {
		width: rem-calc(25);
		height: rem-calc(25);
		overflow: hidden;
		border-radius: 50%;
	}

	&__name {
		margin: 0 0.75rem;
		flex: 1;
	}

	&__region {
		justify-self: flex-end;
	}

	&__checkbox {
		@include visually-hidden();

		&:focus + .country__label {
			outline: 0;
			border-color: $kiva-accent-darkblue;
			box-shadow: $box-shadow-hover;
		}

		&:checked + .country__label {
			background: $kiva-accent-blue;
			border-color: $kiva-accent-blue;

			&:hover {
				color: #fff;
			}

			.country__img {
				opacity: 0;
			}

			.country__check-icon-wrapper {
				opacity: 1;
			}
		}
	}
}
</style>
