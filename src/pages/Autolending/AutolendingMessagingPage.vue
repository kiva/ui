<template>
	<div class="row autolending-messaging-content tw-prose">
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
					<a href="mailto:contactus@kiva.org?subject=Auto-lending%20opt-out%20page">contactus@kiva.org</a>.
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
					<!-- eslint-disable-next-line -->
					If you want to modify your auto-lending settings, please visit the auto-lending settings page or reach out to us directly at
					<a href="mailto:contactus@kiva.org?subject=Auto-lending%20disable%20page">contactus@kiva.org</a>.
				</p>
			</div>
		</template>
		<template v-if="action == 'pause'">
			<div data-test="pause-success" class="small-12 medium-10 columns" v-if="success && !isNaN(days)">
				<!-- Success -->
				<p>You have successfully paused auto-lending for {{ days }} {{ dayPluralString }}.</p>
				<!-- eslint-disable-next-line -->
				<p>Click <router-link to="/settings/autolending">here</router-link> to visit your auto-lending settings.</p>
			</div>
			<div data-test="pause-failure" class="small-12 medium-10 columns" v-if="!success || isNaN(days)">
				<!-- Failure -->
				<p>Oops - this link no longer works.</p>
				<p>
					<!-- eslint-disable-next-line -->
					Click <router-link to="/settings/autolending">here</router-link> to modify your auto-lending settings or reach out to us directly at
					<a href="mailto:contactus@kiva.org?subject=Auto-lending%20pause%20page">contactus@kiva.org</a>.
				</p>
			</div>
		</template>
	</div>
</template>

<script>

export default {
	name: 'AutolendingMessagingPage',
	props: {
		success: {
			type: Boolean,
			default: false
		},
		action: {
			type: String,
			default: ''
		},
		days: {
			type: Number,
			default: 0
		}
	},
	computed: {
		dayPluralString() {
			return this.days === 1 ? 'day' : 'days';
		}
	},
};
</script>
