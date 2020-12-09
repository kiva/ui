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
					v-if="mfaMethods.length > 0"
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
						<ul>
							<li
								class="two-step-verification__method"
								v-for="(mfaMethod, index) in mfaMethods" :key="index"
							>
								<h4>{{ mfaMethod.authenticator_type === 'oob' ? 'Text/voice message' : 'Authenticator app' }}</h4>
								<p>{{ mfaMethod.name }}</p>
								<kv-button
									class="text-link"
									@click.native.prevent="removeMfaMethod(mfaMethod)"
								>
									Remove
								</kv-button>
							</li>
						</ul>
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
import removeOneMfaMethod from '@/graphql/mutation/removeOneMfaMethod.graphql';

const mfaQuery = gql`query mfaQuery($mfa_token: String!) {
	my {
		lastLoginTimestamp @client
		authenticatorEnrollments(mfa_token: $mfa_token) {
			id
			active
			authenticator_type
			oob_channel
			name
		}
	}
}`;

export default {
	data() {
		return {
			isMfaActive: false,
			lastLoginTime: 0,
			mfaMethods: [],
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
			this.gatherMfaEnrollments();
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
		},
	},
	methods: {
		gatherMfaEnrollments() {
			this.kvAuth0.checkSession()
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					return this.apollo.query({
						query: mfaQuery,
						variables: {
							mfa_token: token
						},
						fetchPolicy: 'network-only',
					});
				}).then(result => {
					this.isMfaActive = true;
					const authEnrollments = result.data.my.authenticatorEnrollments;
					this.lastLoginTime = result.data.my.lastLoginTimestamp;

					this.formatMfaMethods(authEnrollments);
				});
		},
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
		removeMfaMethod(mfaMethod) {
			this.kvAuth0.checkSession()
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					return this.apollo.mutate({
						mutation: removeOneMfaMethod,
						variables: {
							mfa_token: token,
							id: mfaMethod.authId
						}
					})
				.then(() => {
					this.gatherMfaEnrollments();
				})
			});
		},
		formatMfaMethods(authEnrollments) {
			console.log('formatMfaMethods(authEnrollments)', authEnrollments);

			// When a user adds a text based recovery there are 2 new methods added to their authEnrollments
			// 1) 1: {id: "sms|dev_tRkQzShZEIDAD0Q9", active: true, authenticator_type: "oob", oob_channel: "sms", name: "XXXXXXXX0367", …}
			// 2) 2: {id: "voice|dev_tRkQzShZEIDAD0Q9", active: true, authenticator_type: "oob", oob_channel: "voice", name: "XXXXXXXX0367", …}
			// Since the user only added 1 authentication method we only want to display 1 of these
			// in their list of authentication methods

			// My first thought was to remove one of the values based on the ID, since they come through with a similar ID
			// ie. "sms|dev_tRkQzShZEIDAD0Q9" & "voice|dev_tRkQzShZEIDAD0Q9"
			// BUT these aren't the same, one starts with sms, the other with voice, so I'm unable to filter
			// based on the id.
			// POSSIBLY: take off the last 4  digits and compare them, if the same only push one?

			// My next thought was to filter based on the name field
			// ie. "XXXXXXXX0367" Or "null" for non-number based auth methods

			// attempted this filtering with .map and was unable to get it to work
			// had issues comparing item.VALUE with authEnrollments.VALUE
			// const filteredMethods = [...new Map(authEnrollments.map((item) => {
			// 	console.log('item', item);
			// 	console.log('itemvalue', Object.values([item.id]));
			// 	console.log('authMethodsIINSIDE', authEnrollments.id);
				// console.log([item.name, item].values());
				// [item.name, item])).values()];
			// }))]

			// couple other things I tried:
			// const filteredMethods = authEnrollments.filter((v, i, name) => name.findIndex(t => (t.name === v.name) === i);

			// Console.logs to determine the info that I have available
			// const filteredMethods = authEnrollments.filter((item, index) => {
			// 		console.log(item.name, index, authEnrollments.indexOf(item.name), authEnrollments.indexOf(authEnrollments.name) === index);
			// });

			// console.log('filtedMethods', filteredMethods);

			authEnrollments.forEach((ol) => {
				if (ol.active === true && ol.authenticator_type !== 'recovery-code') {
					this.mfaMethods.push(ol);
				}
			});
			// console.log('this.mfaMethods', this.mfaMethods);
		}
	},
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

	&__method {
		margin-top: 2rem;
	}

	&__sub-section {
		margin-top: 2rem;

		.green {
			color: $kiva-green;
		}
	}
}

</style>
