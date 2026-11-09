// Stubs and cases shared by the invites specs

// Records each element's tracking payload, so specs can check it
export const trackEventDirective = {
	mounted(el, { value }) {
		el.setAttribute('data-track-event', JSON.stringify(value));
	},
};

// Like KvButton, disabled while loading or disabled, with its state readable
export const KvButtonStub = {
	props: ['state', 'type'],
	template: '<button :type="type" :data-state="state" '
		+ ':disabled="state === \'disabled\' || state === \'loading\'"><slot /></button>',
};

// Like KvTextInput, passes other attributes and listeners, such as change, to the input
export const KvTextInputStub = {
	inheritAttrs: false,
	props: ['modelValue', 'id', 'disabled'],
	emits: ['update:modelValue'],
	template: '<input :id="id" :value="modelValue" :disabled="disabled" v-bind="$attrs" '
		+ '@input="$emit(\'update:modelValue\', $event.target.value)">',
};

// Each way a mutation can fail, as [description, a mutate mock that fails that way]
export const FAILED_MUTATIONS = [
	['GraphQL errors', () => vi.fn().mockResolvedValue({ data: null, errors: [{ message: 'boom' }] })],
	['a missing result', () => vi.fn().mockResolvedValue({ data: { my: null } })],
	['a network failure', () => vi.fn().mockRejectedValue(new Error('offline'))],
];
