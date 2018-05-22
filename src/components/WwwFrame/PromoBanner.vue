<template>
	<!-- Large promo banner -->
	<div class="show-for-xxlarge header-promo-large">
		<a id="header-promo-content" href="#" >
			<kv-icon name="kiva-card" class="kiva-card-icon show-for-xxlarge"/>
			<div class="content">
				<div>Make spirits bright this holiday season.</div>
				<div class="call-to-action-text">Give a Kiva gift.</div>
			</div>
		</a>
	</div>
</template>
<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	data() {
		return {
			// Need to hook this up to settings Manager
			isPromoBannerActive: true
		};
	},
	methods: {
		onPageShow() {

		}
	}
};
</script>
<style lang='scss'>
@import 'settings';

.header-promo-large {
	position: relative;
	top: rem-calc(-66);
	margin-top: .6875rem;

	a {
		text-decoration: none;
		color: $light-green;
	}

	.kiva-card-icon {
		height: rem-calc(45);
		width: rem-calc(45);
		transform: rotate(-10deg);
		float: left;
		margin-left: rem-calc(50);
	}

	.content {
		font-size: $small-font-size;
		font-weight: bold;
		color: $dark-green;
		text-align: center;
		line-height: 1.357rem; // I want to use $small-line-height here
		max-width: 95%;
		z-index: 10;
	}
}
</style>
