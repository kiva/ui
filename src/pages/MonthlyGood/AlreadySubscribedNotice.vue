<template functional>
	<div v-if="!props.onetime">
		<h1 class="text-center impact-text">
			You're already signed up for Monthly Good
		</h1>

		<p class="text-center">
			Changes to this contribution can be made in your
			<a href="/settings/subscriptions">subscription settings</a>.
		</p>
	</div>
	<div v-else>
		<h2 class="text-center">
			You're signed up for Monthly Good, so we cannot process a one-time contribution on your account.
		</h2>

		<p class="text-center">
			<!-- eslint-disable-next-line max-len -->
			Instead, you can change your <a href="/settings/subscriptions">subscription settings</a> to direct your Monthly Good contribution to COVID-19 support loans?
		</p>
	</div>
</template>
