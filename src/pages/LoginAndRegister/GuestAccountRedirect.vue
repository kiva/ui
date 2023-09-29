<template>
	<div></div>
</template>

<script>
import { gql } from '@apollo/client';
import { GUEST_COMMENT_COMMENT, GUEST_COMMENT_LOANID } from '@/plugins/guest-comment-mixin';

export default {
	name: 'GuestAccountRedirect',
	apollo: {
		preFetch(config, client, { cookieStore }) {
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
				// Add claimed=1 to the url to show a confirmation tip message on the page
				const query = { claimed: 1 };

				// Redirect to /checkout if there are items in the basket
				// Redirect to loan page if there is a pending guest comment
				// Otherwise /portfolio
				let path = '';
				if (data?.shop?.nonTrivialItemCount > 0) {
					path = '/checkout';
				} else if (cookieStore.get(GUEST_COMMENT_COMMENT) && cookieStore.get(GUEST_COMMENT_LOANID)) {
					path = `/lend/${cookieStore.get(GUEST_COMMENT_LOANID)}`;
				} else {
					path = '/portfolio';
				}

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
