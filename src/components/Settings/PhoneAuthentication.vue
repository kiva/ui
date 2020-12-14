<template>
	<div class="phone-authentication">
		<section v-if="step === 0">
			<h2>Phone number</h2>
			<form>
				<legend>
					Enter a phone number that can be used to verify your identity with a text message or phone call.
				</legend>
				<label
					class="phone-authentication__phone-label"
					for="phone_input"
				>
					Enter your phone number here:
				</label>
				<kv-phone-input
					class="phone-authentication__phone-input"
					:class="{ 'phone-authentication__phone-input--error' : $v.phoneNumber.$error}"
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

				<h3>How do you want to get codes?</h3>
				<kv-button
					class="smallest expanded"
					type="button"
					:disabled="$v.phoneNumber.$invalid"
					@click.native="sendVerificationCode('text')"
				>
					Text message
				</kv-button>
				<kv-button
					class="smallest expanded"
					type="button"
					:disabled="$v.phoneNumber.$invalid"
					@click.native="sendVerificationCode('call')"
				>
					Phone call
				</kv-button>
			</form>
		</section>

		<section v-if="step === 1">
			<h2 v-if="verificationType === 'text'">
				We just sent you a text message
			</h2>
			<h2 v-if="verificationType === 'call'">
				You’ll receive a call shortly'
			</h2>
			<form
				@submit="submitVerification"
			>
				<p>Enter the code sent to {{ phoneNumber }}.</p>
				<label for="verification_code">Enter your 6-digit code here:</label>
				<kv-verification-code-input
					class="verification-code__input"
					id="verification_code"
					ref="userVerificationCodeInput"
					v-model="userVerificationCode"
				/>
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
			</form>
		</section>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvPhoneInput from '@/components/Kv/KvPhoneInput';
import KvVerificationCodeInput from '@/components/Kv/KvVerificationCodeInput';

import { validationMixin } from 'vuelidate';
import {
	required, minLength, maxLength, numeric
} from 'vuelidate/lib/validators';

export default {
	components: {
		KvButton,
		KvPhoneInput,
		KvVerificationCodeInput,
	},
	mixins: [validationMixin],
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
			verificationType: '', // text or call
			userVerificationCode: '', // user entered number
			step: 0,
		};
	},
	methods: {
		onValidityChanged(isValid) {
			this.isPhoneNumberValid = isValid;
		},
		sendVerificationCode(verificationType) {
			console.log('send');
			this.userVerificationCode = ''; // clear out any existing codes.
			this.verificationType = verificationType;

			// TODO: Hit endpoint to call or text based on verification method
			// TODO: Setup some pending/error indication in the UI

			// if successful, move forward.
			this.step = 1;
		},
		submitVerification() {
			console.log(this.userVerificationCode);
			// TODO: Hit endpoint with userVerificationCode
			// TODO: Setup some pending/error indication in the UI

			// if successful, close the lightbox
			this.$emit('verification-complete');
		},
		reset() {
			this.step = 0;
			this.phoneNumber = '';
			this.userVerificationCode = '';
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.phone-authentication {
	max-width: rem-calc(380);

	&__phone-label {
		font-weight: bold;
	}

	&__phone-input {
		&--error {
			::v-deep .kv-phone-input__input {
				border-color: $kiva-accent-red;
			}
		}
	}
}
</style>
