<template>
	<div class="phone-authentication">
		<kv-lightbox
			:visible="lightboxVisible"
			@lightbox-closed="completeSetup"
			:title="lightboxTitle"
			:prevent-close="step === 3"
		>
			<section
				v-if="step === 0"
				class="phone-authentication__body"
			>
				<form>
					<legend class="tw-block tw-mb-4">
						Enter a phone number that can be used to verify your identity with a text message or phone call.
					</legend>
					<div class="tw-mb-4">
						<label
							class="tw-text-h4 tw-mb-1 tw-block"
							for="phone_input"
						>
							Enter your phone number here:
						</label>
						<kv-phone-input
							class="phone-authentication__phone-input tw-mb-1 data-hj-suppress"
							:disabled="enrollmentPending"
							:valid="!$v.phoneNumber.$error"
							id="phone_input"
							ref="phoneInput"
							v-model="phoneNumber"
							@blur="$v.phoneNumber.$touch"
							@validity-changed="onValidityChanged"
						/>
						<ul class="validation-errors" v-if="$v.phoneNumber.$error">
							<li v-if="!$v.phoneNumber.required">
								Field is required
							</li>
							<li v-if="$v.phoneNumber.required && $v.phoneNumber.$invalid">
								Phone number is invalid
							</li>
						</ul>
					</div>

					<h3 class="tw-text-h4 tw-mb-1 tw-block">
						How do you want to get codes?
					</h3>
					<kv-loading-spinner
						v-if="enrollmentPending"
					/>
					<p class="phone-authentication__error" v-if="enrollmentError">
						{{ enrollmentError }}
					</p>
					<template v-if="!enrollmentPending">
						<kv-button
							class="tw-w-full tw-mb-2"
							type="button"
							:state="$v.phoneNumber.$invalid ? 'disabled' : ''"
							@click="startEnrollment('SMS')"
						>
							Text message
						</kv-button>
						<kv-button
							class="tw-w-full"
							type="button"
							:state="$v.phoneNumber.$invalid ? 'disabled' : ''"
							@click="startEnrollment('voice')"
						>
							Phone call
						</kv-button>
					</template>
				</form>
			</section>

			<section
				v-if="step === 1"
				class="phone-authentication__body"
			>
				<form
					@submit.prevent="submitVerification"
				>
					<p class="tw-mb-2">
						Enter the code sent to <span class="data-hj-suppress">{{ phoneNumber }}</span>.
					</p>
					<label
						for="verification_code"
						class="phone-authentication__label tw-text-h4 tw-mb-1"
					>
						Enter your 6-digit code here:
					</label>
					<kv-verification-code-input
						class="verification-code__input data-hj-suppress tw-mb-4"
						id="verification_code"
						ref="userVerificationCodeInput"
						v-model="userVerificationCode"
					/>

					<kv-loading-spinner
						v-if="verificationPending"
					/>
					<p
						class="phone-authentication__error tw-text-danger tw-mb-2"
						v-if="verificationError && !verificationPending"
					>
						{{ verificationError }}
					</p>
					<template v-if="!verificationPending">
						<kv-button
							class="tw-w-full tw-mb-2"
							type="submit"
							:state="$v.userVerificationCode.$invalid ? 'disabled' : ''"
						>
							Done
						</kv-button>
						<button
							class="tw-text-link tw-font-medium tw-w-full"
							type="button"
							@click="startEnrollment(enrollmentType)"
						>
							Resend Code
						</button>
					</template>
				</form>
			</section>

			<section class="phone-authentication__body" v-if="step === 3">
				<recovery-code-confirm
					:mfa-recovery-code="recoveryCode"
					@done="confirmRecoveryCode"
				/>
			</section>

			<section class="phone-authentication__body" v-if="step === 4">
				<first-m-f-a-setup />
			</section>
		</kv-lightbox>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
	required, minLength, maxLength, numeric
} from 'vuelidate/lib/validators';
import * as Sentry from '@sentry/vue';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvPhoneInput from '@/components/Kv/KvPhoneInput';
import KvVerificationCodeInput from '@/components/Kv/KvVerificationCodeInput';
import FirstMFASetup from '@/pages/Settings/FirstMFASetup';
import RecoveryCodeConfirm from '@/pages/Settings/RecoveryCodeConfirm';

