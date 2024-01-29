<template>
	<kv-comments-container :activity-id="activityId" />
</template>

<script>
import activityFeedTokenQuery from '@/graphql/query/activityFeedToken.graphql';
import KvCommentsContainer from '~/@kiva/kv-components/vue/KvCommentsContainer';

export default {
	name: 'CommentsContainer',
	components: {
		KvCommentsContainer
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		/**
		 * Contentful content object
		 */
		content: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			activityFeedClientToken: undefined,
		};
	},
	computed: {
		activityId() {
			return this.content?.dataObject?.activityId;
		},
	},
	methods: {
		getActivityFeedToken: async () => {
			this.apollo.query({
				query: activityFeedTokenQuery,
				variables: {
					visitorId: this.cookieStore.get('uiv'),
				}
			}).then(response => {
				this.activityFeedClientToken = response?.data?.activityFeedClientToken?.token;
			});
		},
	},
	mounted() {
		this.getActivityFeedToken();
	},
};
</script>
