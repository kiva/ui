<template>
	<www-page>
		<login-form />

		<!-- This spacer will be deleted -->
		<hr class="spacer">

		<register-form />

	</www-page>
</template>

<script>
import LoginForm from '@/components/Forms/LoginForm';
import RegisterForm from '@/components/Forms/RegisterForm';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
		LoginForm,
		RegisterForm
	}
};
</script>
<style lang="scss" scoped>
@import 'settings';

// This spacer will be deleted
.spacer {
	margin: rem-calc(150) 0;
}

</style>
