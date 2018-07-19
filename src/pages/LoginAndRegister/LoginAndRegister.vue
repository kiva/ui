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
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		WwwPage,
		KvButton,
		LoginForm,
		RegisterForm
	},
	data() {
		return {
		};
	},
};
</script>
<style lang="scss" scoped>
@import 'settings';

// This spacer will be deleted
.spacer {
	margin: 150px 0;
}

</style>
