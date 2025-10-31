<template>
	<div></div>
</template>

<script>
import { gql } from 'graphql-tag';
import { GUEST_COMMENT_COMMENT, GUEST_COMMENT_LOANID } from '#src/plugins/guest-comment-mixin';
import parseGivingFundCookie from '#src/util/givingFundUtils';

export default {
	name: 'GuestAccountRedirect',
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
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
				// Redirect to giving fund if there is a giving fund cookie
				// Otherwise /portfolio
				let path = '';
				if (data?.shop?.nonTrivialItemCount > 0) {
					path = '/checkout';
				} else if (cookieStore.get(GUEST_COMMENT_COMMENT) && cookieStore.get(GUEST_COMMENT_LOANID)) {
					path = `/lend/${cookieStore.get(GUEST_COMMENT_LOANID)}`;
				} else if (cookieStore.get('newGuestGivingFund')) {
					// get giving fund info from cookie
					const guestGivingFundCookie = cookieStore.get('newGuestGivingFund');
					const givingFundData = parseGivingFundCookie(guestGivingFundCookie);
					// use fundId to build url
					if (givingFundData?.fundId) {
						path = `/gf/${givingFundData.fundId}`;
					}
					// apply optional action query param
					if (givingFundData?.action) {
						query.action = givingFundData.action;
					}
				} else {
					path = '/portfolio';
				}

				const queryString = Object.keys(query)
					.map(key => `${key}=${query[key]}`)
					.join('&');

				// Check to see if user is authenticated
				if (!data?.my?.userAccount?.id) {
					const username = route?.query?.username ?? '';

					return Promise.reject({
						path: '/ui-login',
						query: {
							loginHint: `login|${JSON.stringify({
								guest: true,
								username: encodeURIComponent(username),
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
