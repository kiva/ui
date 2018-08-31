<template>
	<div id="facebook-register">
		<kv-facebook-button class="fb-button-parent" @click.native.prevent.stop="clickFbLogin" />

		<!-- New Account Lightbox -->
		<kv-lightbox
			id="new-account-lightbox"
			:visible="newAcctLbVisible"
			@lightbox-closed="newAcctLbClosed">
			<h2 slot="title">Create a new account</h2>
			<hr>
			<form
				id="fbLegalPromptForm"
				ref="fbLegalPromptForm"
				class="promptForm"
				@submit.prevent.stop="postKivaFbNewAcctForm">
				<div class="account-visibility">
					<h3>Set my lender page as:</h3>
					<img
						v-if="!newAcctAnon"
						id="fb-pic"
						:src="fbImage"
						width="50"
						height="50">
					<img
						v-else id="anon-pic"
						src="/images/characters/1.jpg"
						width="50"
						height="50">
					<ul>
						<li>
							<label>
								<input
									type="radio"
									name="visibility"
									value="public"
									checked="true"
									@click="newAcctAnon = false"> {{ fbName }}</label>
						</li>
						<li>
							<label>
								<input
									type="radio"
									name="visibility"
									value="anonymous"
									@click="newAcctAnon = true"> Anonymous</label>
						</li>
					</ul>
				</div>

				<div class="terms">
					<label>
						<input
							type="checkbox"
							id="terms_agreement_popup"
							name="terms_agreement_popup"
							v-model="newAcctTerms"
							@click="showNewAcctTermsError = validateTerms()">
						I have read and agree to the Kiva
						<a href="https://dev-vm-01.kiva.org/legal/terms" target="_blank">Terms of Use</a>
						and
						<a href="https://dev-vm-01.kiva.org/legal/privacy" target="_blank">Privacy Policy</a>
					</label>
					<ul v-show="showNewAcctTermsError" class="validation-errors">
						<li>
							You must agree to the Kiva Terms of service &amp; Privacy policy
						</li>
					</ul>
				</div>

				<kv-button type="submit" name="register" class="smaller" value="Register">Register</kv-button>
				<hr>
				<a class="existing-user"
					@click.stop.prevent="showFbExistingAcctLightbox">Already have an account?</a>
			</form>
		</kv-lightbox>

		<!-- Convert Existing Account -->
		<kv-lightbox
			id="existing-account-lightbox"
			:visible="existingAcctLbVisible"
			@lightbox-closed="existingAcctLbClosed">
			<h2 slot="title">Facebook Connect to an existing Kiva account</h2>
			<hr>
			<form
				id="fbExistingPromptForm"
				ref="fbExistingPromptForm"
				class="existingPromptForm"
				@submit.prevent.stop="postKivaFbExistingAcctForm">

				<div class="input-set">
					<label for="email">
						Kiva Email <input
							type="email"
							name="kiva_email"
							id="kiva_email"
							v-model="linkedKivaEmail"
							autocomplete="off"
							@blur="validateEmail(linkedKivaEmail)">
					</label>
					<p v-if="emailErrors.length">
						<ul class="validation-errors">
							<li v-for="emailError in emailErrors" :key="emailError">{{ emailError }}</li>
						</ul>
					</p>
				</div>

				<div class="input-set">
					<label for="password">
						Kiva Password <input
							type="password"
							name="kiva_password"
							id="kiva_password"
							v-model="linkedKivaPW"
							maxlength="31"
							autocomplete="off"
							@blur="validatePassword(linkedKivaPW)">
					</label>
					<p v-if="passwordErrors.length">
						<ul class="validation-errors">
							<li v-for="passwordError in passwordErrors" :key="passwordError">{{ passwordError }}</li>
						</ul>
					</p>
				</div>

				<kv-button type="submit" name="connect" class="smaller" value="continue">Connect</kv-button>
				<hr>
				<a class="new-user" @click.prevent.stop="showFbNewAcctLightbox">New to Kiva?</a>
			</form>
		</kv-lightbox>
	</div>
</template>

