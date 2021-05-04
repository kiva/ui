<template>
	<div class="first-mfa-setup">
		<p class="first-mfa-setup__description">
			To complete your setup, you will need to enter a 2-step verification code on the login page.
		</p>
		<kv-button
			class="expanded smaller"
			:to="`/ui-login?doneUrl=${encodeURIComponent('/login?authLevel=mfa&doneUrl=settings/security/mfa')}`"
		>
			Continue
		</kv-button>
	</div>
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

.first-mfa-setup {
	&__heading {
		font-weight: bold;
		text-align: left;
	}

	&__description {
		text-align: left;
	}
}
</style>
