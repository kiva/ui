<template>
	<www-page :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<div class="row autolending-opt-out-content">
			<div class="small-12 medium-10 columns" v-if="success" id="autolending-opt-out-success">
				<!-- Success -->
				<p>You’re successfully opted out of auto-lending.</p>
				<p>
					If you change your mind, you can always turn it on in your <router-link to="/settings/autolending">
						auto-lending settings page
					</router-link>.
				</p>
			</div>

			<div class="small-12 medium-10 columns" v-if="!success" id="autolending-opt-out-failure">
				<!-- Failure -->
				<p>Oops - this link no longer works.</p>
				<p>
					If you want to opt-out of auto-lending, please let us know at
					<a href="mailto:contactus@kiva.org?subject=Auto-lending%20opt-out%20page">contactus@kiva.org</a>
				</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	props: {
		success: {
			type: Boolean,
			default: false
		}
	},
	components: {
		WwwPage,
	},
	data() {
		return {
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.autolending-opt-out-content {
	padding: 2rem 0 6rem;
}

.title-area {
	padding: 1.625rem 0;
	margin-bottom: 2rem;
	background-color: $white;
}
</style>
