<template>
	<div>
		<h2 class="tw-text-center tw-text-h1 tw-mb-2">
			Please cancel your existing auto deposit first:
		</h2>
		<p class="tw-text-center tw-mb-2">
			Thanks for your interest in Monthly Good. Because you have an existing Kiva subscription,
			you’ll need to cancel this via PayPal before signing up for Monthly Good.
		</p>
		<div class="tw-text-center" v-for="(sub, index) in legacySubscriptions" :key="index">
			<a :href="subscriptionCancelLink(sub)">Manage my auto deposit</a><br>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LegacySubscriberNotice',
	props: {
		legacySubscriptions: {
			type: Array,
			default() {
				return [];
			}
		},
	},
	methods: {
		subscriptionCancelLink(legacySubObject) {
			return `https://${this.$appConfig.paypal.url}/cgi-bin/webscr`
				+ `?cmd=_profile-recurring-payments&encrypted_profile_id=${legacySubObject.subscrId}`;
		}
	},
};
</script>
