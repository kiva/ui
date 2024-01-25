<template>
	<kv-comments-container :activity-id="activityId" />
</template>

<script>
import KvCommentsContainer from '~/@kiva/kv-components/vue/KvCommentsContainer';

export default {
	name: 'CommentsContainer',
	components: {
		KvCommentsContainer
	},
	props: {
		/**
		 * Contentful content object
		 */
		content: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		activityId() {
			return this.content?.dataObject?.activityId;
		},
	},
};
</script>
