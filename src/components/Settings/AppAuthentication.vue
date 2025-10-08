<template>
	<div class="app-authentication">
		<kv-lightbox
			class="app-authentication__lightbox"
			:visible="lightboxVisible"
			:prevent-close="step === 3"
			@lightbox-closed="completeSetup"
		>
			<section class="app-authentication__body" v-if="step === 0">
				<h2 class="app-authentication__heading tw-mb-2">
					Use an authenticator app
				</h2>
				<kv-loading-spinner v-if="fetchingEnrollment" />
				<p class="tw-text-danger tw-mb-2" v-if="enrollmentError">
					{{ enrollmentError }}
				</p>
				<template v-if="!fetchingEnrollment && !enrollmentError">
					<p class="app-authentication__description tw-mb-2">
						Download the Google Authenticator, Duo, or Authy app on your
						phone or computer. Then tap the “+” in the authenticator app
						and scan the image below.
					</p>
					<a class="tw-font-medium" :href="barcodeURI">
						Set up on this device
					</a>
					<vue-qrcode
						class="app-authentication__barcode"
						:value="barcodeURI"
						:size="150"
						level="L"
						v-if="barcodeURI"
					/>
					<kv-button class="tw-w-full tw-mb-2" @click="afterScan">
						Continue
					</kv-button>
					<button class="tw-text-link tw-font-medium" @click="cannotScan">
						Can't scan it?
					</button>
				</template>
			</section>
			<section class="app-authentication__body" v-if="step === 1 || step === 2">
				<template v-if="step === 1">
					<h2 class="app-authentication__heading tw-mb-2">
						Set up authenticator
					</h2>
					<p class="app-authentication__description tw-mb-2">
						Enter the code shown in your authenticator app.
					</p>
				</template>
				<template v-else>
					<h2 class="app-authentication__heading tw-mb-2">
						Can't scan the barcode?
					</h2>
					<p class="app-authentication__description tw-mb-2">
						Instead of scanning, use your authenticator app's "Manual entry" or equivalent option
						and enter the code below. Your app will generate a 6-digit code, which you’ll use below.
					</p>
					<div class="tw-bg-tertiary tw-border tw-rounded-xs tw-font-medium tw-p-1 tw-mb-2">
						{{ secret }}
					</div>
				</template>
				<form action="." @submit.prevent="submitVerification">
					<label class="verification-code__label" for="verification_code">
						Enter your 6-digit code here:
					</label>
					<kv-verification-code-input
						class="verification-code__input"
						id="verification_code"
						@update="userVerificationCode = $event"
					/>
					<kv-loading-spinner
						v-if="verificationPending"
					/>
					<p
						class="tw-text-danger tw-mb-2"
						v-if="verificationError && !verificationPending"
					>
						{{ verificationError }}
					</p>
					<kv-button
						class="tw-w-full"
						type="submit"
						:state="v$.userVerificationCode?.$invalid ? 'disabled' : ''"
						v-if="!verificationPending"
					>
						Done
					</kv-button>
				</form>
			</section>
			<section class="app-authentication__body" v-if="step === 3">
				<recovery-code-confirm
					:mfa-recovery-code="recoveryCode"
					@done="confirmRecoveryCode"
				/>
			</section>
			<section class="app-authentication__body" v-if="step === 4">
				<first-m-f-a-setup />
			</section>
		</kv-lightbox>
	</div>
</template>

<script>
import * as Sentry from '@sentry/vue';
import { useVuelidate } from '@vuelidate/core';
import {
	required, minLength, maxLength, numeric
} from '@vuelidate/validators';
import VueQrcode from 'qrcode.vue';
import KvLightbox from '#src/components/Kv/KvLightbox';
import KvLoadingSpinner from '#src/components/Kv/KvLoadingSpinner';
import KvVerificationCodeInput from '#src/components/Kv/KvVerificationCodeInput';
import FirstMFASetup from '#src/pages/Settings/FirstMFASetup';
import RecoveryCodeConfirm from '#src/pages/Settings/RecoveryCodeConfirm';
import confirmOTPAuthenticatorEnrollment from '#src/graphql/mutation/mfa/confirmOTPAuthenticatorEnrollment.graphql';
import enrollOTPAuthenticator from '#src/graphql/mutation/mfa/enrollOTPAuthenticator.graphql';
import { KvButton } from '@kiva/kv-components';

