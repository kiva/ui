<template>
	<div class="security-settings-page">
		<password />
		<two-step-verification />
	</div>
</template>

<script>
import Password from './Password';
import TwoStepVerification from './TwoStepVerification';

export default {
	components: {
		Password,
		TwoStepVerification,
	}
};

</script>
