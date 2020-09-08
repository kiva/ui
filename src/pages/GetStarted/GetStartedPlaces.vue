<template>
	<div>
		<kv-progress-bar class="progress-bar" value="66" max="100" />
		<form
			@submit.prevent="onSubmitForm"
			:disabled="selectedCountries.length === 0"
		>
			<div class="page-content">
				<fieldset>
					<div class="row">
						<div class="small-12 xlarge-5 columns get-started__intro">
							<h1>Choose places <span class="no-wrap">you care about</span></h1>
							<p>
								You can lend to people in 6 continents and 77 countries thanks to our
								Field Partners — local banks, NGOs, and social enterprises in each region.
							</p>
						</div>
						<div class="small-12 xlarge-7 columns">
							<div class="country-filter">
								<label
									class="country-filter__label"
									for="country_filter"
								>
									Filter
								</label>
								<input
									class="country-filter__input"
									type="text"
									id="country_filter"
									placeholder="Search continents or countries"
									autocomplete="off"
									name="country_filter"
									v-model="filterTerm"
								>
								<button
									v-if="filterTerm"
									class="country-filter__clear-btn"
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
							<div class="get-started__list-wrapper">
								<ul class="get-started__list">
									<li
										class="get-started__list-item country"
										v-for="country in filteredCountryList"
										:key="`country-${country.code}`"
									>
										<input
											class="country__checkbox"
											type="checkbox"
											:id="`country-${country.code}`"
											:value="country.code"
											:checked="country.checked"
											@change="onChangeCountrySelection($event, country.code)"
										>
										<label
											class="country__label"
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

											<span class="country__name">{{ country.name }}</span>
											<span class="country__region">{{ country.region }}</span>
										</label>
									</li>
								</ul>
							</div>
							<button
								class="get-started__select-all-btn"
								@click="selectAllCountries"
								type="button"
							>
								<kv-icon
									class="get-started__select-all-icon"
									name="checkmark"
								/>
								<span>{{ selectAll ? 'Deselect All' : 'Select All' }}</span>
							</button>
							<p
								class="get-started__summary text-center"
								v-html="summaryText"
							></p>
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
			</div>
		</form>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
import gql from 'graphql-tag';
import Fuse from 'fuse.js/dist/fuse.common';
// import Fuse from 'fuse.js'; // re-enabled after https://github.com/krisk/Fuse/pull/383 is merged

// import countryListQuery from '@/graphql/query/countryList.graphql';

import cookieStore from '@/util/cookieStore';

import KvButton from '@/components/Kv/KvButton';
import KvFlag from '@/components/Kv/KvFlag';
import KvIcon from '@/components/Kv/KvIcon';
import KvProgressBar from '@/components/Kv/KvProgressBar';

// TODO: remove once you're pulling countries from Apollo
import countryListMock from './GetStartedPlacesMock';

