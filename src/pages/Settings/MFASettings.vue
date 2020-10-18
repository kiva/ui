<template>
	<www-page class="security-login" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h2 class="strong">
					Security and login
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

.security-login {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}
}

</style>
