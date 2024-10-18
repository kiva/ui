<template>
	<div
		class="kv-verification-code-input tw-border tw-border-tertiary"
		:style="cssVars"
	>
		<!--
			How I imagine this to work with multiple inputs:
			multiple <inputs hidden from screenreaders
			1 input hidden from sighted with the autocomplete tag.
			the values get updated in sync.
			<input
				class="hide-from-sr"
				v-for="i in maxlength"
				type="text"
				inputmode="numeric"
				pattern="[0-9]*"
				:value="valuesArray[i]"
				@input="updateValuesArrayAndRefocus($event.target.value, i)"
			>
			<input
				type="hidden"
				:value="computedValueFromValuesArray"
				autocomplete="one-time-code"
			>
		-->
		<input
			class="kv-verification-code-input__input"
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			autocomplete="one-time-code"
			:disabled="disabled"
			:maxlength="maxlength"
			@input="$emit('update', $event.target.value)"
		>
	</div>
</template>

<script>
// Some useful information on auto-completion and input modes here
// https://www.twilio.com/blog/html-attributes-two-factor-authentication-autocomplete

export default {
	name: 'KvVerificationCodeInput',
	emits: ['update'],
	props: {
		maxlength: {
			type: Number,
			default: 6
		},
		disabled: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		cssVars() {
			return {
				'--kv-verification-code-input-maxlength': this.maxlength
			};
		},
	}
};
</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

.kv-verification-code-input {
	font-size: 3em; // All sizing is relative to this. You could override this from the parent.
	width: calc(var(--kv-verification-code-input-maxlength) * 1.1125em + 1.5em);

	&__input {
		font-size: 1em;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.5em;
		padding: 0.5em 0 0.5em 1em;
		width: 100%;
	}
}
</style>
