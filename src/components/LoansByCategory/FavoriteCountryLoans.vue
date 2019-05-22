<template>
	<div class="most-lent-country-holder" :class="{ 'favorite-country-loans-loaded': isLoaded }">
		<div>Testing</div>
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
	data() {
		return {
			favoriteCountryLoans: [],
			favoriteCountryCategory: {
				id: 99, // This will have to be the country abrevition for the user's most let to country
				// that's retured from the graphql query,
				name: 'Favorite Country category loans',
				url: '/lend/favorite-country-loans', // required field
				loans: {
					values: [],
				},
			},
			isLoaded: false
		};
	},
	apollo: {
		// TODO: Need to fold in a check for logged in
		preFetch(config, client) {
			// need to add check to verify the user is logged in
			return client.query({
				query: favoriteCountryQuery
			}).then(data => {
				console.log('data', data);
				const favoriteCountry = _get(data, 'data.my.recommendations.topCountry');
				console.log('favorite country', favoriteCountry);
				return client.query({
					query: loanCardData,
					variables: {
						filters: { country: 'FJ' },
						limit: 12
					},
				});
			}).then(loanData => {
				const favoriteCountryLoans = _get(loanData, 'data.lend.loans.values');
				if (favoriteCountryLoans !== undefined || favoriteCountryLoans.length > 0) {
					this.favoriteCountryCategory.loans.values = favoriteCountryLoans;
				}
				// console.log('favorite country category', this.favoriteCountryCategory);
				// this.isLoaded = true;
				console.log('2nd then statement in prefetch', loanData);
				return favoriteCountryLoans;
			});
		}
	},
	computed: {
		showFavoriteCountry() {
			if (this.favoriteCountryCategory.loans.values.length > 0
				|| this.favoriteCountryCategory.loans.values !== null) {
				return false;
			}
			return true;
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

</style>
