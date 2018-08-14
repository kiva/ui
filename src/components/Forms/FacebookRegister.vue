<template>
	<div id="facebook-register">
		<kv-facebook-button @click.native.prevent.stop="initiateFbLogin" />

		<kv-lightbox
			id="new-account-lightbox"
			:visible="newAcctLbVisible"
			@lightbox-closed="newAcctLbClosed">
			<h2 slot="title">Create a new account</h2>
			<form
				id="fbLegalPromptForm"
				ref="fbLegalPromptForm"
				class="promptForm"
				@submit.prevent.stop="postKivaFbNewAcctForm">
				<div class="account-visibility">
					<p>Create my lender page as</p>
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
							<input
								type="radio"
								name="visibility"
								value="public"
								checked="true"
								@click="newAcctAnon = false">
							<label>{{ fbName }}</label>
						</li>
						<li>
							<input
								type="radio"
								name="visibility"
								value="anonymous"
								@click="newAcctAnon = true">
							<label>Anonymous</label>
						</li>
					</ul>
				</div>

				<div class="terms">
					<div id="terms_agreement_error"></div>
					<label>
						<input
							type="checkbox"
							id="terms_agreement_popup"
							name="terms_agreement_popup"
							ref="termsAgreementPopup">
						I have read and agree to the Kiva
						<a href="https://dev-vm-01.kiva.org/legal/terms" target="_blank">Terms of Use</a>
						and
						<a href="https://dev-vm-01.kiva.org/legal/privacy" target="_blank">Privacy Policy</a>
					</label>
				</div>

				<div class="">
					<kv-button type="submit" name="register" class="smaller" value="Register">Register</kv-button>
					<br>
					<a class="existing_user">Already have an account?</a>
				</div>
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

export default {
	components: {
		KvFacebookButton,
		KvLightbox,
		KvButton
	},
	// mixins: [
	// 	loginRegUtils,
	// ],
	data() {
		return {
			fbLoginStatus: () => {},
			fbUserInfo: () => {},
			specialFbParams: () => {},
			newAcctLbVisible: false,
			newAcctAnon: false,
		};
	},
	computed: {
		fbImage() {
			if (this.fbUserInfo && this.fbUserInfo.picture && this.fbUserInfo.picture.data) {
				return this.fbUserInfo.picture.data.url;
			}
			return null;
		},
		fbName() {
			if (this.fbUserInfo && this.fbUserInfo.first_name) {
				return this.fbUserInfo.first_name;
			}
			return null;
		}
	},
	mounted() {
		console.log('mounted fb register');
		fbUtils.checkFbLoginStatus()
			.then(response => {
				console.log(response);
				this.fbLoginStatus = response;
			}).catch(response => {
				console.log(response);
				this.fbLoginStatus = response;
			});
	},
	methods: {
		newAcctLbClosed() {
			console.log('new account lightbox closed');
		},
		initiateFbLogin() {
			const vm = this;
			fbUtils.checkFbLoginStatus()
				.then(fbStatusObj => {
					console.log(fbStatusObj);
					vm.fbLoginStatus = fbStatusObj;
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
					vm.fbLoginStatus = loginStatus;
					return fbUtils.fbFetchUser(loginStatus);
				})
				.then(fbResponse => {
					console.log(fbResponse);
					vm.fbUserInfo = fbResponse;
					return fbUtils.doFbKivaLogin(fbResponse, vm.specialFbParams);
				})
				.then(kivaFbResponse => fbUtils.handleKivaResponse(kivaFbResponse))
				.then(response => {
					console.log(response);
					if (response.prompt !== undefined && response.prompt === true) {
						this.handleKivaFbPrompt(response);
					}
				})
				.catch(response => {
					console.log(response);
					Promise.reject(response);
				});
			// return fbUtils.initiateFbLogin()
			// 	.then(response => {
			// 		console.log(response);
			// 		if (response.prompt !== undefined && response.prompt === true) {
			// 			this.handleKivaFbPrompt(response);
			// 		}
			// 	});
		},
		handleKivaFbPrompt(response) {
			console.log(response);
			this.newAcctLbVisible = true;
		},
		postKivaFbNewAcctForm() {
			// Validate the termsAgreementPopup is checked
			console.log(this.$refs.termsAgreementPopup);
			// Set special params
			this.specialFbParams = {
				visibility: this.newAcctAnon ? 'anonymous' : 'public',
				newAccount: 1
			};
			// retry login sequence
			this.initiateFbLogin();
		},
		// handlePostResponse(response) {
		// 	console.log(response);
		// },
	}
};
</script>

<style lang="scss">
#new-account-lightbox form {
	max-width: rem-calc(300);
}
</style>
