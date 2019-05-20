<template>
	<div class="most-lent-country-holder">
		<div v-if="showFavoriteCountry">
			<div v-if="isLoaded">
				<category-row
					class="loan-category-row"
					:key="favoriteCountryCategory.topCountry"
					:loan-channel="favoriteCountryCategory"
					:items-in-basket="itemsInBasket"
					:row-number="-2"
					set-id="CASH-794-users-favorite-country"
					:is-logged-in="isLoggedIn"
				/>
			</div>
		</div>
		<loading-overlay v-if="!isLoaded" id="updating-overlay" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import favoriteCountry from '@/graphql/query/lendByCategory/favoriteCountry.graphql';
// use this for experiment assigment
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

export default {
	components: {
		CategoryRow,
		LoadingOverlay
	},
	inject: ['apollo'],
	data() {
		return {
			showFavoriteCountry: true,
			favoriteCountryLoans: [],
			favoriteCountryCategory: {
				id: 'us', // This will have to be the country abrevition for the user's most let to country
				// that's retured from the graphql query,
				name: 'Favorite Country loans',
				url: '/lend/favorite-country-loans', // required field
				loans: {
					values: [],
				},
			},
			isLoaded: false
		};
	},
	mounted() {
		// Read assignment for Favorite Countryt Loans EXP Setup
		const favoriteCountryEXP = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'favorite_country' }
		});
		this.showFavoriteCountry = _get(favoriteCountryEXP, 'experiment.version') === 'variant-a';

		if (this.showFavoriteCountry) {
			this.apollo.query({
				query: favoriteCountry,
				variables: {
					topCountry: this.topCountry,
				}
			}).then(({ data }) => {
				this.favoriteCountryCategory.my.topCountry = _get(data, 'my.recommendations.topCountry');
				this.topCountry = topCountry;
				this.isLoaded = true;
			});
		}

		if (this.topCountry !== '') {
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-794-May2019',
				this.showFavoriteCountry ? 'b' : 'a',
				topCountry.length
			);
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

// loading overlay overrides
#updating-overlay {
	background-color: $white;
	z-index: 500;
}

</style>
