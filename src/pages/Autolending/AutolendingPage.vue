<template>
	<www-page class="autolending">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<!-- main toggles -->
		<!-- hr or border -->
		<!-- basic criteria (counter starts here) -->
		<!-- hr or border -->
		<!-- advanced settings -->
		<!-- save button, only visible when changes exist -->
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
// import query from '@/graphql/query/autolending.graphql';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
	},
	// apollo: {
	// 	query,
	// 	preFetch: true,
	// 	result({ data }) {
	// 		console.log(data);
	// 	},
	// },
};
</script>

<style lang="scss">
@import 'settings';

.autolending {
	background-color: $kiva-bg-lightgray;

	.title-area {
		padding: 1.625rem 0;
		background-color: $white;
	}
}
</style>
