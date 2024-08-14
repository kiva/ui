import KvPhoneInput from '#src/components/Kv/KvPhoneInput';

export default {
	title: 'Kv/Form Elements/KvPhoneInput',
	component: KvPhoneInput,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: '828-479-5482' // kiva voicemail
		}
	},
	template: `
		<div>
			<label for="my_default_input">Enter your phone number</label>
			<kv-phone-input
				id="my_default_input"
				v-model="myCoolPhoneNumber"
			/>
		</div>
	`,
});

export const UsingEvents = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: '828-479-5482'
		}
	},
	template: `
		<div>
			<label for="events_input">Enter your phone number</label>
			<kv-phone-input
				id="events_input"
				v-model="myCoolPhoneNumber"
				@input="onInput"
			/>
		</div>
	`,
	methods: {
		onInput(val) {
			console.log(`onInput: ${val}`);
		}
	}
});


export const InitializeWithNonUSNumber = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: '+58 0412-1234567' // Venezuela sample number
		}
	},
	template: `
		<div>
			<label for="int_number">Enter your phone number</label>
			<kv-phone-input
				id="int_number"
				v-model="myCoolPhoneNumber"
			/>
		</div>
	`,
});

export const InitializeWithInvalidNumber = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: '+58 123'
		}
	},
	template: `
		<div>
			<label for="invalid_number">Enter your phone number</label>
			<kv-phone-input
				id="invalid_number"
				v-model="myCoolPhoneNumber"
			/>
		</div>
	`,
});

export const InitializeWithNothing = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: ''
		}
	},
	template: `
		<div>
			<label for="empty">Enter your phone number</label>
			<kv-phone-input
				id="empty"
				v-model="myCoolPhoneNumber"
			/>
		</div>
	`,
});


export const CheckingValidity = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: '(503) 555-55',
			isValid: false,
		}
	},
	template: `
		<div>
			<component is="style">
				.valid::after {
					content: 'valid';
					color: green;
				}

				.invalid::after {
					content: 'invalid';
					color: red;
				}
			</component>

			<label for="invalid_number">Enter your phone number</label>
			<div :class="{ valid: isValid, invalid: !isValid }">
				<kv-phone-input
					id="invalid_number"
					v-model="myCoolPhoneNumber"
					@validity-changed="onValidityChanged"
				/>
			</div>
		</div>
	`,
	methods: {
		onValidityChanged(isValid) {
			console.log(`onValidityChanged: ${isValid}`);
			this.isValid = isValid;
		}
	}
});
