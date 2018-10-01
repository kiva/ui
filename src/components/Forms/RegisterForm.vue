<template>
	<div id="register-form">
		<form id="registerForm"
			class="register-form"
			ref="regForm"
			name="regForm"
			method="post"
			:action="regActionUrl"
			@submit.prevent.stop="register"
			novalidate>

			<ul v-show="serverErrors" class="server-errors">
				<li v-for="(errorText, index) in serverErrors" :key="index">
					{{ errorText }}
				</li>
			</ul>

			<div class="input-set" v-if="showFirstName">
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
				<p v-if="nameErrors.length">
					<ul class="validation-errors">
						<li v-for="nameError in nameErrors" :key="nameError">{{ nameError }}</li>
					</ul>
				</p>
			</div>
			<!-- If first name is hidden use a hidden field -->
			<input v-else type="hidden" name="firstName" v-model="firstName">

			<div class="input-set" v-if="showLastName">
				<label for="lastName">
					Last name <input
						type="text"
						name="lastName"
						maxlength="40"
						v-model="lastName"
						@blur="validateName(lastName)">
				</label>
				<p v-if="nameErrors.length">
					<ul class="validation-errors">
						<li v-for="nameError in nameErrors" :key="nameError">{{ nameError }}</li>
					</ul>
				</p>
			</div>
			<!-- If last name is hidden use a hidden field -->
			<input v-else type="hidden" name="lastName" v-model="lastName">

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
				<label for="password">Password
					<div v-if="showMeteredPassword">
						<metered-password
							name="password"
							v-model="password"
							class="reg-password"
							:secure-length="8" />
					</div>
					<div v-else>
						<input
							id="password"
							type="password"
							name="password"
							v-model="password"
							class="reg-password">
					</div>
				</label>
				<p v-if="passwordErrors.length">
					<ul class="validation-errors">
						<li v-for="passwordError in passwordErrors" :key="passwordError">{{ passwordError }}</li>
					</ul>
				</p>
			</div>

			<div class="terms-and-policy">
				<label for="registerForm_terms_of_use_privacy_poicy">
					<input
						type="checkbox"
						name="terms_agreement"
						id="registerForm_terms_of_use_privacy_poicy"
						v-model="terms"
						@change="validateTerms(terms)">
					I have read and agree to the
					<a href="legal/terms"
						target="_blank"
						title="Open Terms of Use in a new window"
						v-kv-track-event="['Register','click-terms-of-use','TermsOfUseClick']">
						Terms of Use
					</a> and
					<a href="legal/privacy"
						target="_blank"
						title="Open Privacy Policy in a new window"
						v-kv-track-event="['Register','click-privacy-policy','PrivacyPolicyClick']">
						Privacy Policy
					</a>.
				</label>
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
				v-kv-track-event="['Register','click-register-submit','RegisterButtonClick']">
				Continue
			</KvButton>

			<input type="hidden" name="currURL" :value="currUrl">
			<!-- Have to pass this crumb in the Header and in the Request -->
			<input type="hidden" id="regcrumb" name="crumb" :value="crumb">
		</form>
	</div>
</template>

<script>
import formDataEntries from 'form-data-entries';
import loginRegUtils from '@/plugins/login-reg-mixin';
import { readJSONSetting } from '@/util/settingsUtils';
import regExpQuery from '@/graphql/query/register/registerExpAssignment.graphql';
import regExpDataQuery from '@/graphql/query/register/registerExpData.graphql';
import KvButton from '@/components/Kv/KvButton';
import formValidate from '@/plugins/formValidate';

