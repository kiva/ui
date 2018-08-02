<template>
	<form id="registerForm"
		class="register-form"
		ref="regForm"
		name="regForm"
		method="post"
		:action="regActionUrl"
		@submit.prevent.stop="register"
		novalidate>

		<KvButton class="smaller">FACEBOOK BUTTON HERE</KvButton>
		<hr>
		<div class="featured-text">Or</div>

		<ul v-show="serverErrors" class="server-errors">
			<li v-for="(errorText, index) in serverErrors" :key="index">
				{{ errorText }}
			</li>
		</ul>

		<div class="input-set">
			<label for="firstName">
				First name
				<input
					type="text"
					name="firstName"
					maxlength="40"
					v-model="firstName"
					autofocus
					@blur="validateName(firstName)">
			</label>
			<p v-if="firstNameErrors.length">
				<ul class="validation-errors">
					<li v-for="firstNameError in firstNameErrors" :key="firstNameError">{{ firstNameError }}</li>
				</ul>
			</p>
		</div>

		<div class="input-set">
			<label for="lastName">
				Last name <input
					type="text"
					name="lastName"
					maxlength="40"
					v-model="lastName"
					@blur="validateName(lastName)">
			</label>
			<p v-if="lastNameErrors.length">
				<ul class="validation-errors">
					<li v-for="lastNameError in lastNameErrors" :key="lastNameError">{{ lastNameError }}</li>
				</ul>
			</p>
		</div>

		<div class="input-set">
			<label for="email">
				Email <input
					type="email"
					name="email"
					maxlength="100"
					v-model="email"
					@blur="validateEmail(email)">
			</label>
			<p v-if="emailErrors.length">
				<ul class="validation-errors">
					<li v-for="emailError in emailErrors" :key="emailError">{{ emailError }}</li>
				</ul>
			</p>
		</div>

		<div class="input-set">
			<label for="password">
				Password <input
					type="password"
					name="password"
					maxlength="31"
					v-model="password"
					@blur="validatePassword(password)">
			</label>
			<p v-if="passwordErrors.length">
				<ul class="validation-errors">
					<li v-for="passwordError in passwordErrors" :key="passwordError">{{ passwordError }}</li>
				</ul>
			</p>
		</div>

		<div class="terms-and-policy">
			<input
				type="checkbox"
				name="terms"
				id="registerForm_terms_of_use_privacy_poicy"
				v-model="terms"
				@blur="validateTerms(terms)">
			I have read and agree to the
			<a href="legal/terms"
				target="_blank"
				title="Open Terms of Use in a new window"
				v-kv-track-event="'Register|click-terms-of-use|TermsOfUseClick'">
				Terms of Use
			</a> and
			<a href="legal/privacy"
				target="_blank"
				title="Open Privacy Policy in a new window"
				v-kv-track-event="'Register|click-privacy-policy|PrivacyPolicyClick'">
				Privacy Policy
			</a>.
			<p v-if="termsErrors.length">
				<ul class="validation-errors">
					<li v-for="termsError in termsErrors" :key="termsError">{{ termsError }}</li>
				</ul>
			</p>
		</div>
		<KvButton
			class="register-button smaller"
			type="submit"
			name="regForm_submit"
			id="regForm_submit"
			v-kv-track-event="'Register|click-register-submit|RegisterButtonClick'">
			Continue
		</KvButton>

		<input type="hidden" name="currURL" :value="currUrl">
		<!-- Have to pass this crumb in the Header and in the Request -->
		<input type="hidden" id="regcrumb" name="crumb" :value="crumb">
	</form>
</template>

<script>
import loginRegUtils from '@/plugins/login-reg-mixin';
import KvButton from '@/components/Kv/KvButton';
import formValidate from '@/plugins/formValidate';

