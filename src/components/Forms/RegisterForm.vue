<template>
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
			<a href="legal/terms"
				target="_blank"
				title="Open Terms of Use in a new window"
				class="">Terms of Use
			</a> and
			<a href="legal/privacy"
				target="_blank"
				title="Open Privacy Policy in a new window"
				class="">Privacy Policy
			</a>.
		</div>
		<KvButton class="register-button bottom-spacing" type="submit">Continue</KvButton>
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

	.register-button {
		width: 100%;
	}

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
