<template>
	<div class="row align-center gift-banner">
		<router-link to="/gifts" class="banner-link" v-kv-track-event="['TopNav','click-Promo','Holiday Banner']">
			<kv-icon name="present" class="present-icon"/>
			<div class="content">
				Give hope this holiday season.<br class="so">
				<span class="call-to-action-text">Give a Kiva gift</span>
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

<style lang='scss'>
@import 'settings';

.gift-banner {
	background-image: url('../../../../assets/images/backgrounds/tipbar-bg-small.jpg');
	background-position: bottom;

	.banner-link {
		display: flex;
		align-items: center;

		.present-icon {
			display: block;
			height: rem-calc(22);
			width: rem-calc(22);
			margin-right: rem-calc(10);
			margin-top: -0.2rem;
		}

		&:hover {
			.present-icon {
				stroke: $kiva-darkgreen;
			}
		}
	}
}
</style>
