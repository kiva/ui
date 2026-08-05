<template>
	<div data-testid="goal-in-review-feedback-form">
		<KvFormAssemblyForm
			class="-tw-mt-2"
			:form-assembly-id="FEEDBACK_FORM_ID"
			title="Goals feedback survey"
			@fa-form-submitted="handleSubmitted"
		/>
	</div>
</template>

<script setup>
import { KvFormAssemblyForm } from '@kiva/kv-components';

const FEEDBACK_FORM_ID = 659;

const emit = defineEmits(['submitted']);

const handleSubmitted = (event = {}) => {
	console.log('HP > GoalInReviewFeedbackForm submitted', event);
	if (event.valid) {
		emit('submitted');
	}
};
</script>
