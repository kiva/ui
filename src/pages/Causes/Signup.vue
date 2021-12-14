<template>
	<div>
		<signup-waitlist v-if="!isEligibleForCausesSignup || !isBeta" />
		<signup-form v-if="isEligibleForCausesSignup && isBeta" :cause="cause" />
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
			loanCount
		}
	}
	mySubscriptions(includeDisabled: true) {
		values {
			id
			enabled
			category {
				id
				subscriptionType
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
			mySubscriptions: []
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, { route }) {
			// TODO temporary beta query param
			if (route.query.beta !== 'true') {
				return Promise.resolve({});
			}
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
					path: `/ui-login?cause=${route.query.cause}`,
					query: { force: true, doneUrl: route.fullPath }
				});
			});
		}
	},
	created() {
		// TODO temporary beta query param
		if (this.$route.query.beta === 'true') {
			try {
				const pageQueryResult = this.apollo.readQuery({
					query: pageQuery,
				});
				this.isMonthlyGoodSubscriber = pageQueryResult?.my?.autoDeposit?.isSubscriber ?? false;
				this.hasAutoDeposits = pageQueryResult?.my?.autoDeposit ?? false;
				const legacySubs = pageQueryResult?.my?.subscriptions?.values ?? [];
				this.hasLegacySubscription = legacySubs.length > 0;
				this.hasMadeLoan = pageQueryResult?.my?.lender?.loanCount > 0;
				this.mySubscriptions = pageQueryResult?.mySubscriptions?.values ?? [];
			} catch (e) {
				logReadQueryError(e, 'Causes Signup causesSignupEligibilityQuery');
			}
		}
	},
	computed: {
		// Temporary query param feature flag
		isBeta() {
			return this.$route.query.beta === 'true';
		},
		isEligibleForCausesSignup() {
			/** A user is eligible if:
			* no existing MG subscription
			* no legacy subscription
			* no have auto-deposit
			* no traditional loan purchases and also has never had a cause subscription
			*/
			const causesSubscriptions = this.mySubscriptions.filter(
				subscription => subscription.category.subscriptionType === 'CAUSES'
			);

			const hasActiveCauseSubscription = !!causesSubscriptions.find(
				subscription => subscription.enabled
			);
			const hasInactiveCauseSubscription = !!causesSubscriptions.find(
				subscription => !subscription.enabled
			);
			return !hasActiveCauseSubscription
				&& !this.isMonthlyGoodSubscriber
				&& !this.hasAutoDeposits
				&& !this.hasLegacySubscription
				&& (!this.hasMadeLoan || hasInactiveCauseSubscription);
		}
	},
};
</script>

<style lang="scss">
</style>
