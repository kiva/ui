<template>
	<www-page>
		TESTING
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
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
				});
		},
		result({ data }) {
			console.log('data', data);
		},
	},
	mounted() {
		this.$kvTrackEvent('MonthlyGood', 'EXP-CORE-399-Feb2022', 'b');
	}
};
</script>
