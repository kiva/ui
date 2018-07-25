<template>
	<form id="loginForm"
		class="login-form"
		ref="loginForm"
		name="loginForm"
		method="post"
		:action="loginActionUrl"
		@submit.prevent.stop="doLogin">

		<KvButton class="smaller">FACEBOOK BUTTON HERE</KvButton>
		<hr>
		<div class="featured-text">Or use your email</div>

		<div class="input-set">
			<label for="email">
				Email <input type="email" name="email" autofocus>
			</label>
		</div>

		<div class="input-set">
			<label for="password">
				Password <input type="password" name="password" maxlength="31">
			</label>
		</div>

		<div class="persist-login-wrap">
			<input type="checkbox" name="persist_login" id="loginForm_persist_login">
			<span id="keep_me_signed_id" style="cursor: pointer;">Keep me signed in.</span>
			<a class="helpTip sfHelpTip_old "
				data-tooltip="http://na3.salesforce.com/_ui/selfservice/pkb/
				PublicKnowledgeSolution/d?orgId=00D500000006svl&amp;id=50150000000TCyi"
				href="http://na3.salesforce.com/_ui/selfservice/pkb/
				PublicKnowledgeSolution/d?orgId=00D500000006svl&amp;id=50150000000TCyi"
				id="persist_login_details">Details
			</a>
		</div>

		<KvButton class="sign-in-button smaller" type="submit">Sign in</KvButton>

		<input type="hidden" name="currURL" :value="currUrl">
		<!-- Have to pass this crumb in the Header and in the Request -->
		<input type="hidden" id="crumb" name="crumb" :value="crumb">

		<a href="/help/forgot-password" class="forgot-password-link">Forgot your password?</a>
		<a href="/register" class="register-link">Sign up for Kiva</a>
	</form>
</template>

<script>
import cookie from 'js-cookie';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	metaInfo: {
		title: 'Sign in'
	},
	inject: ['apollo'],
	props: {
		// Add the done-url="https://dev-vm-01.kiva.org/lend-vue?page=2" parameter to redirect on successful login
		doneUrl: {
			type: String,
			default: ''
		},
		// Bind the :refresh="true" parameter when adding this component to force refresh on successful login
		// -> This mode is meant for an embedded login form scenario, form exists if the user isn't logged in
		refresh: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loginActionUrl: '/login/process',
			currUrl: this.$route.path,
			crumb: '',
			loginFailed: false,
			loading: false, // TODO: Add loading state v-show="!loading && !userId"
		};
	},
	created() {
		this.crumb = this.getCookieCrumb();
		if (this.doneUrl !== '') {
			const doneUrlEncoded = encodeURIComponent(this.doneUrl);
			this.loginActionUrl = `${this.loginActionUrl}?doneUrl=${doneUrlEncoded}`;
		}
	},
	mounted() {
		this.currUrl = window.location.href;
	},
	methods: {
		getCookieCrumb() {
			let crumb = '';
			let kvisCookie = '';

			if (this.$ssrContext) {
				kvisCookie = this.$ssrContext.cookies.kvis || '';
			} else {
				kvisCookie = cookie.get('kvis');
			}

			crumb = kvisCookie.replace('crumb=', '') || '';
			return crumb;
		},
		postForm(actionUrl, formData) {
			// expand the elements from the .entries() iterator into an actual array
			const parameters = [...formData.entries()]
				// transform the elements into encoded key-value-pairs
				.map(e => `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`);

			fetch(actionUrl, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				redirect: 'follow', // manual, *follow, error
				referrer: 'no-referrer', // no-referrer, *client
				// convert parameters into string ie. key=value&key=value...
				body: parameters.join('&')
			})
				.then(response => {
					// The response will be the doneUrl if passed or the current url page loaded
					this.handleLoginResponse(response);
				})
				.catch(error => {
					console.error('Fetch Error =\n', error);
					// $emit login-failed event on error to allow parent to respond
					this.$emit('login-failed');
				});
		},
		doLogin() {
			// this.loading = true;
			const formData = new FormData(this.$refs.loginForm);
			this.postForm(this.loginActionUrl, formData);
		},
		handleLoginResponse(response) {
			// TODO: Make this better
			if (response.url && response.url.indexOf('/login?') !== -1) {
				// we are in a failed login state, signified by the presense of the kiva app login url
				// ex. "https://dev-vm-01.kiva.org/login?doneUrl=lend-vue%3Fpage%3D2&email=matthews%40kiva.org"
				// $emit login-failed event on error to allow parent to respond
				this.$emit('login-failed');
				this.loginFailed = true;
			} else {
				// $emit login-successful event once completed to allow parent to respond
				this.$emit('login-successful');
			}

			// Goto doneUrl if present + successful login
			if (this.doneUrl !== '' && !this.loginFailed) {
				this.$router.push(this.doneUrl);
			}

			// Parent component code should show the form if user isn't yet logged in
			// - A failed attempt to login will still refresh the page
			// refresh the page if true
			if (this.refresh && !this.loginFailed) {
				window.location = window.location;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.login-form {
	.featured-text {
		text-align: center;
		color: $dark-gray;
	}

	.persist-login-wrap {
		margin-bottom: rem-calc(20);
		line-height: rem-calc(20);

		input {
			margin: 0;
		}
	}

	.sign-in-button {
		width: 100%;
		margin-bottom: rem-calc(20);
	}

	.forgot-password-link,
	.register-link {
		display: block;
		text-align: center;
		margin-bottom: rem-calc(15);
	}
}
</style>
