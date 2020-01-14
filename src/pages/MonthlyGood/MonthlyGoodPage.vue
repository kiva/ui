<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				Monthly Good page placeholder text
				<landing-form :amount.sync="monthlyGoodAmount" :selected-category.sync="selectedCategory" />
				<landing-form :amount.sync="monthlyGoodAmount" :selected-category.sync="selectedCategory" />
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import LandingForm from './LandingForm';

export default {
	data() {
		return {
			monthlyGoodAmount: 25,
			selectedCategory: 'default',
		};
	},
	components: {
		WwwPage,
		LandingForm
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

</style>
