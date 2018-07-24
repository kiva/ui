<template>
	<www-page>
		<div class="row page-content">
			<div class="columns">
				<login-form done-url="https://dev-vm-01.kiva.org/lend-vue?page=2" />

				<!-- This spacer will be deleted -->
				<hr class="spacer">

				<register-form />
			</div>
		</div>
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

.page-content {
	padding: 1.625rem rem-calc(10);
}
@include breakpoint(medium) {
	padding: 1.625rem 0;
}

// Control form layouts from parent to allow independence in other layouts
.login-form,
.register-form {
	max-width: 280px;
	margin: 0 auto;
}

// This spacer will be deleted
.spacer {
	margin: rem-calc(75) 0;
}
</style>
