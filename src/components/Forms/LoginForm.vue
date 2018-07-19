<template>
	<form id="loginForm"
		@submit="loginForm"
		action=""
		method="post"
		class="small-12 large-3 login-form">

		<KvButton>FACEBOOK BUTTON HERE</KvButton>
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

		<KvButton class="sign-in-button" type="submit">Sign in</KvButton>

		<a href="/help/forgot-password" class="forgot-password-link">Forgot your password?</a>
		<a href="/register" class="register-link">Sign up for Kiva</a>
	</form>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
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
