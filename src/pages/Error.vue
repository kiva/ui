<template>
	<www-page class="ui-error-page">
		<div class="page-content row">
			<div>
				<h1>Error</h1>
				<div>error code: {{ error }}</div>
				<div>error description: {{ errorDescription }}</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: { WwwPage },
	inject: ['apollo'],
	metaInfo: {
		title: 'Error'
	},
	data() {
		return {
			error: this.$route.query.error,
			errorDescription: this.$route.query.error_description,
			clientId: this.$route.query.client_id,
		};
	}
};
</script>

<style lang="scss">
@import 'settings';

.ui-error-page {
	.page-content {
		text-align: center;
		padding: 1.625rem 0;
	}
}

</style>