export default {
	components: {
		KvButton,
		KvFlag,
		KvIcon,
		KvProgressBar,
	},
	metaInfo: {
		title: 'Places - Get Started'
	},
	inject: ['apollo'],
	data() {
		return {
			countryList: [],
			filteredCountryList: [],
			filterTerm: '',
			selectAll: false,
		};
	},
	// apollo: { // TODO: this query should be close, uncomment to pull countries from Apollo
	// 	query: countryListQuery,
	// 	preFetch: true,
	// 	result({ data }) {
	// 		const countries = _get(data, 'data.lend.countryFacets');
	// 		this.countryList = _orderBy(countries, ['country.name'], ['asc']).map(countryObj => {
	// 			return {
	// 				name: countryObj.country.name,
	// 				code: countryObj.country.isoCode,
	// 				region: countryObj.country.region,
	// 				checked: false
	// 			};
	// 		});
	// 	}
	// },
	computed: {
		selectedCountries() {
			return this.countryList.filter(country => country.checked);
		},
		summaryText() {
			if (this.selectedCountries.length === 0) {
				return '<b>Pick places to lend to.<?b>';
			}
			return ''; // TODO: Figure out what text to display here
		}
	},
	mounted() {
		// TODO: remove the below once you're pulling countries from Apollo
		const countries = _get(countryListMock, 'data.lend.countryFacets');
		this.countryList = _orderBy(countries, ['country.name'], ['asc']).map(countryObj => {
			return {
				name: countryObj.country.name,
				code: countryObj.country.isoCode,
				region: countryObj.country.region,
				checked: false
			};
		});
		// TODO: remove the above once you're pulling countries from Apollo

		// After we have a countryList, prep for filtering
		this.filteredCountryList = this.countryList;
		this.fuse = new Fuse(this.countryList, {
			threshold: 0.25,
			distance: 100000,
			includeMatches: true,
			keys: ['name', 'region'],
		});
	},
	watch: {
		filterTerm() {
			if (this.filterTerm === '') {
				this.filteredCountryList = this.countryList;
			} else {
				this.filteredCountryList = this.fuse.search(this.filterTerm).map(result => result.item);
			}
		}
	},
	methods: {
		clearFilter() {
			this.filterTerm = '';
		},
		selectAllCountries() {
			this.selectAll = !this.selectAll;
			this.countryList.forEach(country => {
				this.$set(country, 'checked', this.selectAll);
			});
		},
		onChangeCountrySelection(event, countryCode) {
			const item = this.countryList.find(country => country.code === countryCode);
			this.$set(item, 'checked', event.target.checked);
		},
		async onSubmitForm() {
			// TODO: This whole method is untested

			const uiv = cookieStore.get('uiv');
			console.log(uiv);

			const userCountryCodes = this.selectedCountries.map(country => country.code);
			console.log(userCountryCodes);

			const saveLendingPreferences = gql`mutation savePrefs($visitorId: String!, $countries: [String]) {
				my {
					saveLendingPreferences(visitorId: $visitorId, countries: $countries) {
						id
						countries {
							values {
								name
								isoCode
							}
						}
					}
				}
			}`;

			try {
				const result = await this.apollo.mutate({
					mutation: saveLendingPreferences,
					variables: {
						visitorId: uiv,
						countries: userCountryCodes
					}
				});
				console.log(result);
				this.$router.push('get-started/results');
			} catch (err) {
				console.error(err);
				// TODO: Show error message to user?
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
$box-shadow: 0 rem-calc(2) rem-calc(30) 0 rgba(0, 0, 0, 0.15);
$box-shadow-hover: 0 rem-calc(2) rem-calc(10) 0 rgba(0, 0, 0, 0.35);

.page-content {
	padding: 1.625rem 0;
}

.get-started {
	&__intro {
		text-align: center;
		margin-bottom: 1rem;

		@include breakpoint(xlarge) {
			text-align: left;
		}
	}

	&__list-wrapper {
		height: calc(90vh - #{rem-calc(450)}); // TODO: play with these to make sure they're good
		min-height: 15rem;
		margin: 0 auto;
		padding-bottom: 1rem;
		position: relative;
		overflow: hidden;

		@include breakpoint(xlarge) {
			height: calc(90vh - #{rem-calc(250)}); // TODO: play with these to make sure they're good
		}

		&::after {
			display: block;
			content: '';
			height: 2rem;
			width: 100%;
			background-image: linear-gradient(to top, #fff, transparent);
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 2;
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
		overflow: scroll;
	}

	&__list-item {
		display: flex;
	}

	/* TODO: Style this button and icon
	&__select-all-btn {

	}

	&__select-all-icon {

	}
	*/

	&__summary {
		margin: 0 0 2.5rem 0;
	}

	&__submit-btn {
		display: block;
		margin-left: auto;
	}
}

.country-filter {
	position: relative;
	margin: 0 0.5rem;

	&__label {
		@include visually-hidden();
	}

	&__input {
		background-color: $kiva-bg-darkgray;
		border-radius: 10rem;
		padding-left: rem-calc(16);
		padding-right: rem-calc(32);

		&:focus {
			background-color: #fff;
		}
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
		fill: $kiva-text-light;

		&:hover {
			fill: $kiva-text-dark;
		}
	}

	&__clear-icon {
		width: 1rem;
		height: 1rem;
	}
}

.country {
	margin: 0.5rem;

	&__label {
		border-radius: 10rem;
		background: #fff;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.75rem;
		margin: 0;
		line-height: 1;
		color: $kiva-text-dark;
		border: rem-calc(2) solid $kiva-stroke-gray;
		position: relative;

		&:hover {
			color: $kiva-textlink-hover;
			box-shadow: $box-shadow-hover;
		}
	}

	&__check-icon-wrapper {
		display: flex;
		width: rem-calc(32);
		height: rem-calc(32);
		padding: 0.2rem;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: rem-calc(3) solid #fff;
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
		width: rem-calc(34);
		height: rem-calc(34);
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

		&:checked + .country__label {
			background: $kiva-accent-blue;
			border-color: $kiva-accent-blue;
			color: #fff;

			.country__img {
				opacity: 0;
			}

			.country__check-icon-wrapper {
				opacity: 1;
			}

			.country__name {
				font-weight: $global-weight-bold;
			}
		}

		&:focus + .country__label {
			outline: 0;
			border-color: $kiva-accent-darkblue;
			box-shadow: $box-shadow-hover;
		}
	}
}
</style>
