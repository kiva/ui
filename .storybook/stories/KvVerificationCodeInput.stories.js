import KvVerificationCodeInput from '#src/components/Kv/KvVerificationCodeInput';

export default {
	title: 'Kv/Form Elements/KvVerificationCodeInput',
	component: KvVerificationCodeInput,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvVerificationCodeInput
	},
	args: {
		maxlength: 4,
		disabled: false
	},
	data() {
		return {
			verificationCode: ''
		}
	},
	template: `
		<div>
			<label for="my_default_input">Enter your verification code</label>
			<kv-verification-code-input
				id="my_default_input"
				:maxlength="maxlength"
				:disabled="disabled"
				v-model="verificationCode"
			/>
		</div>
	`,
});

