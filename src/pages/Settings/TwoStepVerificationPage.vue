<template>
	<www-page class="two-step-verification" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="title-area">
			<div class="row column">
				<h1>
					2-step verification
				</h1>
			</div>
		</div>
		<div class="row">
			<div class="column small-12 large-8">
				<kv-settings-card>
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
						<div v-if="!isMFAActive">
							<h2>{{ cardTitle }}</h2>
							<p>{{ cardSubhead }}</p>
						</div>

						<div v-if="isMFAActive" class="section">
							<h3 class="strong">
								2-step verification is turned on
							</h3>
							<p>
								We'll ask you for your password and verification code from your
								mobile phone in order to log into your Kiva account.
							</p>
							<a
								@click="turnOffMFA"
							>Turn off 2-step verification</a>
						</div>

						<div v-if="isMFAActive" class="section">
							<h3 class="strong">
								Your security method(s)
							</h3>
							<h4>Authenticator app</h4>
							<p>Added:<span>DATE</span></p>
							<a>REMOVE LINK</a>
						</div>

						<div v-if="isMFAActive" class="section">
							<h3 class="strong">
								{{ cardTitle }}
							</h3>
							<p>{{ cardSubhead }}</p>
						</div>

						<div class="sub-section">
							<h3 class="strong">
								Authentication app <span class="green">(Recommended)</span>
							</h3>
							<p>
								Receive code from an authenticator app on your device,
								like Google Authenticator, Duo, or Authy.
							</p>
							<kv-button class="smallest">
								Use authentication app
							</kv-button>
						</div>

						<div class="sub-section">
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

const pageQuery = gql`query mfaQuery($mfa_token: String!) {
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
			isMFAActive: false,
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
			this.kvAuth0.getMfaManagementToken()
				.then(token => {
					return this.apollo.query({
						query: pageQuery,
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
							this.isMFAActive = true;
							return;
						}
					}
				});
		}
		if (this.$route.query.mfa === 'off') {
			// User returns to page after successful login and are shown a window.confirm
			window.confirm('Are you sure you want to turn off 2-step verification?');
			// Upon confirm triggger mutation to turn off mfa
		}
	},
	inject: ['apollo', 'kvAuth0'],
	computed: {
		cardTitle() {
			if (this.isMFAActive) {
				return 'Add a backup method';
			}
			return 'How would you like your verification code?';
		},
		cardSubhead() {
			if (this.isMFAActive) {
				return "Set up additional backup steps so you can log in even if your other options aren't available";
			}
			return "You'll be asked for a verification code when accessing you Kiva account.";
		}
	},
	methods: {
		turnOffMFA() {
			// Get current time in seconds
			// Math.floor(Date.now() / 1000)
			const timeSinceLastLogin = this.lastLoginTime - Math.floor(Date.now() / 1000);
			console.log('lastLogintime', this.lastLoginTime);
			console.log('now', Date.now());
			console.log('timeSinceLastLogin', timeSinceLastLogin);

			const doneUrl = encodeURIComponent(`${this.$route.path}?mfa=off`);
			console.log('doneURL', doneUrl);

			/* last login time is older than 5 minutes */
			// if (timeSinceLastLogin > 300) {
			// 	window.location = `/ui-login?force=true&doneUrl=${doneUrl}`;
			// } else {
			// 	window.location = `${doneUrl}`;
			// }
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.two-step-verification {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.green {
		color: $kiva-green;
	}

	.section {
		margin-bottom: rem-calc(50);
	}

	.sub-section {
		margin-bottom: 2rem;
	}
}

</style>
