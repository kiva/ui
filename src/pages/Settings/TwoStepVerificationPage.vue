<template>
	<www-page
		class="two-step-verification"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-4">
					2-step verification
				</h1>
			</div>
			<div class="row">
				<div class="column small-12 large-8 two-step-verification__settings-card-area">
					<p v-if="pageError" class="two-step-verification__error tw-text-danger">
						{{ pageError }}
					</p>

					<!--
					Toggle MFA off settings card
				-->
					<kv-loading-placeholder
						class="two-step-verification--loading"
						v-if="isLoading"
					/>
					<kv-settings-card
						title="2-step verification is turned on"
						v-if="!isLoading && isMfaActive && !pageError"
					>
						<template #content>
							<div>
								<p class="tw-mb-2">
									We'll ask you for your password and verification code from your
									mobile phone in order to log into your Kiva account.
								</p>
								<button
									class="tw-text-link tw-font-medium"
									@click="checkLastLoginTime"
								>
									Turn off 2-step verification
								</button>
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
						v-if="!isLoading && isMfaActive && !pageError"
						title="Your security method(s)"
					>
						<template #content>
							<ul>
								<li
									class="two-step-verification__method"
									v-for="(mfaMethod, index) in mfaMethods" :key="index"
								>
									<h3 class="tw-mb-1">
										{{ readableAuthName(mfaMethod.authenticator_type) }}
									</h3>
									<!-- Phone number related to authentication method -->
									<p
										class="two-step-verification__method--number data-hj-suppress"
									>
										{{ mfaMethod.name }}
									</p>
									<button
										class="tw-text-link tw-font-medium"
										@click="removeMfaMethod(mfaMethod)"
										v-if="mfaMethod.authenticator_type !== 'recovery-code'"
									>
										Remove
									</button>
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
						v-if="!isLoading && !pageError"
						:title="`${ cardTitle }`"
					>
						<template #content>
							<div class="two-step-verification__sub-section tw-mb-4">
								<p class="tw-mb-2">
									{{ cardSubhead }}
								</p>
								<h3 class="tw-mb-2">
									Text message or phone call
								</h3>
								<p class="tw-mb-2">
									Receive a code via text message on your mobile device.
								</p>
								<kv-button
									:to="`/settings/security/mfa/phone?first=${!isMfaActive}`"
								>
									Use text message or phone call
								</kv-button>
							</div>

							<div class="two-step-verification__sub-section">
								<h3 class="tw-mb-2">
									Authentication app
								</h3>
								<p class="tw-mb-2">
									Receive code from an authenticator app on your device,
									like Google Authenticator, Duo, or Authy.
								</p>
								<kv-button
									:to="`/settings/security/mfa/app?first=${!isMfaActive}`"
								>
									Use authenticator app
								</kv-button>
							</div>
							<router-view />
						</template>
					</kv-settings-card>
				</div>
			</div>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import _uniqBy from 'lodash/uniqBy';
