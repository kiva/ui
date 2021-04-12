<template>
	<kv-checkbox
		id="pushNotifications"
		name="pushNotifications"
		v-model="pushNotificationsActive"
		@change="changePushSetting"
	>
		Receive notifications on this device
	</kv-checkbox>
</template>

<script>
import KvCheckbox from '@/components/Kv/KvCheckbox';
import { registerServiceWorker, isSubscribed, unsubscribe } from '@/util/pushNotificationsManager';

export default {
	data() {
		return {
			pushNotificationsActive: false
		};
	},
	components: {
		KvCheckbox,
	},
	inject: ['apollo'],
	mounted() {
		isSubscribed().then(() => {
			this.pushNotificationsActive = true;
		}).catch(() => {
			this.pushNotificationsActive = false;
		});
	},
	methods: {
		changePushSetting(value) {
			if (value) {
				registerServiceWorker()
					.then(() => {
						this.$showTipMsg('You have subscribed to notifications from Kiva.', 'info');
						this.$kvTrackEvent('Push Notification', 'subscribe', this.$route.path);
					})
					.catch(error => {
						this.$showTipMsg(error, 'warning');
					});
			} else {
				unsubscribe()
					.then(() => {
						this.$showTipMsg('You have unsubscribed to notifications from Kiva.', 'info');
						this.$kvTrackEvent('Push Notification', 'unsubscribe', this.$route.path);
					})
					.catch(error => {
						this.$showTipMsg(error, 'warning');
					});
			}
		}
	}
};
</script>
