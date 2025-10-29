import { render } from '@testing-library/vue';
import { nextTick } from 'vue';
import TwoStepVerification from '../../../../../src/components/Settings/TwoStepVerification';

let mockQuery;
let mockShowTipMsg;

beforeEach(() => {
	mockQuery = vi.fn(() => Promise.resolve({
		data: {
			my: {
				id: '1',
				enrolledInMFA: false,
			}
		}
	}));
	mockShowTipMsg = vi.fn();
});

const getGlobal = () => ({
	provide: {
		apollo: {
			query: mockQuery,
		},
		kvAuth0: {},
	},
	mocks: {
		$showTipMsg: mockShowTipMsg,
	},
	stubs: {
		KvSettingsCard: {
			name: 'KvSettingsCard',
			props: ['title', 'class'],
			template: '<div class="kv-settings-card"><h2>{{ title }}</h2><div><slot name="content" /></div></div>',
		},
		KvLoadingPlaceholder: {
			name: 'KvLoadingPlaceholder',
			props: ['class', 'style'],
			template: '<span class="kv-loading-placeholder"></span>',
		},
		KvButton: {
			name: 'KvButton',
			props: ['to'],
			template: '<a :href="to"><slot /></a>',
		},
	},
});

describe('TwoStepVerification.vue', () => {
	it('renders title', () => {
		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		expect(getByText('2-Step verification')).toBeTruthy();
	});

	it('renders description', () => {
		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		expect(getByText(/Protect your Kiva account with an extra layer of security/)).toBeTruthy();
	});

	it('has name property', () => {
		expect(TwoStepVerification.name).toBe('TwoStepVerification');
	});

	it('has data properties', () => {
		const data = TwoStepVerification.data.call({});
		expect(data.isMFAActive).toBe(false);
		expect(data.isLoading).toBe(true);
	});

	it('has MFAStatus computed property', () => {
		expect(TwoStepVerification.computed.MFAStatus).toBeDefined();
	});

	it('has mounted lifecycle hook', () => {
		expect(TwoStepVerification.mounted).toBeDefined();
	});

	it('renders manage button', () => {
		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		expect(getByText('Manage 2-step verification')).toBeTruthy();
	});

	it('renders button with correct link', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const link = container.querySelector('a[href="/settings/security/mfa"]');
		expect(link).toBeTruthy();
	});

	it('shows loading placeholder initially', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const placeholder = container.querySelector('.kv-loading-placeholder');
		expect(placeholder).toBeTruthy();
	});

	it('renders Status label', () => {
		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		expect(getByText(/Status:/)).toBeTruthy();
	});

	it('shows "off" status when MFA is disabled', async () => {
		mockQuery.mockResolvedValue({
			data: {
				my: {
					id: '1',
					enrolledInMFA: false,
				}
			}
		});

		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		expect(getByText('off')).toBeTruthy();
	});

	it('shows "on" status when MFA is enabled', async () => {
		mockQuery.mockResolvedValue({
			data: {
				my: {
					id: '1',
					enrolledInMFA: true,
				}
			}
		});

		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		expect(getByText('on')).toBeTruthy();
	});

	it('applies tw-text-danger class when status is off', async () => {
		mockQuery.mockResolvedValue({
			data: {
				my: {
					id: '1',
					enrolledInMFA: false,
				}
			}
		});

		const { container } = render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		const statusSpan = container.querySelector('.tw-text-danger');
		expect(statusSpan).toBeTruthy();
		expect(statusSpan.textContent.trim()).toBe('off');
	});

	it('applies tw-text-brand class when status is on', async () => {
		mockQuery.mockResolvedValue({
			data: {
				my: {
					id: '1',
					enrolledInMFA: true,
				}
			}
		});

		const { container } = render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		const statusSpan = container.querySelector('.tw-text-brand');
		expect(statusSpan).toBeTruthy();
		expect(statusSpan.textContent.trim()).toBe('on');
	});

	it('applies tw-capitalize class to status', async () => {
		mockQuery.mockResolvedValue({
			data: {
				my: {
					id: '1',
					enrolledInMFA: false,
				}
			}
		});

		const { container } = render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		const statusSpan = container.querySelector('.tw-capitalize');
		expect(statusSpan).toBeTruthy();
	});

	it('calls apollo query on mount', () => {
		render(TwoStepVerification, { global: getGlobal() });
		expect(mockQuery).toHaveBeenCalled();
	});

	it('shows error tip message on query failure', async () => {
		mockQuery.mockRejectedValue(new Error('Query failed'));

		render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		expect(mockShowTipMsg).toHaveBeenCalledWith(
			expect.stringContaining('There was an error when getting your 2-step verification status'),
			'error'
		);
	});

	it('handles query errors array', async () => {
		mockQuery.mockResolvedValue({
			errors: [{ message: 'Error' }],
			data: null
		});

		render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		expect(mockShowTipMsg).toHaveBeenCalledWith(
			expect.stringContaining('There was an error'),
			'error'
		);
	});

	it('renders wrapper with correct class', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const wrapper = container.querySelector('.two-step-card-wrapper');
		expect(wrapper).toBeTruthy();
	});

	it('renders KvSettingsCard component', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const card = container.querySelector('.kv-settings-card');
		expect(card).toBeTruthy();
	});

	it('applies tw-mb-2 class to status heading', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const heading = container.querySelector('.tw-mb-2');
		expect(heading).toBeTruthy();
		expect(heading.textContent).toContain('Status:');
	});

	it('applies tw-mb-4 class to description', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const paragraph = container.querySelector('.tw-mb-4');
		expect(paragraph).toBeTruthy();
		expect(paragraph.textContent).toContain('Protect your Kiva account');
	});

	it('renders emphasized text with tw-font-medium class', () => {
		const { container } = render(TwoStepVerification, { global: getGlobal() });
		const emphasized = container.querySelector('.tw-font-medium');
		expect(emphasized).toBeTruthy();
		expect(emphasized.textContent).toContain('both your password');
	});

	it('defaults to false when enrolledInMFA is null', async () => {
		mockQuery.mockResolvedValue({
			data: {
				my: {
					id: '1',
					enrolledInMFA: null,
				}
			}
		});

		const { getByText } = render(TwoStepVerification, { global: getGlobal() });
		await nextTick();
		await nextTick();

		expect(getByText('off')).toBeTruthy();
	});
});
