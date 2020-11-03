<template>
	<kv-settings-card title="2-Step verification">
		<template v-slot:icon>
			<!-- TODO: THIS ICON IS A PLACEHOLDER
					Get correct icon assest from design, or remove this KvIcon -->
			<kv-icon
				class="icon"
				title="Auto-lending On"
				name="auto-icon-on"
			/>
		</template>
		<template v-slot:content>
			<h3>
				Status:
				<span :class="`mfa-${MFAStatus}`">{{ MFAStatus }}</span>
			</h3>
			<p>
				Protect your Kiva account with an extra layer of security by requiring access
				to your phone. Once configured, you'll be required to enter
				<span class="strong">both your password and an authenication code from your mobile phone</span>
				in order to access your account.
			</p>
			<kv-button class="secondary smallest">
				Manage 2-step verification
			</kv-button>
		</template>
	</kv-settings-card>
</template>

<script>
// import gql from 'graphql-tag';

import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';

// TODO: This will be the query checking if user has
// MFA enabled/disabled
// const pageQuery = gql`query settingsQuery {
// 	my {
// 		autoDeposit {
// 			id
// 			status
// 			isSubscriber
// 		}
// 	}
// }`;

export default {
	components: {
		KvSettingsCard,
		KvIcon,
		KvButton,
	},
	data() {
		return {
			isMFAActive: false,
		};
	},
	computed: {
		MFAStatus() {
			if (this.isMFAActive) {
				return 'on';
			}
			return 'off';
		}

	},
	inject: ['apollo'],
	// apollo: {
	// 	query: pageQuery,
	// 	preFetch: true,
	// 	result({ data }) {
	// 		console.log('data', data);
	// 		// this.isMFAActive = data.whatever
	// 	}
	// }
};
</script>

<style lang="scss" scoped>
@import 'settings';

.mfa-off {
	color: $kiva-accent-red;
	text-transform: capitalize;
}

.mfa-on {
	color: $kiva-green;
	text-transform: capitalize;
}
</style>
