<template>
	<www-page id="homepage">
		THIS IS THE UI HOMEPAGE
		<hero-slideshow />
		<why-kiva />
		<category-grid />
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';
import HeroSlideshow from './HeroSlideshow';
import CategoryGrid from '@/components/Homepage/CategoryGrid';

export default {
	components: {
		WwwPage,
		WhyKiva,
		HeroSlideshow,
		CategoryGrid,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
