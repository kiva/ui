<template>
	<div class="row align-center gift-banner">
		<router-link
			to="/gifts/kiva-cards"
			class="banner-link"
			v-kv-track-event="['TopNav','click-Promo','Holiday Banner']"
		>
			<kv-icon name="present" class="present-icon"/>
			<div class="content">
				<span class="call-to-action-text">Buy $50 in Kiva Cards</span>, get a $25 bonus to lend!
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