export default {
	components: {
		KvButton,
		MeteredPassword: () => import('vue-password-strength-meter/dist/vue-password-strength-meter.min'),
	},
	inject: ['apollo'],
	mixins: [
		loginRegUtils,
		formValidate,
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
		},
	},
	data() {
		return {
			regActionUrl: '/register/process',
			currUrl: this.$route.path,
			crumb: '',
			regFailed: false,
			loading: false,
			serverErrors: [],
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			terms: false,
			showMeteredPassword: false,
			pwEventsBound: false,
			expVersion: '',
			expName: '',
			showFirstName: true,
			showLastName: true
		};
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: regExpDataQuery
				}).then(() => {
					// Get the assigned experiment version
					client.query({ query: regExpQuery }).then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		this.setupExperimentState();

		this.crumb = this.getCookieCrumb();
		if (this.doneUrl !== '') {
			const doneUrlEncoded = encodeURIComponent(this.doneUrl);
			this.regActionUrl = `${this.regActionUrl}?doneUrl=${doneUrlEncoded}`;
		}

		// When logging in via ajax, process/register calls alreadyLoggedIn,
		// The response from alreadyLoggedIn executes a background request to the current or doneUrl url
		// This attempts to call a "fast" page rather than the current page (checkout)
		if (typeof window !== 'undefined' && this.doneUrl === '') {
			const doneUrlEncoded = encodeURIComponent(`${window.location.origin}/ui-site-map`);
			this.loginActionUrl = `${this.loginActionUrl}?doneUrl=${doneUrlEncoded}`;
		}
	},
	mounted() {
		this.currUrl = window.location.href;
		// activate metered password component
		this.showMeteredPassword = true;
	},
	updated() {
		// when the dom updates, check that showMeteredPassword is true
		if (this.showMeteredPassword) {
			// if so on next tick bind the blur events
			this.$nextTick(() => {
				if (document.getElementById('password') && !this.pwEventsBound) {
					// flipping this switch will ensure events aren't repeatedly bound
					// TODO: find a better way to detect this element and apply events
					this.pwEventsBound = true;
					this.bindMeteredPasswordEvents();
				}
			});
		}
	},
	methods: {
		register() {
			if (this.validateForm() === true) {
				this.setLoading(true);
				const formData = formDataEntries(this.$refs.regForm);
				this.postForm(this.regActionUrl, formData);
			}
		},
		validateForm() {
			this.validateName(this.firstName);
			this.validateName(this.lastName);
			this.validateEmail(this.email);
			this.validatePassword(this.password);
			this.validateTerms(this.terms);

			// eslint-disable-next-line
			if (this.nameErrors.length > 0 && this.emailErrors.length > 0 && this.passwordErrors.length > 0 && this.termsErrors.length > 0) {
				return false;
			}
			return true;
		},
		handlePostResponse(response) {
			this.setLoading(false);

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
				this.$kvTrackEvent('Register', 'failed-register');
			} else {
				// $emit registration-successful event once completed to allow parent to respond
				this.$emit('register-successful');
				this.regFailed = false;
				this.$kvTrackEvent('Register', 'successful-register');
			}

			// Goto doneUrl if present + successful registration
			if (this.doneUrl !== '' && !this.regFailed) {
				this.$router.push(this.doneUrl);
			}

			// Parent component code should show the form if user isn't yet registered
			// - A failed attempt to register will still refresh the page
			// refresh the page if true
			if (this.refresh && !this.regFailed) {
				// set loading state while page refreshes
				this.setLoading(true);
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
		},
		bindMeteredPasswordEvents() {
			const passwordInput = document.getElementById('password');
			// Hooked directly into DOM events because the library we're using
			// (vue-password-strength-meter) doesn't allow us access to the blur event we needed.
			passwordInput.addEventListener('blur', e => {
				this.validatePassword(e.target.value);
			});
		},
		setLoading(state) {
			this.loading = state;
			this.$emit('reg-loading', state);
		},
		setupExperimentState() {
			// get assigned exp version from apollo cache
			const regExpVersion = this.apollo.readQuery({ query: regExpQuery });
			this.expVersion = regExpVersion.experiment.version;

			// get experiment data from apollo cache
			// - only required at this point for the variant name or other associated data
			const regExpSetting = this.apollo.readQuery({ query: regExpDataQuery });
			const expData = readJSONSetting(regExpSetting, 'general.experiment.value') || {};
			if (this.expVersion !== 'control') {
				this.expName = expData.variants[this.expVersion].name;
			}

			// Set up + track our First Name Only State
			if (this.expVersion === 'variant-a') {
				this.lastName = 'Kiva Love';
				this.showLastName = false;

				this.$kvTrackEvent('Ui-Register', 'EXP-RegFormFields', this.expName);
			}

			// Set up + track our No Names State
			if (this.expVersion === 'variant-b') {
				this.firstName = 'Lender';
				this.lastName = 'Kiva';
				this.showFirstName = false;
				this.showLastName = false;

				this.$kvTrackEvent('Ui-Register', 'EXP-RegFormFields', this.expName);
			}

			// No Set up for control, just track
			if (this.expVersion === 'control') {
				this.$kvTrackEvent('Ui-Register', 'EXP-RegFormFields', this.expVersion);
			}
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

	.input-set {
		label {
			font-weight: normal;
			font-size: 1rem;
			color: $charcoal;
		}

		input {
			color: $charcoal;
		}
	}

	// https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
	.reg-password >>> .Password__badge {
		height: rem-calc(19) !important;
	}

	.reg-password >>> .Password__strength-meter {
		height: 0.4375rem;
		border-radius: rem-calc(8);
	}

	.reg-password >>> .Password__badge--success {
		background: $green;
	}

	.reg-password >>> .Password__strength-meter::before,
	.reg-password >>> .Password__strength-meter::after {
		display: none;
	}

	.reg-password >>> .Password__strength-meter--fill[data-score="0"],
	.reg-password >>> .Password__strength-meter--fill[data-score="1"],
	.reg-password >>> .Password__strength-meter--fill[data-score="2"] {
		background: $kiva-accent-red;
	}

	.reg-password >>> .Password__strength-meter--fill[data-score="3"],
	.reg-password >>> .Password__strength-meter--fill[data-score="4"] {
		background: $green;
	}

	.register-button {
		width: 100%;
		margin-bottom: rem-calc(20);
	}

	.terms-and-policy {
		margin-bottom: rem-calc(20);

		label {
			line-height: $small-text-line-height;
			color: $charcoal;

			input {
				line-height: $small-text-line-height;
				float: left;
				margin: 0.4rem 0.4rem 1rem 0;
			}
		}
	}
}

</style>
