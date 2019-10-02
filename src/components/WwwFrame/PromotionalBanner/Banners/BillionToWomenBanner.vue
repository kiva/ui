<template>
	<div class="row align-center gift-banner">
		<router-link
			to="/monthlygood"
			class="banner-link"
			v-kv-track-event="['TopNav','click-Promo','Monthly Good Sept 2019']"
		>
			<kv-icon name="monthly-good" class="monthly-good-icon" />
			<div class="content">
				Make a bigger impact with a<br class="smo">
				Monthly Good subscription. <span class="call-to-action-text">Sign up.</span>
			</div>
		</router-link>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
};
</script>
