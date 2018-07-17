<template>
	<www-page>
		<div id="loginForm" class="small-2 loginForm">
			<KvButton>FACEBOOK BUTTON HERE</KvButton>
			<hr>
			<div class="featured-text">Or use your email</div>

			<label for="loginForm_email">Email</label>
			<input type="email" name="email">

			<label for="loginForm_pass">Password</label>
			<input id="loginForm_pass" type="password" name="password">

			<KvButton class="login" type="submit">Sign in</KvButton>
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

.loginForm {
	margin: 0 auto;

	.featured-text {
		text-align: center;
		color: $charcoal;
	}

	.login {
		width: 100%;
	}
}

</style>
