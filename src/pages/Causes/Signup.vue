<template>
	<signup-waitlist />
</template>

<script>
import SignupWaitlist from '@/pages/Causes/SignupWaitlist';

/** TODO
 * - Hide new interactions vs false door behind experiment flag.
 * - Redirect to login with cause param on landing on this page.
 * - If account exists, redirect to get on list
 * - If new account redirect to signup form src/pages/Causes/SignupForm.vue
*/

export default {
	components: {
		SignupWaitlist,
	},
};
</script>

<style lang="scss">
</style>