export default {
	components: {
		KvButton,
	},
	mixins: [
		loginRegUtils,
		formValidate
	],
	props: {
		// Add the done-url="lend-vue?page=2" (Path Only) parameter to redirect on successful registration
		doneUrl: {
			type: String,
			default: ''
		},
		// Bind the :refresh="true" parameter when adding this component to force refresh on successful registration
		// -> This mode is meant for an embedded registration form scenario, form exists if the user isn't registered
		refresh: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			regActionUrl: '/register/process',
			currUrl: this.$route.path,
			crumb: '',
			regFailed: false,
			loading: false, // TODO: Add loading state v-show="!loading && !userId"
			serverErrors: [],
			firstNameErrors: [],
			lastNameErrors: [],
			emailErrors: [],
			termsErrors: [],
			passwordErrors: [],
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			terms: ''
		};
	},
	created() {
		this.crumb = this.getCookieCrumb();
		if (this.doneUrl !== '') {
			const doneUrlEncoded = encodeURIComponent(this.doneUrl);
			this.regActionUrl = `${this.regActionUrl}?doneUrl=${doneUrlEncoded}`;
		}
	},
	mounted() {
		this.currUrl = window.location.href;
	},
	methods: {
		register() {
			// this.loading = true;
			if (this.validateForm() === true) {
				const formData = new FormData(this.$refs.regForm);
				this.postForm(this.regActionUrl, formData);
			}
		},
		validateForm() {
			if (this.firstName && this.lastName && this.email && this.password &&
				this.terms) {
				return true;
			}

			this.firstNameErrors = [];
			this.lastNameErrors = [];
			this.emailErrors = [];
			this.passwordErrors = [];
			this.termsErrors = [];

			if (!this.validateName(this.firstName)) {
				this.firstNameErrors.push('First name required');
			}
			if (!this.validateName(this.lastName)) {
				this.lastNameErrors.push('Last name required');
			}
			if (!this.validateEmail(this.email)) {
				this.emailErrors.push('Email required');
			}
			if (!this.validatePassword(this.password)) {
				this.passwordErrors.push('Password required');
			}
			if (!this.terms) {
				this.termsErrors.push('You must agree to the Kiva Terms of service & Privacy policy');
			}
			return false;
		},
		handlePostResponse(response) {
			// TODO: Make this better
			if (response.url && response.url.indexOf('/register?') !== -1) {
				// Extract Server Errors from weird url in response
				const errors = this.extractError(response.url);
				this.serverErrors = errors;

				// we are in a failed registration state, signified by the presense of the kiva app register url
				// ex. "https://dev-vm-01.kiva.org/register?doneUrl=lend-vue%3Fpage%3D2&email=matthews%40kiva.org"
				// $emit registration-failed event on error to allow parent to respond
				this.$emit('register-failed');
				this.regFailed = true;
				this.$kvTrackEvent('Register|failed-register');
			} else {
				// $emit registration-successful event once completed to allow parent to respond
				this.$emit('register-successful');
				this.regFailed = false;
				this.$kvTrackEvent('Register|successful-register');
			}

			// Goto doneUrl if present + successful registration
			if (this.doneUrl !== '' && !this.regFailed) {
				this.$router.push(this.doneUrl);
			}

			// Parent component code should show the form if user isn't yet registered
			// - A failed attempt to register will still refresh the page
			// refresh the page if true
			if (this.refresh && !this.regFailed) {
				window.location = window.location;
			}
		},
		extractError(url) {
			let errors;
			const errorArray = [];
			if (url.indexOf('errmsg=') !== -1) {
				// get error string from response.url
				// ex. errmsg=<ul><li>'Last+Name'+is+required.<%2Fli><%2Ful>
				errors = decodeURI(url).substring(url.indexOf('errmsg='));
				errors = decodeURIComponent(errors.replace('errmsg=', '')).replace(/\+/g, ' ');
				// mock up an html element to extract errors from
				const errorEl = document.createElement('div');
				errorEl.innerHTML = errors;
				const errorEls = errorEl.getElementsByTagName('li');
				// loop lis within mock element and extract text
				for (let i = 0; i < errorEls.length; i += 1) {
					const errorText = errorEls[i].textContent.trim();
					errorArray.push(errorText);
				}
			}
			return errorArray;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.register-form {
	.server-errors,
	.validation-errors {
		margin: 1rem 0;

		li {
			list-style: none;
			color: $kiva-accent-red;
			font-weight: 400;
			font-size: $small-text-font-size;
		}
	}

	.featured-text {
		text-align: center;
		color: $dark-gray;
	}

	.register-button {
		width: 100%;
		margin-bottom: rem-calc(20);
	}

	.terms-and-policy {
		line-height: rem-calc(20);
		margin-bottom: rem-calc(20);

		input {
			margin: 0;
		}
	}
}

</style>
