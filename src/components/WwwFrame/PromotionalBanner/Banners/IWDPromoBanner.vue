<template>
	<div class="row align-center iwd-banner">
		<router-link
			to="/lend/international-womens-day"
			class="banner-link"
			v-kv-track-event="['TopNav','click-Promo','IWD 2019 Banner']"
		>
			<kv-icon name="iwd-flower" class="iwd-flower-icon"/>
			<div class="content">
				<span class="call-to-action-text">Help us fund 10,000 loans to women</span>
				this International Women’s Day
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
