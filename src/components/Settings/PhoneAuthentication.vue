<template>
	<div class="phone-authentication">
		<section v-if="step === 0">
			<h2>Phone number</h2>
			<form>
				<legend class="phone-authentication__legend">
					Enter a phone number that can be used to verify your identity with a text message or phone call.
				</legend>
				<div class="phone-authentication__phone">
					<label
						class="phone-authentication__label"
						for="phone_input"
					>
						Enter your phone number here:
					</label>
					<kv-phone-input
						class="phone-authentication__phone-input"
						:class="{ 'phone-authentication__phone-input--error' : $v.phoneNumber.$error}"
						:disabled="isVerificationPending"
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

				<h3 class="phone-authentication__label">
					How do you want to get codes?
				</h3>
				<kv-loading-spinner
					v-if="isVerificationPending"
				/>
				<p class="phone-authentication__error" v-if="verificationError">
					{{ verificationError }}
				</p>
				<template v-if="!isVerificationPending">
					<kv-button
						class="smallest expanded"
						type="button"
						:disabled="$v.phoneNumber.$invalid"
						@click.native="sendVerificationCode('SMS')"
					>
						<div>
							<span>Text message</span>
							<kv-loading-spinner
								v-if="isVerificationPending"
							/>
						</div>
					</kv-button>
					<kv-button
						class="smallest expanded"
						type="button"
						:disabled="$v.phoneNumber.$invalid"
						@click.native="sendVerificationCode('voice')"
					>
						Phone call
					</kv-button>
				</template>
			</form>
		</section>

		<section v-if="step === 1">
			<h2 v-if="verificationType === 'SMS'">
				We just sent you a text message
			</h2>
			<h2 v-if="verificationType === 'voice'">
				You’ll receive a call shortly'
			</h2>
			<form
				@submit.prevent="confirmAuthenticatorEnrollment"
			>
				<p>Enter the code sent to {{ phoneNumber }}.</p>
				<label
					for="verification_code"
					class="phone-authentication__label"
				>
					Enter your 6-digit code here:
				</label>
				<kv-verification-code-input
					class="verification-code__input"
					id="verification_code"
					ref="userVerificationCodeInput"
					v-model="userVerificationCode"
				/>

				<kv-loading-spinner
					v-if="isVerificationPending"
				/>
				<p class="phone-authentication__error" v-if="verificationError">
					{{ verificationError }}
				</p>
				<template v-if="!isVerificationPending">
					<kv-button
						class="expanded"
						type="submit"
						:disabled="$v.userVerificationCode.$invalid"
					>
						Done
					</kv-button>
					<kv-button
						class="text-link expanded"
						type="button"
						@click.native="sendVerificationCode(verificationType)"
					>
						Resend Code
					</kv-button>
				</template>
			</form>
		</section>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvPhoneInput from '@/components/Kv/KvPhoneInput';
import KvVerificationCodeInput from '@/components/Kv/KvVerificationCodeInput';
import gql from 'graphql-tag';

import { validationMixin } from 'vuelidate';
import {
	required, minLength, maxLength, numeric
} from 'vuelidate/lib/validators';

const enrollSMSAuthenticatorMutation = gql`
mutation enrollSMSAuthenticator($mfa_token: String!, $phone_number: String!) {
  my {
		enrollSMSAuthenticator( mfa_token: $mfa_token, phone_number: $phone_number) {
			binding_method,
			oob_code
		}
	}
}`;

const enrollVoiceAuthenticatorMutation = gql`
mutation enrollVoiceAuthenticator($mfa_token: String!, $phone_number: String!) {
	my {
		enrollVoiceAuthenticator( mfa_token: $mfa_token, phone_number: $phone_number) {
			binding_method,
			oob_code
		}
	}
}`;

const confirmSMSAuthenticatorEnrollmentMutation = gql`
mutation confirmSMSAuthenticatorEnrollment($mfa_token: String!, $oob_code: String!, $binding_code: String!) {
	my {
		confirmSMSAuthenticatorEnrollment( mfa_token: $mfa_token, oob_code: $oob_code, binding_code: $binding_code)
	}
}`;

const confirmVoiceAuthenticatorEnrollmentMutation = gql`
mutation confirmVoiceAuthenticatorEnrollment($mfa_token: String!, $oob_code: String!, $binding_code: String!) {
	my {
		confirmVoiceAuthenticatorEnrollment( mfa_token: $mfa_token, oob_code: $oob_code, binding_code: $binding_code)
	}
}`;

export default {
	components: {
		KvButton,
		KvLoadingSpinner,
		KvPhoneInput,
		KvVerificationCodeInput,
	},
	mixins: [validationMixin],
	inject: ['apollo', 'kvAuth0'],
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
			phoneNumber: '',
			isPhoneNumberValid: false,
			verificationType: '', // SMS or voice
			userVerificationCode: '', // user entered number
			oobCode: '',
			isVerificationPending: false,
			verificationError: '',
			step: 0,
		};
	},
	methods: {
		getMFAToken() {
			return new Promise((resolve, reject) => {
				if (this.kvAuth0.enabled) {
					this.kvAuth0.checkSession()
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
		sendVerificationCode(verificationType) {
			this.verificationType = verificationType;
			this.userVerificationCode = ''; // clear out any existing codes.
			this.verificationError = '';
			this.isVerificationPending = true;

			const mutation = this.verificationType === 'SMS'
				? enrollSMSAuthenticatorMutation
				: enrollVoiceAuthenticatorMutation;

			this.getMFAToken()
				.then(token => {
					return this.apollo.mutate({
						mutation,
						variables: {
							mfa_token: token,
						}
					});
				}).then(result => {
					if (result.errors) {
						throw result.errors;
					} else {
						this.oobCode = this.verificationType === 'SMS'
							? result?.data?.my?.enrollSMSAuthenticator?.oob_code
							: result?.data?.my?.enrollVoiceAuthenticator?.oob_code;
						if (this.oobCode) {
							this.step = 1;
						}
					}
				})
				.catch(err => {
					console.error(err);
					this.verificationError = err?.[0].message || err || 'Error. Please refresh the page and try again.';
				})
				.finally(() => {
					this.isVerificationPending = false;
				});
		},
		confirmAuthenticatorEnrollment() {
			this.verificationError = '';
			this.isVerificationPending = true;

			const mutation = this.verificationType === 'SMS'
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
				}).then(result => {
					if (result.errors) {
						throw result.errors;
					} else {
						// We're successful, close the lightbox
						this.$emit('verification-complete');
					}
				})
				.catch(err => {
					console.error(err);
					this.verificationError = err?.[0].message || err || 'Error. Please refresh the page and try again.';
				})
				.finally(() => {
					this.isVerificationPending = false;
				});
		},
		reset() {
			this.step = 0;
			this.phoneNumber = '';
			this.userVerificationCode = '';
			this.oobCode = '';
			this.verificationError = '';
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.phone-authentication {
	max-width: rem-calc(380);

	&__legend,
	&__phone {
		margin-bottom: 1rem;
	}

	&__label {
		font-weight: bold;
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	&__phone-input {
		&--error {
			::v-deep .kv-phone-input__input {
				border-color: $kiva-accent-red;
			}
		}
	}

	&__error {
		color: $kiva-accent-red;
	}

	.loading-spinner {
		display: block;
		margin: 2rem auto 0;
	}
}
</style>
