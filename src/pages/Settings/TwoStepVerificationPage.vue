<template>
	<www-page class="two-step-verification" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="two-step-verification__title-area">
			<div class="row column">
				<h1>
					2-step verification
				</h1>
			</div>
		</div>
		<div class="row">
			<div class="column small-12 large-8">
				<!--
					Toggle MFA off settings card
				-->
				<kv-settings-card
					title="2-step verification is turned on"
					v-if="isMfaActive"
				>
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
						<div>
							<p>
								We'll ask you for your password and verification code from your
								mobile phone in order to log into your Kiva account.
							</p>
							<kv-button
								class="text-link"
								@click.native.prevent="checkLastLoginTime"
							>
								Turn off 2-step verification
							</kv-button>
						</div>
					</template>
				</kv-settings-card>

				<!--
					Security methods settings card
				-->
				<kv-settings-card
					title="Your security method(s)"
					v-if="isMfaActive"
				>
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
						<div>
							<h4>Authenticator app</h4>
							<a>REMOVE LINK</a>
						</div>
					</template>
				</kv-settings-card>

				<!--
					Backup methods settings card
				-->
				<kv-settings-card :title="`${ cardTitle }`">
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
						<div>
							<p>{{ cardSubhead }}</p>
							<div class="two-step-verification__sub-section">
								<h3 class="strong">
									Authentication app
									<span class="green">(Recommended)</span>
								</h3>
								<p>
									Receive code from an authenticator app on your device,
									like Google Authenticator, Duo, or Authy.
								</p>
								<kv-button class="smallest">
									Use authentication app
								</kv-button>
							</div>

							<div class="two-step-verification__sub-section">
								<h3 class="strong">
									Text message or phone call
								</h3>
								<p>
									Receive a code via text message on your mobile device.
								</p>
								<kv-button class="smallest">
									Use text message or phone call
								</kv-button>
							</div>
						</div>
					</template>
				</kv-settings-card>
			</div>
		</div>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '@/components/Kv/KvButton';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import removeMfa from '@/graphql/mutation/removeMfa.graphql';

const mfaQuery = gql`query mfaQuery($mfa_token: String!) {
	my {
		lastLoginTimestamp @client
		authenticatorEnrollments(mfa_token: $mfa_token) {
			id
			active
			authenticator_type
		}
	}
}`;

export default {
	data() {
		return {
			isMfaActive: false,
			lastLoginTime: 0,
		};
	},
	components: {
		KvIcon,
		KvSettingsCard,
		KvButton,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	metaInfo: {
		title: '2-step verification',
	},
	mounted() {
		if (this.kvAuth0.enabled) {
			this.kvAuth0.checkSession()
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					return this.apollo.query({
						query: mfaQuery,
						variables: {
							mfa_token: token
						}
					});
				}).then(result => {
					const authEnrollments = result.data.my.authenticatorEnrollments;
					this.lastLoginTime = result.data.my.lastLoginTimestamp;
					for (let i = 0; i < authEnrollments.length; i += 1) {
						// eslint-disable-next-line max-len
						if (authEnrollments[i].active === true && authEnrollments[i].authenticator_type !== 'recovery-code') {
							this.isMfaActive = true;
							return;
						}
					}
				});
		}
		if (this.$route.query.mfa === 'off') {
			// User returns to page after login, or if has logged in within 5 minutes
			// and is presented with a window.confirm
			const mfaOffConfirm = window.confirm('Are you sure you want to turn off 2-step verification?');
			if (mfaOffConfirm) {
				// Upon confirm triggger mutation to turn off mfa
				this.turnOffMfa();
			} else {
				// Upon cancel return to the base URL of current page
				window.location = '/settings/security/mfa';
			}
		}
	},
	inject: ['apollo', 'kvAuth0'],
	computed: {
		cardTitle() {
			if (this.isMfaActive) {
				return 'Add a backup method';
			}
			return 'How would you like your verification code?';
		},
		cardSubhead() {
			if (this.isMfaActive) {
				return 'Set up additional backup steps so you can log in even if your other options aren\'t available';
			}
			return 'You\'ll be asked for a verification code when accessing you Kiva account.';
		}
	},
	methods: {
		checkLastLoginTime() {
			const timeSinceLastLogin = (Math.floor(Date.now()) - this.lastLoginTime) / 60 / 1000;
			const doneUrl = `${this.$route.path}?mfa=off`;
			const encodedDoneUrl = encodeURIComponent(doneUrl);

			/* If last login was more than 5 minutes ago, send user to login
				otherwise update the URL to include ?mfa=off, which triggers
				a condition in the mounted hook */
			if (timeSinceLastLogin >= 5) {
				window.location = `/ui-login?force=true&doneUrl=${encodedDoneUrl}`;
			} else {
				window.location = doneUrl;
			}
		},
		turnOffMfa() {
			this.kvAuth0.checkSession()
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					this.apollo.mutate({
						mutation: removeMfa,
						variables: {
							mfa_token: token
						}
					}).then(() => {
						this.isMfaActive = false;
					});
				});
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.two-step-verification {
	&__title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	&__sub-section {
		margin-top: 2rem;

		.green {
			color: $kiva-green;
		}
	}
}

</style>