import enrollSMSAuthenticatorMutation from '@/graphql/mutation/mfa/enrollSMSAuthenticator.graphql';
import enrollVoiceAuthenticatorMutation from '@/graphql/mutation/mfa/enrollVoiceAuthenticator.graphql';
import confirmSMSAuthenticatorEnrollmentMutation from '@/graphql/mutation/mfa/confirmSMSAuthenticatorEnroll.graphql';
import confirmVoiceAuthenticatorEnrollmentMutation from
	'@/graphql/mutation/mfa/confirmVoiceAuthenticatorEnroll.graphql';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'PhoneAuthentication',
	components: {
		FirstMFASetup,
		KvButton,
		KvLightbox,
		KvLoadingSpinner,
		KvPhoneInput,
		KvVerificationCodeInput,
		RecoveryCodeConfirm,
	},
	mixins: [validationMixin],
	inject: ['apollo', 'kvAuth0'],
	props: {
		first: {
			type: Boolean,
			default: false,
		},
	},
	validations: {
		phoneNumber: {
			required,
			valid() { return this.isPhoneNumberValid; }
		},
		userVerificationCode: {
			required,
			minLength: minLength(6),
			maxLength: maxLength(6),
			numeric
		}
	},
	data() {
		return {
			lightboxVisible: true,
			phoneNumber: '',
			isPhoneNumberValid: false,
			enrollmentType: '', // SMS or voice
			userVerificationCode: '', // user entered number
			oobCode: '',
			enrollmentPending: false,
			enrollmentError: '',
			recoveryCode: '',
			verificationPending: false,
			verificationError: '',
			step: 0,
		};
	},
	computed: {
		lightboxTitle() {
			if (this.step === 1) {
				if (this.enrollmentType === 'SMS') {
					return 'We sent you a text message';
				}
				if (this.enrollmentType === 'voice') {
					return 'You’ll receive a call shortly';
				}
			}
			if (this.step === 4) {
				return 'Complete setup';
			}
			return 'Phone number';
		},
	},
	beforeDestroy() {
		this.lightboxVisible = false;
	},
	methods: {
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
		onValidityChanged(isValid) {
			this.isPhoneNumberValid = isValid;
		},
		startEnrollment(enrollmentType) {
			this.enrollmentType = enrollmentType;
			this.enrollmentError = '';
			this.enrollmentPending = true;
			this.userVerificationCode = ''; // clear out any existing codes.

			const mutation = this.enrollmentType === 'SMS'
				? enrollSMSAuthenticatorMutation
				: enrollVoiceAuthenticatorMutation;

			this.getMFAToken()
				.then(token => {
					return this.apollo.mutate({
						mutation,
						variables: {
							mfa_token: token,
							phone_number: this.phoneNumber
						}
					});
				})
				.then(result => {
					if (result.errors) {
						throw result.errors;
					} else {
						const authenticator = this.enrollmentType === 'SMS'
							? result?.data?.my?.enrollSMSAuthenticator || {}
							: result?.data?.my?.enrollVoiceAuthenticator || {};
						this.recoveryCode = authenticator.recovery_codes?.[0] || '';
						this.oobCode = authenticator.oob_code || '';
						if (this.oobCode) {
							this.step = 1;
						}
					}
				})
				.catch(err => {
					console.error(err);
					this.enrollmentPending = false;
					this.enrollmentError = err?.[0]?.message
						|| err
						|| 'Error. Please refresh the page and try again.';
					try {
						Sentry.captureException(err?.[0]?.extensions?.exception || err);
					} catch (e) {
						// no-op
					}
				});
		},
		submitVerification() {
			this.verificationError = '';
			this.verificationPending = true;

			const mutation = this.enrollmentType === 'SMS'
				? confirmSMSAuthenticatorEnrollmentMutation
				: confirmVoiceAuthenticatorEnrollmentMutation;

			this.getMFAToken()
				.then(token => {
					return this.apollo.mutate({
						mutation,
						variables: {
							mfa_token: token,
							oob_code: this.oobCode,
							binding_code: this.userVerificationCode
						}
					});
				})
				.then(result => {
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
				})
				.catch(err => {
					console.error(err);
					this.verificationPending = false;
					if (err?.[0]?.message?.indexOf('Invalid binding_code') > -1) {
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
		},
		confirmRecoveryCode() {
			this.recoveryCode = '';
			if (this.first) {
				this.step = 4;
			} else {
				this.completeSetup();
			}
		},
		completeSetup() {
			if (this.lightboxVisible) {
				this.$router.push('/settings/security/mfa'); // return to MFA settings page
				this.lightboxVisible = false;
			}
			this.phoneNumber = '';
			this.step = 0;
			this.oobCode = '';
			this.userVerificationCode = '';
			this.enrollmentError = '';
			this.verificationError = '';
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.phone-authentication {
	&__body {
		max-width: rem-calc(382);
	}

	.verification-code {
		&__input {
			font-size: 2.15rem;

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
