<template>
	<div class="row autolending-messaging-content">
		<template v-if="action == 'opt-out'">
			<div data-test="opt-out-success" class="small-12 medium-10 columns" v-if="success">
				<!-- Success -->
				<p>You’re successfully opted out of auto-lending.</p>
				<p>
					If you change your mind, you can always turn it on in your <router-link to="/settings/autolending">
						auto-lending settings page
					</router-link>.
				</p>
			</div>

			<div data-test="opt-out-failure" class="small-12 medium-10 columns" v-if="!success">
				<!-- Failure -->
				<p>Oops - this link no longer works.</p>
				<p>
					If you want to opt-out of auto-lending, please let us know at
					<a href="mailto:contactus@kiva.org?subject=Auto-lending%20opt-out%20page">contactus@kiva.org</a>
				</p>
			</div>
		</template>
		<template v-if="action == 'disable'">
			<div data-test="disable-success" class="small-12 medium-10 columns" v-if="success">
				<!-- Success -->
				<p>You successfully turned off auto-lending.</p>
				<!-- eslint-disable-next-line -->
				<p>Want to turn it back on or customize your settings? Just click <router-link to="/settings/autolending">here</router-link>.</p>
			</div>

			<div data-test="disable-failure" class="small-12 medium-10 columns" v-if="!success">
				<!-- Failure -->
				<p>Oops - this link no longer works.</p>
				<p>
					If you want to turn off auto-lending, please let us know at
					<a href="mailto:contactus@kiva.org?subject=Auto-lending%20disable%20page">contactus@kiva.org</a>
				</p>
			</div>
		</template>
	</div>
</template>

<script>

export default {
	props: {
		success: {
			type: Boolean,
			default: false
		},
		action: {
			type: String,
			default: ''
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.autolending-opt-out-content {
	padding: 2rem 0 6rem;
}
</style>
