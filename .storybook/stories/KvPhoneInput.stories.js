import KvPhoneInput from '@/components/Kv/KvPhoneInput';

export default {
	title: 'Kv/KvPhoneInput',
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
			<label for="my_cool_input">Enter your phone number</label>
			<kv-phone-input
				id="my_cool_input"
				v-model="myCoolPhoneNumber"
			/>
		</div>
	`,
});

export const UsingEventsAndValue = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	template: `
		<div>
			<label for="my_cool_input">Enter your phone number</label>
			<kv-phone-input
				id="my_cool_input"
				value="828-479-5482"
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


export const InitializeWithVenuzalanNumber = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPhoneInput
	},
	data() {
		return {
			myCoolPhoneNumber: '+58 0412-1234567' // Venezuala sample number
		}
	},
	template: `
		<div>
			<label for="my_cool_input">Enter your phone number</label>
			<kv-phone-input
				id="my_cool_input"
				v-model="myCoolPhoneNumber"
			/>
		</div>
	`,
});
