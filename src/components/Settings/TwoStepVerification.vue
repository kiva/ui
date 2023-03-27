<template>
	<div class="two-step-card-wrapper">
		<kv-settings-card
			title="2-Step verification"
			class="two-step-card-wrapper__two-step-card"
		>
			<template #content>
				<h3 class="tw-mb-2">
					Status:
					<kv-loading-placeholder
						class="tw-inline-block tw-w-4"
						style="top: 0.125rem; height: 1.2rem;"
						v-if="isLoading"
					/>
					<span
						v-if="!isLoading"
						class="tw-capitalize"
						:class="{
							'tw-text-danger' : MFAStatus === 'off',
							'tw-text-brand' : MFAStatus === 'on'
						}"
					>
						{{ MFAStatus }}
					</span>
				</h3>
				<p class="tw-mb-4">
					Protect your Kiva account with an extra layer of security by requiring access
					to your phone. Once configured, you'll be required to enter
					<span class="tw-font-medium">
						both your password and an authenication code from your mobile phone
					</span>
					in order to access your account.
				</p>
				<kv-button
					to="/settings/security/mfa"
				>
					Manage 2-step verification
				</kv-button>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import * as Sentry from '@sentry/vue';
import { gql } from '@apollo/client';

import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const pageQuery = gql`query mfaQuery($mfa_token: String!) {
	my {
		id
		authenticatorEnrollments(mfa_token: $mfa_token) {
			id
			active
			authenticator_type
		}
	}
}`;

export default {
	name: 'TwoStepVerification',
	components: {
		KvSettingsCard,
		KvButton,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			isMFAActive: false,
			isLoading: true,
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
	inject: ['apollo', 'kvAuth0'],
	mounted() {
		this.isLoading = true;
		if (this.kvAuth0.enabled) {
			this.kvAuth0.checkSession({ skipIfUserExists: true })
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					return this.apollo.query({
						query: pageQuery,
						variables: {
							mfa_token: token
						}
					});
				})
				.then(result => {
					if (result.errors) {
						throw result.errors;
					}
					const authEnrollments = result.data.my.authenticatorEnrollments;
					for (let i = 0; i < authEnrollments.length; i += 1) {
						if (authEnrollments[i].active === true) {
							this.isMFAActive = true;
							this.isLoading = false;
							return;
						}
					}
					this.isLoading = false;
				})
				.catch(err => {
					console.error(err);
					this.$showTipMsg(
						'There was an error when getting your 2-step verification status. '
						+ 'Please refresh the page and try again.',
						'error'
					);
					try {
						Sentry.captureException(err?.[0]?.extensions?.exception || err);
					} catch (e) {
						// no-op
					}
				});
		}
	}
};
</script>
