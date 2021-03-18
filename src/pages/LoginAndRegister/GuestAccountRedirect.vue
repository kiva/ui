<template>
	<div></div>
</template>

<script>
import gql from 'graphql-tag';

export default {
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: gql`query guestRedirect($basketId: String) {
					shop (basketId: $basketId) {
						id
						nonTrivialItemCount
					}
				}`,
			}).then(({ data }) => {
				// Redirect to /checkout if there are items in the basket, otherwise /portfolio
				// Add claimed=1 to the url to show a confirmation tip message on the page
				return Promise.reject({
					path: data?.shop?.nonTrivialItemCount > 0 ? '/checkout' : '/portfolio',
					query: { claimed: 1 },
				});
			});
		}
	}
};
</script>
