<template>
	<www-page>
		<div id="loginForm" class="small-3 login-form">
			<KvButton>FACEBOOK BUTTON HERE</KvButton>
			<hr>
			<div class="featured-text">Or use your email</div>

			<h3 class="input-label">Email</h3>
			<input type="email" name="email" class="bottom-spacing">

			<h3 class="input-label">Password</h3>
			<input type="password" name="password" class="bottom-spacing">

			<div class="bottom-spacing">
				<input type="checkbox" name="persist_login" id="loginForm_persist_login">
				<span id="keep_me_signed_id" style="cursor: pointer;">Keep me signed in.</span>
				<a class="helpTip sfHelpTip_old "
					href="http://na3.salesforce.com/_ui/selfservice/pkb/
					PublicKnowledgeSolution/d?orgId=00D500000006svl&amp;id=50150000000TCyi"
					id="persist_login_details">Details
				</a>
			</div>

			<KvButton class="sign-in-button" type="submit">Sign in</KvButton>

			<a href="/help/forgot-password" class="forgot-password-link">Forgot your password?</a>
			<a href="/register" class="register-link">Sign up for Kiva</a>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		WwwPage,
		KvButton,
	}
};
</script>
<style lang="scss" scoped>
@import 'settings';

.login-form {
	margin: 0 auto;

	.featured-text {
		text-align: center;
		color: $dark-gray;
	}

	.input-label {
		font-weight: 500;
	}

	.bottom-spacing {
		margin-bottom: rem-calc(20);
	}

	.sign-in-button {
		width: 100%;
	}

	.forgot-password-link,
	.register-link {
		display: block;
		text-align: center;
		margin-bottom: rem-calc(15);
	}
}

</style>
