<template>
	<div class="row align-center gift-banner">
		<router-link
			to="/gifts/kiva-cards"
			class="banner-link"
			v-kv-track-event="['TopNav','click-Promo','Default Banner']"
		>
			<kv-icon name="present" class="present-icon" />
			<div class="content">
				Give hope this holiday season.<br class="so">
				<span class="call-to-action-text">Give a Kiva Card</span>
			</div>
		</router-link>
	</div>
</template>

<script>
import KvIcon from '#src/components/Kv/KvIcon';

export default {
	name: 'DefaultPromoBanner',
	components: {
		KvIcon
	},
};
</script>
