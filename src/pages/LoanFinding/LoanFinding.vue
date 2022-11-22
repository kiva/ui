<template>
	<div class="tw-max-w-5xl tw-mx-auto">
		New loan finding page
	</div>
</template>

<script>
import userInfo from '@/graphql/query/userInfo.graphql';

export default {
	name: 'LoanFinding',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			userInfo: {}
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: userInfo
			}).then(({ data }) => {
				this.userInfo = data?.my?.userAccount ?? {};
			});
		},
	},
};
</script>
