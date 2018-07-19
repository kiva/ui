<template>
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
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		WwwPage,
		KvButton,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.login-form {
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

	.sign-in-button {
		width: 100%;
	}

	.forgot-password-link {
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
