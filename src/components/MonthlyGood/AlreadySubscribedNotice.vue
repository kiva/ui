<template functional>
	<div v-if="!props.onetime">
		<h1 class="tw-text-center tw-text-h2 tw-mb-2">
			You're already signed up for Monthly Good
		</h1>
		<p class="tw-text-center">
			Changes to this contribution can be made in your
			<router-link to="/settings/subscriptions">
				subscription settings
			</router-link>.
		</p>
	</div>
	<div v-else>
		<h2 class="tw-text-center tw-mb-2">
			You're signed up for Monthly Good, so we cannot process a one-time contribution on your account.
		</h2>
		<p class="tw-text-center tw-mb-2">
			<!-- eslint-disable-next-line max-len -->
			Instead, you can change your <router-link href="/settings/subscriptions">
				subscription settings
			</router-link> to direct your Monthly Good contribution to COVID-19 support loans?
		</p>
	</div>
</template>
