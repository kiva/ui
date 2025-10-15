<template>
	<div class="first-mfa-setup">
		<p class="tw-text-left tw-mb-2">
			To complete your setup, you will need to enter a 2-step verification code on the login page.
		</p>
		<kv-button
			class="tw-w-full"
			:to="`/ui-login?doneUrl=${encodeURIComponent('/login?authLevel=mfa&doneUrl=settings/security')}`"
		>
			Continue
		</kv-button>
	</div>
</template>

<script>
import { KvButton } from '@kiva/kv-components';

export default {
	name: 'FirstMFASetup',
	components: {
		KvButton,
	},
};
</script>
