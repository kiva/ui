<template>
	<div>
		<signup-waitlist v-if="!isEligibleForCausesSignup" />
		<signup-form v-if="isEligibleForCausesSignup" />
	</div>
</template>

<script>
import gql from 'graphql-tag';
import logReadQueryError from '@/util/logReadQueryError';

import SignupWaitlist from '@/pages/Causes/SignupWaitlist';
import SignupForm from '@/pages/Causes/SignupForm';

import authenticationQuery from '@/graphql/query/authenticationQuery.graphql';

const pageQuery = gql`query causesSignupEligibilityQuery {
	my {
		subscriptions {
			values {
				id
				subscrId
			}
		}
		autoDeposit {
			id
			isSubscriber
		}
		lender {
			id
			loans {
				totalCount
			}
		}
	}
}`;

export default {
	props: {
		cause: {
			type: String,
			default: 'climate',
			validator: value => {
				return ['climate', 'education', 'women'].indexOf(value) !== -1;
			}
		},
	},
	components: {
		SignupForm,
		SignupWaitlist,
	},
	data() {
		return {
			// user flags
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasLegacySubscription: false,
			hasMadeLoan: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, { route }) {
			return client.query({
				query: authenticationQuery,
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				if (!data.my) {
					throw new Error('api.authenticationRequired');
				}
				return client.query({ query: pageQuery });
			}).catch(() => {
				// Auth error will be caught here, redirect to login.
				return Promise.reject({
					path: `/ui-login?cause=${this.cause}`,
					query: { force: true, doneUrl: route.fullPath }
				});
			});
		}
	},
	created() {
		try {
			const pageQueryResult = this.apollo.readQuery({
				query: pageQuery,
			});
			this.isMonthlyGoodSubscriber = pageQueryResult?.my?.autoDeposit?.isSubscriber ?? false;
			this.hasAutoDeposits = pageQueryResult?.my?.autoDeposit ?? false;
			const legacySubs = pageQueryResult?.my?.subscriptions?.values ?? [];
			this.hasLegacySubscription = legacySubs.length > 0;
			this.hasMadeLoan = pageQueryResult?.my?.lender?.loanCount > 0;
		} catch (e) {
			logReadQueryError(e, 'Causes Signup causesSignupEligibilityQuery');
		}
	},
	computed: {
		isEligibleForCausesSignup() {
			/** A user is eligible if:
			* no existing MG subscription
			* no legacy subscription
			* no have auto-deposit
			* no traditional loan purchases
			*/
			return !this.isMonthlyGoodSubscriber && !this.hasAutoDeposits && !this.hasAutoDeposits && !this.hasMadeLoan;
		}
	},
};
</script>

<style lang="scss">
</style>