import * as Sentry from '@sentry/vue';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import mfaQuery from '@/graphql/query/mfa/mfaQuery.graphql';
import removeMfa from '@/graphql/mutation/mfa/removeMfa.graphql';
import removeOneMfaMethod from '@/graphql/mutation/mfa/removeOneMfaMethod.graphql';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'TwoStepVerificationPage',
	data() {
		return {
			isAuthenticatorLightboxVisible: false,
			isPhoneLightboxVisible: false,
			lastLoginTime: 0,
			mfaMethods: [],
			isLoading: true,
			pageError: '',
		};
	},
	components: {
		KvButton,
		KvDefaultWrapper,
		KvSettingsCard,
		TheMyKivaSecondaryMenu,
		WwwPage,
		KvLoadingPlaceholder,
	},
	metaInfo: {
		title: '2-step verification',
	},
	mounted() {
		if (this.$route.query.mfa === 'off') {
			// User returns to page after login, or if has logged in within 5 minutes
			// and is presented with a window.confirm
			const mfaOffConfirm = window.confirm('Are you sure you want to turn off 2-step verification?'); // eslint-disable-line no-alert, max-len
			if (mfaOffConfirm) {
				// Upon confirm trigger mutation to turn off mfa
				this.turnOffMfa().then(() => {
					// Upon completion return to the security settings page
					this.$router.push('/settings/security');
				});
			} else {
				// Upon cancel return to the base URL of current page
				this.$router.push('/settings/security/mfa');
			}
		} else {
			this.gatherMfaEnrollments();
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
			return 'You\'ll be asked for a verification code when accessing your Kiva account.';
		},
		isMfaActive() {
			return this.mfaMethods.length > 0;
		},
	},
	watch: {
		$route(to, from) {
			if (to.fullPath !== from.fullPath && to.path === '/settings/security/mfa') {
				this.gatherMfaEnrollments();
			}
		}
	},
	methods: {
		gatherMfaEnrollments() {
			this.isLoading = true;
			this.kvAuth0.checkSession({ skipIfUserExists: true })
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					return this.apollo.query({
						query: mfaQuery,
						variables: {
							mfa_token: token
						},
						fetchPolicy: 'network-only',
					});
				})
				.then(result => {
					if (result.errors) {
						throw result.errors;
					}
					this.pageError = '';
					const authEnrollments = result.data.my.authenticatorEnrollments;
					this.lastLoginTime = result.data.my.lastLoginTimestamp;

					// If the user has a recovery code that is not active, then their initial MFA setup was interrupted.
					// To fix that, we need to delete their recovery code, which can only be done by turning
					// off (resetting) their MFA. Once that's complete, we need to gather their MFA enrollments again.
					if (authEnrollments.some(e => !e.active && e.authenticator_type === 'recovery-code')) {
						return this.turnOffMfa()
							.then(() => this.gatherMfaEnrollments());
					}

					this.formatMfaMethods(authEnrollments);
					this.isLoading = false;
				})
				.catch(err => {
					this.isLoading = false;
					console.error(err);
					this.pageError = 'There was an error fetching your 2-step verification status. '
						+ 'Please refresh the page and try again.';
					try {
						Sentry.captureException(err?.[0]?.extensions?.exception || err);
					} catch (e) {
						// no-op
					}
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
			return this.apollo.mutate({
				mutation: removeMfa,
			}).then(result => {
				if (result.errors) {
					throw result.errors;
				}
			}).catch(err => {
				this.isLoading = false;
				console.error(err);
				this.pageError = 'There was an error when turning off your 2-step verification. '
					+ 'Please refresh the page and try again.';
				try {
					Sentry.captureException(err?.[0]?.extensions?.exception || err);
				} catch (e) {
					// no-op
				}
			});
		},
		removeMfaMethod(mfaMethod) {
			this.kvAuth0.checkSession({ skipIfUserExists: true })
				.then(() => this.kvAuth0.getMfaManagementToken())
				.then(token => {
					return this.apollo.mutate({
						mutation: removeOneMfaMethod,
						variables: {
							mfa_token: token,
							id: mfaMethod.id
						}
					});
				})
				.then(result => {
					if (result.errors) {
						throw result.errors;
					}
					this.gatherMfaEnrollments();
				})
				.catch(err => {
					console.error(err);
					this.$showTipMsg(
						'There was an error when deleting the method. '
						+ 'Please refresh the page and try again.',
						'error'
					);
					try {
						Sentry.captureException(err?.[0]?.extensions?.exception || err);
					} catch (e) {
						// no-op
					}
				});
		},
		formatMfaMethods(authEnrollments) {
			// Filtering authEnrollments to remove inactive and unusable methods ie. "recovery code"
			// eslint-disable-next-line max-len
			const filteredMethods = authEnrollments.filter(authItem => authItem.active);
			// Taking the filtered method and removing duplicates based on a seconds half of the authItem.id
			this.mfaMethods = _uniqBy(filteredMethods, authItem => authItem.id.split('|')[1]);
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
	&__settings-card-area {
		padding: 0;

		@include breakpoint(large) {
			padding-right: 0.9375rem;
			padding-left: 0.9375rem;
		}
	}

	&__method {
		margin-top: 2.3rem;

		&--number {
			margin-bottom: rem-calc(4);
		}
	}

	&--loading {
		height: 13rem;
		margin-bottom: 1.5rem;
	}
}

</style>
