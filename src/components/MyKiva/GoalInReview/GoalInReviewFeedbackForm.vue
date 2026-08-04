<template>
	<div data-testid="goal-in-review-feedback-form">
		<KvFormAssemblyForm
			class="-tw-mt-2"
			:form-assembly-id="FEEDBACK_FORM_ID"
			title="Goals feedback survey"
			@fa-form-submitted="emit('submitted')"
		/>
	</div>
</template>

<script setup>
import { KvFormAssemblyForm } from '@kiva/kv-components';

const FEEDBACK_FORM_ID = 659;

// KvFormAssemblyForm only fires `fa-form-submitted` after the form's own
// validation passes, so it is the success signal. We intentionally do NOT gate on
// the payload's `valid` flag: form 659 doesn't ship an analytics tuple, so `valid`
// is false even on a successful submit. Distinguishing a failed submit would need
// the FA form's Custom Code to signal success (see PR notes).
const emit = defineEmits(['submitted']);
</script>
