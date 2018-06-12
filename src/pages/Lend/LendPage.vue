<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Make a loan, change a life</h1>
				<p class="small-12 xlarge-9">Each Kiva loan helps people build a better
				future for themselves and their families.</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage
	},
	metaInfo: {
		title: 'Lend page'
	}
};
</script>

<style lang="scss">
@import 'settings';

.heading-region {
	margin-top: 1.25rem;
}
</style>
