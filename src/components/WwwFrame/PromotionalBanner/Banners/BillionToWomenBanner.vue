<template>
	<div class="row align-center gift-banner">
		<router-link
			to="/lend/lendingReward?lending_reward=264&doneUrl=lend-by-category/women"
			class="banner-link"
			v-kv-track-event="['TopNav','billion-to-women-2019','click-billion-to-women-banner-promo']"
		>
			<div class="content">
				<span class="call-to-action-text">Click here</span>
				to get a free $25 lending credit<br class="smo">
				when you make a loan this week.
			</div>
		</router-link>
	</div>
</template>

<script>
// import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		// KvIcon
	},
};
</script>