export default {
	name: 'AppAuthentication',
	inject: ['apollo', 'kvAuth0'],
	props: {
		first: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		FirstMFASetup,
		KvButton,
		KvLightbox,
		KvLoadingSpinner,
		KvVerificationCodeInput,
		RecoveryCodeConfirm,
		VueQrcode,
	},
	validations() {
		return {
			userVerificationCode: {
				required,
				minLength: minLength(6),
				maxLength: maxLength(6),
				numeric
			}
		};
	},
	data() {
		return {
			barcodeURI: '',
			enrollmentError: '',
			fetchingEnrollment: true,
			lightboxVisible: true,
			recoveryCode: '',
			secret: '',
			step: 0,
			userVerificationCode: '',
			verificationPending: false,
			verificationError: '',
		};
	},
	setup() { return { v$: useVuelidate() }; },
	mounted() {
		this.startEnrollment();
	},
	beforeUnmount() {
		this.lightboxVisible = false;
	},
	methods: {
		afterScan() {
			this.step = 1;
		},
		cannotScan() {
			this.step = 2;
		},
		completeSetup() {
			if (this.lightboxVisible) {
				this.$router.push('/settings/security/mfa'); // return to MFA settings page
				this.lightboxVisible = false;
			}
			setTimeout(() => {
				this.enrollmentError = '';
				this.barcodeURI = '';
				this.secret = '';
				this.step = 0;
				this.userVerificationCode = '';
				this.verificationError = '';
			}, 300); // Allow time for lightbox to close before resetting state
		},
		confirmRecoveryCode() {
			this.recoveryCode = '';
			if (this.first) {
				this.step = 4;
			} else {
				this.completeSetup();
			}
		},
		getMFAToken() {
			return new Promise((resolve, reject) => {
				if (this.kvAuth0.enabled) {
					this.kvAuth0.checkSession({ skipIfUserExists: true })
						.then(() => this.kvAuth0.getMfaManagementToken())
						.then(token => {
							resolve(token);
						}).catch(err => {
							reject(err);
						});
				} else {
					reject('Auth not enabled');
				}
			});
		},
		startEnrollment() {
			// initiate OTP enrollment
			this.fetchingEnrollment = true;
			this.getMFAToken().then(token => {
				return this.apollo.mutate({
					mutation: enrollOTPAuthenticator,
					variables: {
						mfa_token: token
					}
				});
			}).then(result => {
				if (result.errors) {
					throw result.errors;
				}
				const authenticator = result?.data?.my?.enrollOTPAuthenticator || {};
				this.barcodeURI = authenticator.barcode_uri || '';
				this.recoveryCode = authenticator.recovery_codes?.[0] || '';
				this.secret = authenticator.secret || '';
				this.fetchingEnrollment = false;
			}).catch(err => {
				console.error(err);
				// eslint-disable-next-line max-len
				this.enrollmentError = err?.[0]?.message || 'There was an error. Please refresh the page and try again.';
				this.fetchingEnrollment = false;
				try {
					Sentry.captureException(err?.[0]?.extensions?.exception || err);
				} catch (e) {
					// no-op
				}
			});
		},
		submitVerification() {
			// confirm enrollment
			this.verificationPending = true;
			this.getMFAToken().then(token => {
				return this.apollo.mutate({
					mutation: confirmOTPAuthenticatorEnrollment,
					variables: {
						mfa_token: token,
						binding_code: this.userVerificationCode,
					}
				});
			}).then(result => {
				if (result.errors) {
					throw result.errors;
				}
				this.verificationPending = false;
				if (this.recoveryCode) {
					this.step = 3;
				} else if (this.first) {
					this.step = 4;
				} else {
					this.completeSetup();
				}
			}).catch(err => {
				console.error(err);
				this.verificationPending = false;
				if (err?.[0]?.message?.indexOf('Invalid otp_code') > -1) {
					this.verificationError = 'The code entered was not valid. Please try again.';
				} else {
					this.verificationError = 'Error. Please refresh the page and try again.';
					try {
						Sentry.captureException(err?.[0]?.extensions?.exception || err);
					} catch (e) {
						// no-op
					}
				}
			});
		}
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.app-authentication {
	&__body {
		max-width: rem-calc(484);
		text-align: center;
	}

	&__heading {
		font-weight: bold;
		text-align: left;
	}

	&__description {
		text-align: left;
	}

	&__barcode {
		display: flex;
		justify-content: center;
		margin: 1rem auto 1.5rem;
	}

	.verification-code {
		&__label {
			text-align: left;
		}

		&__input {
			margin-bottom: 2rem;
			font-size: 2.2rem;

			@include breakpoint(medium) {
				font-size: 3rem;
			}
		}
	}

	.loading-spinner {
		display: block;
		margin: 2rem auto 0;
	}
}
</style>
