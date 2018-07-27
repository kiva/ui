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

		<ul v-show="serverErrors" class="server-errors">
			<li v-for="(errorText, index) in serverErrors" :key="index">
				{{ errorText }}
			</li>
		</ul>

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
			<a class="helpTip sfHelpTip_old"
				id="persist_login_details"
				@click.prevent="triggerDefaultLightbox">
				Details
			</a>
		</div>

		<kv-lightbox
			:visible="defaultLbVisible"
			@lightbox-closed="lightboxClosed">
			<h2 slot="title">{{ salesforceHelpText.name }}</h2>
			<p>{{ salesforceHelpText.note }}</p>
		</kv-lightbox>

		<KvButton class="sign-in-button smaller" type="submit">Sign in</KvButton>

		<input type="hidden" name="currURL" :value="currUrl">
		<!-- Have to pass this crumb in the Header and in the Request -->
		<input type="hidden" id="crumb" name="crumb" :value="crumb">

		<a href="/help/forgot-password" class="forgot-password-link">Forgot your password?</a>
		<a href="/register" class="register-link">Sign up for Kiva</a>
	</form>
</template>

<script>
import loginRegUtils from '@/plugins/login-reg-mixin';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import SalesforceHelpTextQuery from '@/graphql/query/salesforceLoginHelpText.graphql';
import _get from 'lodash/get';

export default {
	components: {
		KvButton,
		KvLightbox,
		SalesforceHelpTextQuery,
	},
	inject: ['apollo'],
	mixins: [loginRegUtils],
	props: {
		// Add the done-url="lend-vue?page=2" (Path Only) parameter to redirect on successful login
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
			serverErrors: [],
			defaultLbVisible: false,
			salesforceHelpText: {},
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
	apollo: {
		query: SalesforceHelpTextQuery,
		preFetch: true,
		result({ data }) {
			this.salesforceHelpText = _get(data, 'general.salesforceSolution');
		},
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		doLogin() {
			// this.loading = true;
			const formData = new FormData(this.$refs.loginForm);
			this.postForm(this.loginActionUrl, formData);
		},
		handlePostResponse(response) {
			// TODO: Make this better
			if (response.url && response.url.indexOf('/login?') !== -1) {
				// Show simple error
				this.serverErrors = ['Login failed. Please try again.'];

				// we are in a failed login state, signified by the presense of the kiva app login url
				// ex. "https://dev-vm-01.kiva.org/login?doneUrl=lend-vue%3Fpage%3D2&email=matthews%40kiva.org"
				// $emit login-failed event on error to allow parent to respond
				this.$emit('login-failed');
				this.loginFailed = true;
			} else {
				// $emit login-successful event once completed to allow parent to respond
				this.$emit('login-successful');
				this.loginFailed = false;
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
	.server-errors {
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
