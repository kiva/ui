<template>
	<!-- Small promo banner -->
	<div class="hide-for-xxlarge header-promo-small">
		<a id="header-promo-content" href="#" >
			<div class="content">
				<span>Make spirits bright this holiday season.</span>
				<span class="call-to-action-text">Give a Kiva gift.</span>
			</div>
		</a>
	</div>
</template>
<script>

export default {
	components: {

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

.header-promo-small {
	text-align: center;
	background: $dark-green;
	font-size: $small-font-size;

	a {
		color: $kiva-accent-green;
	}
}
</style>
