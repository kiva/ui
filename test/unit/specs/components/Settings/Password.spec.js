import { render, fireEvent } from '@testing-library/vue';
import {
	describe, it, expect, vi, beforeEach
} from 'vitest';
import { nextTick } from 'vue';
import Password from '#src/components/Settings/Password';

const mockUserEmail = 'test@example.com';

let mockQuery;
let mockMutate;

beforeEach(() => {
	mockQuery = vi.fn(() => Promise.resolve({
		data: {
			my: {
				id: '1',
				userAccount: {
					id: '1',
					email: mockUserEmail,
				}
			}
		}
	}));
	mockMutate = vi.fn(() => Promise.resolve({ data: { my: { sendChangePasswordEmail: true } } }));
});

const getGlobal = () => ({
	provide: {
		apollo: {
			query: mockQuery,
			mutate: mockMutate,
		},
	},
	stubs: {
		KvSettingsCard: {
			name: 'KvSettingsCard',
			props: ['title'],
			template: '<div class="kv-settings-card"><h2>{{ title }}</h2><div><slot name="content" /></div></div>',
		},
		KvAlert: {
			name: 'KvAlert',
			props: ['variant', 'canClose'],
			template: '<div class="kv-alert" :class="\'kv-alert--\' + variant"><slot /></div>',
		},
		KvButton: {
			name: 'KvButton',
			props: ['state'],
			template: '<button :disabled="state === \'disabled\'"><slot /></button>',
		},
	},
});

describe('Password.vue', () => {
	it('renders title', () => {
		const { getByText } = render(Password, { global: getGlobal() });
		expect(getByText('Password')).toBeTruthy();
	});

	it('renders instructions', () => {
		const { getByText } = render(Password, { global: getGlobal() });
		expect(getByText(/Clicking this button will send you a verification email/)).toBeTruthy();
	});

	it('has name property', () => {
		expect(Password.name).toBe('Password');
	});

	it('has data properties', () => {
		const data = Password.data.call({});
		expect(data.userEmail).toBe(null);
		expect(data.isPasswordRequestPending).toBe(false);
		expect(data.isPasswordRequestSuccess).toBe(false);
		expect(data.isPasswordRequestFailure).toBe(false);
	});

	it('has methods', () => {
		expect(Password.methods.loadUserEmail).toBeDefined();
		expect(Password.methods.onClickRequestPassword).toBeDefined();
	});

	it('has mounted lifecycle hook', () => {
		expect(Password.mounted).toBeDefined();
	});

	it('renders send password email button', () => {
		const { getByText } = render(Password, { global: getGlobal() });
		expect(getByText('Send change password email')).toBeTruthy();
	});

	it('does not show success alert initially', () => {
		const { container } = render(Password, { global: getGlobal() });
		const successAlert = container.querySelector('.kv-alert--success');
		expect(successAlert).toBeFalsy();
	});

	it('does not show error alert initially', () => {
		const { container } = render(Password, { global: getGlobal() });
		const errorAlert = container.querySelector('.kv-alert--danger');
		expect(errorAlert).toBeFalsy();
	});

	it('shows success alert after successful password reset', async () => {
		const { getByText, container } = render(Password, { global: getGlobal() });

		const button = getByText('Send change password email');
		await fireEvent.click(button);
		await nextTick();
		await nextTick();

		const successAlert = container.querySelector('.kv-alert--success');
		expect(successAlert).toBeTruthy();
	});

	it('shows user email in success message', async () => {
		const { getByText } = render(Password, { global: getGlobal() });

		const button = getByText('Send change password email');
		await fireEvent.click(button);
		await nextTick();
		await nextTick();

		expect(getByText(mockUserEmail)).toBeTruthy();
	});

	it('shows fallback text when no email loaded', async () => {
		mockQuery.mockResolvedValue({ data: { my: null } });

		const { getByText } = render(Password, { global: getGlobal() });

		const button = getByText('Send change password email');
		await fireEvent.click(button);
		await nextTick();
		await nextTick();

		expect(getByText('the address on file')).toBeTruthy();
	});

	it('shows error alert on failed password reset', async () => {
		mockMutate.mockRejectedValue(new Error('Failed'));

		const { getByText, container } = render(Password, { global: getGlobal() });

		const button = getByText('Send change password email');
		await fireEvent.click(button);
		await nextTick();
		await nextTick();

		const errorAlert = container.querySelector('.kv-alert--danger');
		expect(errorAlert).toBeTruthy();
	});

	it('shows error message text', async () => {
		mockMutate.mockRejectedValue(new Error('Failed'));

		const { getByText } = render(Password, { global: getGlobal() });

		const button = getByText('Send change password email');
		await fireEvent.click(button);
		await nextTick();
		await nextTick();

		expect(getByText('There was a problem sending the password reset email')).toBeTruthy();
	});

	it('calls apollo mutate on button click', async () => {
		const { getByText } = render(Password, { global: getGlobal() });

		const button = getByText('Send change password email');
		await fireEvent.click(button);

		expect(mockMutate).toHaveBeenCalled();
	});

	it('calls apollo query on mount', () => {
		render(Password, { global: getGlobal() });
		expect(mockQuery).toHaveBeenCalled();
	});

	it('renders KvSettingsCard component', () => {
		const { container } = render(Password, { global: getGlobal() });
		const card = container.querySelector('.kv-settings-card');
		expect(card).toBeTruthy();
	});

	it('applies tw-mb-4 class to instructions', () => {
		const { container } = render(Password, { global: getGlobal() });
		const paragraph = container.querySelector('.tw-mb-4');
		expect(paragraph).toBeTruthy();
		expect(paragraph.textContent).toContain('Clicking this button');
	});
});

