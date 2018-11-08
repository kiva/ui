<template>
	<div id="login-form">
		<form id="loginForm"
			class="login-form"
			ref="loginForm"
			name="loginForm"
			method="post"
			:action="loginActionUrl"
			@submit.prevent.stop="doLogin"
			novalidate>

			<ul v-show="serverErrors" class="server-errors">
				<li v-for="(errorText, index) in serverErrors" :key="index">
					{{ errorText }}
				</li>
			</ul>

			<div class="input-set">
				<label for="email">
					Email
					<input
						type="email"
						name="email"
						v-model="email"
						autofocus
						@blur="validateEmail(email)"
						@keyup.enter="doLogin">
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
						v-model="password"
						maxlength="31"
						@blur="validatePassword(password)"
						@keyup.enter="doLogin">
				</label>
				<p v-if="passwordErrors.length">
					<ul class="validation-errors">
						<li v-for="passwordError in passwordErrors" :key="passwordError">{{ passwordError }}</li>
					</ul>
				</p>
			</div>

			<div class="input-set" v-if="teamName">
				<label for="team">
					Request to join team.
					<a class="helpTip sfHelpTip_old" id="team-info" @click.prevent="triggerTeamLightbox">
						What is this?
					</a>
					<select
						name="team"
						v-model="selectedTeamId"
						class="medium-text-font-size"
					>
						<option :value="teamId">{{ teamName }}</option>
						<option value="">Not now</option>
					</select>
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

			<kv-lightbox
				:visible="teamLbVisible"
				@lightbox-closed="teamLightboxClosed">
				<h2 slot="title">Join the team!</h2>
				<p>
					<!-- eslint-disable-next-line max-len -->
					By joining the {{ teamName }} team you can see your impact, interact with colleagues, and get more out of Kiva.
				</p>
				<div class="join-team-button-container">
					<kv-button class="smaller secondary" @click.native.prevent="setJoinTeamButton(false)">
						No Thanks
					</kv-button>
					<kv-button class="smaller" @click.native.prevent="setJoinTeamButton(true)">
						Join Team
					</kv-button>
				</div>
			</kv-lightbox>


			<KvButton
				class="sign-in-button smaller"
				type="submit"
				name="loginForm_submit">
				Sign in
			</KvButton>

			<input type="hidden" name="currURL" :value="currUrl">
			<!-- Have to pass this crumb in the Header and in the Request -->
			<input type="hidden" id="crumb" name="crumb" :value="crumb">

			<a href="/help/forgot-password"
				class="forgot-password-link"
				v-kv-track-event="['Login','click-forgot-password','ForgotPasswordClick']">
				Forgot your password?
			</a>
		</form>
	</div>
</template>

<script>
import formDataEntries from 'form-data-entries';
import loginRegUtils from '@/plugins/login-reg-mixin';
import KvButton from '@/components/Kv/KvButton';
import KvFacebookButton from '@/components/Kv/KvFacebookButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import LoginQuery from '@/graphql/query/loginQuery.graphql';
import _get from 'lodash/get';
import formValidate from '@/plugins/formValidate';

