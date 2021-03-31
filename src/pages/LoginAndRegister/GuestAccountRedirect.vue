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
					my {
						userAccount {
							id
						}
					}
				}`,
			}).then(({ data }) => {
				// Redirect to /checkout if there are items in the basket, otherwise /portfolio
				const finalUrl = data?.shop?.nonTrivialItemCount > 0 ? '/checkout' : '/portfolio';
				// Add claimed=1 to the url to show a confirmation tip message on the page
				const query = { claimed: 1 };

				let redirectPath = finalUrl;

				// Check to see if user is authenticated
				if (!data?.my?.userAccount?.id) {
					redirectPath = '/ui-login';
					query.login_hint = 'login';
					query.doneUrl = finalUrl;
				}
				return Promise.reject({
					path: redirectPath,
					query,
				});
			});
		}
	}
};
</script>
