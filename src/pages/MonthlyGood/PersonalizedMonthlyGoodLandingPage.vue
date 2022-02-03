<template>
	<www-page>
		TESTING
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';

const pageQuery = gql`
	query monthlyGoodPersonalizedLandingPage {
		contentful {
			entries(contentType: "page", contentKey: "/lp/monthlygood/personalized")
		}
	}
`;

export default {
	metaInfo: {
		title: 'Personalized Monthly Good',
	},
	components: {
		WwwPage,
	},
	props: {
	},
	data() {
		return {
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client
				.query({
					query: pageQuery,
				})
				.then(() => {
					return Promise.all([
						// eslint-disable-next-line max-len
						client.query({ query: experimentQuery, variables: { id: 'EXP-VUE-399-subscription-appeal-personalization' } })
					]);
				});
		},
		result({ data }) {
			console.log('data', data);

			// Core-399 Subscriptions Appeal Personalization Experiment
			const subscriptionAppealPersonalization = this.apollo.readFragment({
				id: 'EXP-VUE-399-subscription-appeal-personalization',
				fragment: experimentVersionFragment,
			}) || {};

			if (subscriptionAppealPersonalization.version
				&& subscriptionAppealPersonalization.version !== 'unassigned'
				&& this.subscriptionAppealPersonalization === 'shown'
			) {
				this.$kvTrackEvent('MonthlyGood', 'EXP-CORE-399-Feb2022', 'a');
			}
		},
	},
};
</script>
