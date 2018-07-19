<template>
	<form id="registerForm"
		action=""
		method="post"
		class="small-12 large-3 register-form">

		<KvButton>FACEBOOK BUTTON HERE</KvButton>
		<hr>
		<div class="featured-text">Or</div>

		<div class="input-set">
			<label for="firstname">
				First name
				<input type="text" name="firstname" maxlength="40" autofocus>
			</label>
		</div>

		<div class="input-set">
			<label for="lastname">
				Last name <input type="text" name="lastname" maxlength="40">
			</label>
		</div>

		<div class="input-set">
			<label for="email">
				Email <input type="email" name="email" maxlength="100">
			</label>
		</div>

		<div class="input-set">
			<label for="password">
				Password <input type="password" name="password" maxlength="31">
			</label>
		</div>

		<div class="terms-and-policy">
			<input type="checkbox" name="persist_login" id="registerForm_terms_of_use_privacy_poicy">
			I have read and agree to the
			<a href="legal/terms"
				target="_blank"
				title="Open Terms of Use in a new window">Terms of Use
			</a> and
			<a href="legal/privacy"
				target="_blank"
				title="Open Privacy Policy in a new window">Privacy Policy
			</a>.
		</div>
		<KvButton class="register-button" type="submit">Continue</KvButton>
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

.register-form {
	margin: 0 rem-calc(10);

	@include breakpoint(large) {
		margin: 0 auto;
	}

	.featured-text {
		text-align: center;
		color: $dark-gray;
	}

	.register-button {
		width: 100%;
		margin-bottom: rem-calc(20);
	}

	.terms-and-policy {
		line-height: rem-calc(20);
		margin-bottom: rem-calc(20);

		input {
			margin: 0;
		}
	}
}

</style>
