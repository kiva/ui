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
			<div class="column small-12 large-8 two-step-verification__settings-card-area">
				<!--
					Toggle MFA off settings card
				-->
				<kv-loading-placeholder
					class="two-step-verification--loading"
					v-if="isLoading"
				/>
				<kv-settings-card
					title="2-step verification is turned on"
					v-if="!isLoading && isMfaActive"
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
				<kv-loading-placeholder
					class="two-step-verification--loading"
					v-if="isLoading"
				/>
				<kv-settings-card
					v-if="!isLoading && isMfaActive"
					title="Your security method(s)"
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
								<h4>{{ readableAuthName(mfaMethod.authenticator_type) }}</h4>
								<!-- Phone number related to authentication method -->
								<p>{{ mfaMethod.name }}</p>
								<kv-button
									class="text-link"
									@click.native.prevent="removeMfaMethod(mfaMethod)"
									v-if="mfaMethod.authenticator_type !== 'recovery-code'"
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
				<kv-loading-placeholder
					class="two-step-verification--loading"
					v-if="isLoading"
				/>
				<kv-settings-card
					v-if="!isLoading"
					:title="`${ cardTitle }`"
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
						<div class="two-step-verification__sub-section">
							<p>{{ cardSubhead }}</p>
							<h3 class="strong">
								Authentication app
								<span class="two-step-verification__sub-section--green">(Recommended)</span>
							</h3>
							<p>
								Receive code from an authenticator app on your device,
								like Google Authenticator, Duo, or Authy.
							</p>
							<kv-button
								class="smallest"
								:to="`/settings/security/mfa/app?first=${!isMfaActive}`"
							>
								Use authenticator app
							</kv-button>
						</div>

						<div class="two-step-verification__sub-section">
							<h3 class="strong">
								Text message or phone call
							</h3>
							<p>
								Receive a code via text message on your mobile device.
							</p>
							<kv-button class="smallest"
								:to="`/settings/security/mfa/phone?first=${!isMfaActive}`"
							>
								Use text message or phone call
							</kv-button>
						</div>
						<router-view />
					</template>
				</kv-settings-card>
			</div>
		</div>
	</www-page>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import mfaQuery from '@/graphql/query/mfa/mfaQuery.graphql';
import removeMfa from '@/graphql/mutation/mfa/removeMfa.graphql';
import removeOneMfaMethod from '@/graphql/mutation/mfa/removeOneMfaMethod.graphql';
import _uniqBy from 'lodash/uniqBy';

export default {
	data() {
		return {
			isAuthenticatorLightboxVisible: false,
			isPhoneLightboxVisible: false,
			lastLoginTime: 0,
			mfaMethods: [],
			isLoading: false,
		};
	},
	components: {
		KvButton,
		KvIcon,
		KvSettingsCard,
		TheMyKivaSecondaryMenu,
		WwwPage,
		KvLoadingPlaceholder,
	},
	metaInfo: {
		title: '2-step verification',
	},
	mounted() {
		if (this.kvAuth0.enabled) {
			this.isLoading = true;
			this.gatherMfaEnrollments();
		}
		if (this.$route.query.mfa === 'off') {
			// User returns to page after login, or if has logged in within 5 minutes
			// and is presented with a window.confirm
			const mfaOffConfirm = window.confirm('Are you sure you want to turn off 2-step verification?'); // eslint-disable-line no-alert, max-len
			if (mfaOffConfirm) {
				// Upon confirm triggger mutation to turn off mfa
				this.turnOffMfa();
			} else {
				// Upon cancel return to the base URL of current page
				this.$router.push('/settings/security/mfa');
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
		isMfaActive() {
			return this.mfaMethods.length > 0;
		},
	},
	beforeRouteUpdate(to, from, next) {
		if (to.path === '/settings/security/mfa') {
			this.gatherMfaEnrollments();
		}
		next();
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
			this.apollo.mutate({
				mutation: removeMfa,
			}).then(() => {
				// Upon completion return to the base URL of current page
				this.$router.push('/settings/security/mfa');
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
							id: mfaMethod.id
						}
					})
						.then(() => {
							this.gatherMfaEnrollments();
						});
				});
		},
		formatMfaMethods(authEnrollments) {
			// Filtering authEnrollments to remove inactive and unusable methods ie. "recovery code"
			// eslint-disable-next-line max-len
			const filteredMethods = authEnrollments.filter(authItem => authItem.active);
			// Taking the filtered method and removing duplicates based on a seconds half of the authItem.id
			this.mfaMethods = _uniqBy(filteredMethods, authItem => authItem.id.split('|')[1]);
			this.isLoading = false;
		},
		readableAuthName(authType) {
			if (authType === 'oob') {
				return 'Text/voice message';
			} if (authType === 'recovery-code') {
				return 'Recovery code';
			}
			return 'Authenticator app';
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

	&__settings-card-area {
		padding: 0;

		@include breakpoint(medium) {
			padding: unset;
		}
	}

	&__method {
		margin-top: 2rem;
	}

	&__sub-section {
		margin-top: 2rem;

		&--green {
			color: $kiva-green;
		}
	}

	&--loading {
		height: 13rem;
		margin-bottom: 1.5rem;
	}
}

</style>
