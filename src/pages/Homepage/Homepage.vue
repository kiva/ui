<template>
	<www-page id="homepage">
		<hero-slideshow />
		<why-kiva />
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';
import HeroSlideshow from './HeroSlideshow';

export default {
	components: {
		WwwPage,
		WhyKiva,
		HeroSlideshow,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