<script>
// import loginRegUtils from '@/plugins/login-reg-mixin';
import * as fbUtils from '@/util/fbUtils';
import KvFacebookButton from '@/components/Kv/KvFacebookButton';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import formValidate from '@/plugins/formValidate';

export default {
	components: {
		KvFacebookButton,
		KvLightbox,
		KvButton
	},
	mixins: [
		formValidate
	],
	props: {
		processType: {
			type: String,
			default: 'login'
		},
		doneUrl: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			fbLoginStatus: () => {},
			fbUserInfo: () => {},
			specialFbParams: () => {},
			newAcctLbVisible: false,
			newAcctAnon: false,
			newAcctTerms: false,
			showNewAcctTermsError: false,
			existingAcctLbVisible: false,
			linkedKivaEmail: '',
			linkedKivaPW: ''
		};
	},
	computed: {
		fbImage() {
			if (this.fbUserInfo && this.fbUserInfo.picture && this.fbUserInfo.picture.data) {
				return this.fbUserInfo.picture.data.url;
			}
			return '/images/characters/1.jpg';
		},
		fbName() {
			if (this.fbUserInfo && this.fbUserInfo.first_name) {
				return this.fbUserInfo.first_name;
			}
			return 'Lender';
		}
	},
	methods: {
		clickFbLogin() {
			this.initiateFbLogin();

			if (this.processType === 'register') {
				this.$kvTrackEvent('Register', 'click-facebook-register', 'FacebookRegisterButtonClick');
			} else {
				this.$kvTrackEvent('Login', 'click-facebook-login', 'FacebookLoginButtonClick');
			}
		},
		initiateFbLogin() {
			this.setLoading(true);
			const vm = this;
			// Start by verifying the FB auth status
			return fbUtils.checkFbLoginStatus()
				.then(fbStatusObj => {
					if (fbStatusObj.status === 'connected') {
						// user is logged in to facebook + your app
						console.log(`Already Logged In: ${fbStatusObj.status}`);
						return fbStatusObj;
					}
					// user may be logged into Fb but hasn't authorized your app
					// fbStatusObj.status 'authorization_expired' 'not_authorized' or 'unknown'
					// call login then fetch and load the user
					console.log(`NOT Connected: ${fbStatusObj.status}`);
					return fbUtils.fbLogin();
				})
				.then(loginStatus => {
					console.log(loginStatus);
					// Turn off loading if user exits FB Login Dialog
					if (loginStatus.status === 'unknown') {
						this.setLoading(false);
					}
					// Save the fb status
					vm.fbLoginStatus = loginStatus;
					// Once logged into FB get user info
					return fbUtils.fbFetchUser(loginStatus);
				})
				.then(fbResponse => {
					// Save the fb user info
					vm.fbUserInfo = fbResponse;
					// Attempt Login to Kiva
					return fbUtils.doFbKivaLogin(fbResponse, vm.specialFbParams, vm.doneUrl);
				})
				// Get JSON from Kiva response
				.then(kivaFbResponse => fbUtils.handleKivaResponse(kivaFbResponse))
				// Act on Response from Kiva
				.then(response => {
					console.log(`Parsed Kiva Response: ${JSON.stringify(response)}`);
					// - Success
					if (response.success === true) {
						this.handlePostResponse(response);
					}
					// Prompt (show new account lightbox)
					if (response.prompt !== undefined && response.prompt === true) {
						this.handleKivaFbPrompt(response);
					}
					// TODO: Error Cases
					// Finish the promise regardless

					this.setLoading(false);

					return response;
				})
				.catch(response => {
					console.error(response);
					Promise.reject(response);
				});
		},
		handleKivaFbPrompt() {
			this.showFbNewAcctLightbox();
		},
		showFbNewAcctLightbox() {
			this.newAcctLbVisible = true;
			this.existingAcctLbVisible = false;
		},
		newAcctLbClosed() {
			this.newAcctLbVisible = false;
		},
		showFbExistingAcctLightbox() {
			this.newAcctLbVisible = false;
			this.existingAcctLbVisible = true;
		},
		existingAcctLbClosed() {
			this.existingAcctLbVisible = false;
		},
		validateTerms() {
			return this.newAcctTerms;
		},
		postKivaFbNewAcctForm() {
			this.$kvTrackEvent('Register', 'click-new-fb-register-submit');

			// Validate the termsAgreementPopup is checked
			if (!this.validateTerms()) {
				// show error here
				this.showNewAcctTermsError = true;
			} else {
				// Set special params
				this.specialFbParams = {
					visibility: this.newAcctAnon ? 'anonymous' : 'public',
					newAccount: 1,
					auto_join_default_team: false
				};
				// retry login sequence
				this.initiateFbLogin()
					.then(response => {
						// check for success status before firing success event
						if (response.success) {
							this.$kvTrackEvent('Register', 'successful-fb-register', 'new-account');
						} else {
							console.error(`initiateFebLogin response: ${response}`);
						}
					});
			}
		},
		validateFbExistingAcctForm() {
			this.validateEmail(this.linkedKivaEmail);
			this.validatePassword(this.linkedKivaPW);

			if (this.emailErrors.length > 0 && this.passwordErrors.length > 0) {
				return false;
			}
			return true;
		},
		postKivaFbExistingAcctForm() {
			this.$kvTrackEvent('Register', 'click-existing-fb-register-submit');

			if (this.validateFbExistingAcctForm() === true) {
				// Set special params
				this.specialFbParams = {
					kiva_email: this.linkedKivaEmail || '',
					kiva_password: this.linkedKivaPW || '',
					linkAccount: 1,
					auto_join_default_team: false
				};
				// retry login sequence
				this.initiateFbLogin()
					.then(response => {
						// check for success status before firing success event
						if (response.success) {
							this.$kvTrackEvent('Register', 'successful-fb-register', 'existing-account');
						} else {
							console.error(`initiateFebLogin response: ${response}`);
						}
					});
			}
		},
		handlePostResponse(response) {
			console.log(`Handle post response: ${JSON.stringify(response)}`);
			// If we've successfully logged in with the FB Account refresh the page
			if (response.success === true) {
				// if this is a login processType fire an event (register events are handled elsewhere)
				if (this.processType === 'login') {
					this.$kvTrackEvent('Login', 'successful-fb-login');
				}
				// refresh or redirect actions
				if (this.doneUrl !== '') {
					window.location = `${document.location.origin}/${this.doneUrl}`;
				} else {
					window.location = window.location;
				}
			}
		},
		setLoading(state) {
			this.loading = state;
			this.$emit('fb-loading', state);
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.fb-button-parent {
	margin-bottom: 0.25rem;
}

#new-account-lightbox,
#existing-account-lightbox {
	.lightbox-content {
		max-width: 22rem;

		h2 {
			font-weight: 700;
		}

		h3 {
			margin-bottom: 1.25rem;
			font-weight: 400;
		}
	}

	form {
		.validation-errors {
			margin: 1rem 0;

			li {
				list-style: none;
				color: $kiva-accent-red;
				font-weight: 400;
				font-size: $small-text-font-size;
			}
		}
	}
}

#new-account-lightbox {
	form {
		.terms {
			margin: 0 0 1.5rem;

			label {
				line-height: 1.5;
				font-size: initial;

				input {
					display: block;
					float: left;
					margin: 0.2rem 0.5rem 1.4rem 0;
				}
			}

			.new-acct-terms-error {
				margin: 0 0 0.3rem;
				color: $kiva-accent-red;
				font-weight: 400;
				font-size: $small-text-font-size;
				line-height: 1.2;
			}
		}

		.account-visibility {
			margin: 0 0 1.5rem;

			img {
				display: block;
				float: left;
			}

			ul {
				list-style: none;
				margin: 0 0 0 4rem;

				li {
					line-height: 1rem;

					label {
						font-size: initial;
						line-height: 1.4;

						input {
							margin: 0 0.25rem 0.5rem 0;
						}

						a {
							font-weight: normal;
						}
					}
				}
			}
		}
	}
}
</style>
