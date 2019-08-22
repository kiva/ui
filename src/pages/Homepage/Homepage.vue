<template>
	<www-page id="homepage">
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>NEW UI HOMEPAGE</h1>
				<why-kiva />
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';

export default {
	components: {
		WwwPage,
		WhyKiva,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
