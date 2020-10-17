<template>
	<www-page class="two-step-verification" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h2 class="strong">
					2-step verification
				</h2>
			</div>
		</div>
		<router-view />
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
};
</script>

<style lang="scss">
@import 'settings';

.two-step-verification {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}
}

</style>
