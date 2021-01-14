<template>
	<div class="two-step-card-wrapper">
		<kv-settings-card
			title="2-Step verification"
			class="two-step-card-wrapper__two-step-card"
		>
			<template v-slot:content>
				<h3 class="strong">
					Status:
					<kv-loading-placeholder
						class="two-step-card-wrapper__two-step-card--loading"
						v-if="isLoading"
					/>
					<span
						v-if="!isLoading"
						:class="`two-step-card-wrapper__two-step-card--mfa-${MFAStatus}`"
					>
						{{ MFAStatus }}
					</span>
				</h3>
				<p>
					Protect your Kiva account with an extra layer of security by requiring access
					to your phone. Once configured, you'll be required to enter
					<span class="strong">both your password and an authenication code from your mobile phone</span>
					in order to access your account.
				</p>
				<kv-button
					to="/settings/security/mfa"
					class="smallest"
				>
					Manage 2-step verification
				</kv-button>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
import gql from 'graphql-tag';

import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';

const pageQuery = gql`query mfaQuery($mfa_token: String!) {
	my {
		authenticatorEnrollments(mfa_token: $mfa_token) {
			id
			active
			authenticator_type
		}
	}
}`;

export default {
	components: {
		KvSettingsCard,
		KvButton,
		KvLoadingPlaceholder,
	},
	data() {
		return {
			isMFAActive: false,
			isLoading: false,
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
			this.kvAuth0.checkSession()
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
					const authEnrollments = result.data.my.authenticatorEnrollments;
					for (let i = 0; i < authEnrollments.length; i += 1) {
						if (authEnrollments[i].active === true) {
							this.isMFAActive = true;
							this.isLoading = false;
							return;
						}
					}
					this.isLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.two-step-card-wrapper {
	&__two-step-card {
		&--mfa-off {
			color: $kiva-accent-red;
			text-transform: capitalize;
		}

		&--mfa-on {
			color: $kiva-green;
			text-transform: capitalize;
		}

		&--loading {
			width: 2rem;
			height: 1.2rem;
			display: inline-block;
			top: 0.125rem;
		}
	}
}
</style>
