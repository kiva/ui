<template>
	<www-page>
		<div class="row page-content">
			<div class="columns">
				<div v-if="showReg" class="switch-to-login text-center">
					Already have an account? <a
						@click.prevent.stop="switchToLogin"
						v-kv-track-event="['register', 'alreadyMemberLnk']"
						id="loginLink">Sign in</a>
					<hr>
				</div>

				<facebook-login-register />
				<p class="fb-help text-center">We won't post to Facebook without asking.</p>
				<hr>
				<div class="featured-text text-center">Or use your email</div>

				<login-form v-if="showLogin" done-url="lend-vue?page=2" @switchtoregister="switchToRegister" />

				<register-form v-if="showReg" :refresh="true" @switchtologin="switchToLogin" />

				<p class="text-center">
					<a v-if="showLogin" class="register-link text-center"
						v-kv-track-event="'Login|click-Sign-up-register|SignupForKivaClick'"
						@click.prevent.stop="switchToRegister">
						Sign up for Kiva
					</a>
				</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import LoginForm from '@/components/Forms/LoginForm';
import RegisterForm from '@/components/Forms/RegisterForm';
import FacebookLoginRegister from '@/components/Forms/FacebookLoginRegister';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
		LoginForm,
		RegisterForm,
		FacebookLoginRegister
	},
	data() {
		return {
			showReg: false,
			showLogin: true
		};
	},
	methods: {
		switchToRegister() {
			this.showReg = true;
			this.showLogin = false;
		},
		switchToLogin() {
			this.showReg = false;
			this.showLogin = true;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem rem-calc(10);
	max-width: 340px;
}
@include breakpoint(medium) {
	padding: 1.625rem 0;
}

.switch-to-login {
	font-weight: 400;
	font-size: 1.1rem;
}

.fb-help {
	font-size: 0.9rem;
	line-height: 1rem;
	color: $kiva-text-light;
	font-weight: 400;
}

// Control form layouts from parent to allow independence in other layouts
.login-form,
.register-form {
	max-width: rem-calc(280);
	margin: 0 auto;
}

// This spacer will be deleted
.spacer {
	margin: rem-calc(75) 0;
}
</style>
