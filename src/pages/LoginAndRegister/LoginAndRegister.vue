<template>
	<www-page>
		<form id="loginForm"
			@submit="loginForm"
			action=""
			method="post"
			class="small-12 large-3 login-form">

			<KvButton>FACEBOOK BUTTON HERE</KvButton>
			<hr>
			<div class="featured-text">Or use your email</div>

			<label for="email">
				Email <input type="email" name="email" class="input-spacing bottom-spacing" autofocus>
			</label>

			<label for="password">
				Password <input type="password" name="password" maxlength="31" class="input-spacing bottom-spacing">
			</label>

			<div class="bottom-spacing">
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

			<KvButton class="sign-in-button" type="submit">Sign in</KvButton>

			<a href="/help/forgot-password" class="forgot-password-link">Forgot your password?</a>
			<a href="/register" class="register-link">Sign up for Kiva</a>
		</form>

		<hr class="spacer">

		<form id="registerForm"
			@submit="registerForm"
			action=""
			method="post"
			class="small-12 large-3 register-form">

			<KvButton>FACEBOOK BUTTON HERE</KvButton>
			<hr>
			<div class="featured-text">Or</div>

			<label for="firstname">
				First name
				<input type="text" name="firstname" maxlength="40" class="input-spacing bottom-spacing" autofocus>
			</label>

			<label for="lastname">
				Last name <input type="text" name="lastname" maxlength="40" class="input-spacing bottom-spacing">
			</label>

			<label for="email">
				Email <input type="email" name="email" maxlength="100" class="input-spacing bottom-spacing">
			</label>

			<label for="password">
				Password <input type="password" name="password" maxlength="31" class="input-spacing bottom-spacing">
			</label>

			<div class="bottom-spacing terms-and-policy">
				<input type="checkbox" name="persist_login" id="registerForm_terms_of_use_privacy_poicy">
				I have read and agree to the
				<a href="legal/terms" target="_blank"
					title="Open Terms of Use in a new window"
					class="">Terms of Use
				</a> and
				<a href="legal/privacy" target="_blank"
					title="Open Privacy Policy in a new window"
					class="">Privacy Policy
				</a>.
			</div>
			<KvButton class="register-button bottom-spacing" type="submit">Continue</KvButton>
		</form>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';
// import Popper from 'popper.js';

export default {
	components: {
		WwwPage,
		KvButton,
	},
	data() {
		return {
			popper: null,
		};
	},
	mounted: {
		// https://matwrites.com/create-beautiful-tooltips-with-popper-js-tooltip-js/
	},
};
</script>
<style lang="scss" scoped>
@import 'settings';

// This spacer will need be deleted
.spacer {
	margin: 150px 0;
}

.login-form,
.register-form {
	margin: 0 rem-calc(10);

	@include breakpoint(large) {
		margin: 0 auto;
	}

	.featured-text {
		text-align: center;
		color: $dark-gray;
	}

	label {
		font-weight: 400;
		font-size: rem-calc(18);
	}

	.input-spacing {
		padding: rem-calc(5) rem-calc(7);
	}

	.bottom-spacing {
		margin-bottom: rem-calc(20);
	}

	.sign-in-button,
	.register-button {
		width: 100%;
	}

	.forgot-password-link,
	.register-link {
		display: block;
		text-align: center;
		margin-bottom: rem-calc(15);
	}

	.terms-and-policy {
		line-height: rem-calc(20);

		input {
			margin: 0;
		}
	}
}

</style>
