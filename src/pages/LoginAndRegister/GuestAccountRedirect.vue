<template>
	<div></div>
</template>

<script>
import { gql } from '@apollo/client';

export default {
	name: 'GuestAccountRedirect',
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: gql`query guestRedirect($basketId: String) {
					shop (basketId: $basketId) {
						id
						nonTrivialItemCount
					}
					my {
						id
						userAccount {
							id
						}
					}
				}`,
			}).then(({ data }) => {
				// Redirect to /checkout if there are items in the basket, otherwise /portfolio
				const path = data?.shop?.nonTrivialItemCount > 0 ? '/checkout' : '/portfolio';
				// Add claimed=1 to the url to show a confirmation tip message on the page
				const query = { claimed: 1 };
				const queryString = Object.keys(query)
					.map(key => `${key}=${query[key]}`)
					.join('&');

				// Check to see if user is authenticated
				if (!data?.my?.userAccount?.id) {
					return Promise.reject({
						path: '/ui-login',
						query: {
							loginHint: `login|${JSON.stringify({
								guest: true,
							})}`,
							doneUrl: `${path}?${queryString}`,
						},
					});
				}
				return Promise.reject({
					path,
					query,
				});
			});
		}
	}
};
</script>