export default {
	components: {
		KvButton,
		KvFacebookButton,
		KvLightbox,
		LoginQuery,
	},
	inject: ['apollo'],
	mixins: [
		loginRegUtils,
		formValidate
	],
	apollo: {
		query: LoginQuery,
		preFetch: true,
		result({ data }) {
			console.log(data);
			this.salesforceHelpText = _get(data, 'general.salesforceSolution');
			const inviteParamsData = _get(data, 'general.inviteParams.data');
			if (inviteParamsData && inviteParamsData !== 'null') {
				this.teamName = JSON.parse(inviteParamsData).team_name;
				this.teamId = JSON.parse(inviteParamsData).team_id;
				this.selectedTeamId = JSON.parse(inviteParamsData).team_id;
			}
		},
	},
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
			loading: false,
			serverErrors: [],
			defaultLbVisible: false,
			teamLbVisible: false,
			salesforceHelpText: {},
			email: '',
			password: '',
			teamName: '',
			teamId: '',
			selectedTeamId: '',
		};
	},
	created() {
		this.crumb = this.getCookieCrumb();
		if (this.doneUrl !== '') {
			const doneUrlEncoded = encodeURIComponent(this.doneUrl);
			this.loginActionUrl = `${this.loginActionUrl}?doneUrl=${doneUrlEncoded}`;
		}

		// When logging in via ajax, process/login calls alreadyLoggedIn,
		// The response from alreadyLoggedIn executes a background request to the current or doneUrl url
		// This attempts to call a "fast" page rather than the current page (checkout)
		if (typeof window !== 'undefined' && this.doneUrl === '') {
			const doneUrlEncoded = encodeURIComponent(`${window.location.origin}/ui-site-map`);
			this.loginActionUrl = `${this.loginActionUrl}?doneUrl=${doneUrlEncoded}`;
		}
	},
	mounted() {
		this.currUrl = window.location.href;
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		triggerTeamLightbox() {
			this.teamLbVisible = !this.teamLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
		teamLightboxClosed() {
			this.teamLbVisible = false;
		},
		doLogin() {
			this.$kvTrackEvent('Login', 'click-Login-submit', 'LoginButtonClick');

			if (this.validateForm() === true) {
				this.setLoading(true);
				this.runTeamAnalytics();
				const formData = formDataEntries(this.$refs.loginForm);
				this.postForm(this.loginActionUrl, formData);
			}
		},
		runTeamAnalytics() {
			if (this.teamId && this.selectedTeamId) {
				this.$kvTrackEvent('Login', 'nudgeIfNotJoinTeamLightbox', 'Yes');
			} else {
				this.$kvTrackEvent('Login', 'nudgeIfNotJoinTeamLightbox', 'No');
			}
		},
		setJoinTeamButton(joinTeam) {
			if (joinTeam) {
				this.selectedTeamId = this.teamId;
			} else {
				this.selectedTeamId = '';
			}
			this.teamLbVisible = false;
		},
		validateForm() {
			this.validateEmail(this.email);
			this.validatePassword(this.password);

			if (this.emailErrors.length > 0 && this.passwordErrors.length > 0) {
				return false;
			}
			return true;
		},
		handlePostResponse(response) {
			this.setLoading(false);
			// TODO: Make this better
			if (response.url && response.url.indexOf('/login?') !== -1) {
				// Show simple error
				this.serverErrors = ['Login failed. Please try again.'];

				// we are in a failed login state, signified by the presense of the kiva app login url
				// ex. "https://dev-vm-01.kiva.org/login?doneUrl=lend-vue%3Fpage%3D2&email=matthews%40kiva.org"
				// $emit login-failed event on error to allow parent to respond
				this.$emit('login-failed');
				this.loginFailed = true;
				this.$kvTrackEvent('Login', 'failed-login');
			} else {
				// $emit login-successful event once completed to allow parent to respond
				this.$emit('login-successful');
				this.loginFailed = false;
				this.$kvTrackEvent('Login', 'successful-login');
			}

			// Goto doneUrl if present + successful login
			if (this.doneUrl !== '' && !this.loginFailed) {
				this.$router.push(this.doneUrl);
			}

			// refresh the page if true + login didn't fail
			if (this.refresh && !this.loginFailed) {
				// set loading state while page refreshes
				this.setLoading(true);
				const connector = window.location.search === '' ? '?' : '&';
				window.location = `${window.location}${connector}login=success`;
			}
		},
		setLoading(state) {
			this.loading = state;
			this.$emit('login-loading', state);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.login-form {
	.server-errors,
	.validation-errors {
		margin: 1rem 0;

		li {
			list-style: none;
			color: $kiva-accent-red;
			font-weight: $global-weight-highlight;
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

	#team-info {
		font-weight: 300;
	}

	.join-team-button-container {
		margin: 0 auto;
		max-width: 22rem;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		@include breakpoint(medium) {
			flex-direction: row;
		}
	}
}
</style>
