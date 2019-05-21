<template>
	<div class="most-lent-country-holder">
		<div>Testing</div>
		<div v-if="showFavoriteCountry">
			<div v-if="isLoaded">
				<category-row
					class="loan-category-row"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import favoriteCountryQuery from '@/graphql/query/lendByCategory/favoriteCountry.graphql';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';

export default {
	components: {
		CategoryRow,
	},
	inject: ['apollo'],
	data() {
		return {
			showFavoriteCountry: true,
			// favoriteCountryCategory: {
			// 	id: '', // This will have to be the country abrevition for the user's most let to country
			// 	// that's retured from the graphql query,
			// 	name: 'Favorite Country category loans',
			// 	url: '/lend/favorite-country-loans', // required field
			// 	loans: {
			// 		values: [],
			// 	},
			// },
			isLoaded: false
		};
	},
	apollo: {
		preFetch(config, client) {
			// need to add check to verify the user is logged in
			return client.query({
				query: favoriteCountryQuery
			}).then(data => {
				console.log('data', data);
				const favoriteCountry = _get(data, 'data.my.recommendations.topCountry');
				console.log('favorite country', favoriteCountry);
			}).then(favoriteCountry => {
				// Now that I have the topCountry I'll need to fetch loans from that country here
				console.log('2nd then statement in prefetch', favoriteCountry);
			});
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

</style>
