<template>
	<div v-if="isLoggedIn" class="most-lent-country-holder" :class="{ 'favorite-country-loans-loaded': isLoaded }">
		<div v-if="showFavoriteCountry">
			<div v-if="isLoaded">
				<category-row
					class="loan-category-row"
					:key="favoriteCountryCategory.id"
					:loan-channel="favoriteCountryCategory"
					:items-in-basket="itemsInBasket"
					:row-number="-1"
					set-id="CASH-794-favorite-country"
					:is-logged-in="isLoggedIn"
					:show-category-description="showCategoryDescription"
					:show-expandable-loan-cards="showExpandableLoanCards"
					@scrolling-row="handleScrollingRow"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import favoriteCountryQuery from '@/graphql/query/lendByCategory/favoriteCountry.graphql';
import loanCardData from '@/graphql/query/loanCardData.graphql';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';

export default {
	components: {
		CategoryRow,
	},
	inject: ['apollo'],
	props: {
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		showCategoryDescription: {
			type: Boolean,
			default: false,
		},
		showExpandableLoanCards: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			favoriteCountryLoans: [],
			isLoaded: false
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: favoriteCountryQuery
			}).then(data => {
				const favoriteCountry = _get(data, 'data.my.recommendations.topCountry');
				// skip if not logged in or no favorite country
				if (favoriteCountry === undefined) return null;

				return client.query({
					query: loanCardData,
					variables: {
						filters: { country: favoriteCountry || 'us' },
						limit: 12
					},
				});
			}).then(loanData => {
				// skip if not logged in or no favorite country
				if (loanData === null) return null;
				return _get(loanData, 'data.lend.loans.values');
			});
		}
	},
	computed: {
		showFavoriteCountry() {
			if (this.favoriteCountryLoans.length > 0) {
				return true;
			}
			return false;
		},
		favoriteCountryCategory() {
			const loans = this.favoriteCountryLoans || [];
			const countryName = _get(this.favoriteCountryLoans, '[0].geocode.country.name');
			const countryTitle = countryName || 'your favorite country';
			const filterQuery = `?location=${countryName}`;
			return {
				id: 99, // This will have to be the country abrevition for the user's most let to country
				// that's retured from the graphql query,
				name: `Support more borrowers in ${countryTitle}`,
				url: `/lend/filter${countryName !== null ? filterQuery : ''}`, // required field
				loans: {
					values: loans,
				},
			};
		},
	},
	created() {
		const favoriteCountryCodeData = this.apollo.readQuery({
			query: favoriteCountryQuery
		});

		this.apollo.query({
			query: loanCardData,
			variables: {
				filters: { country: _get(favoriteCountryCodeData, 'my.recommendations.topCountry') || 'us' },
				limit: 12
			},
		}).then(loanData => {
			const favoriteCountryLoans = _get(loanData, 'data.lend.loans.values');
			if (favoriteCountryLoans !== undefined || favoriteCountryLoans.length > 0) {
				this.isLoaded = true;
				this.favoriteCountryLoans = favoriteCountryLoans;
			}
		});
	},
	methods: {
		handleScrollingRow() {
			this.$emit('scrolling-row');
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

</style>
