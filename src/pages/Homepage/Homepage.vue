<template>
	<www-page>
		<hero-slideshow />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>NEW UI HOMEPAGE</h1>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import HeroSlideshow from './HeroSlideshow';

export default {
	components: {
		HeroSlideshow,
		WwwPage
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
