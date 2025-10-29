import { render } from '@testing-library/vue';
import PushRepaymentUpdates from '../../../../../src/components/Settings/PushRepaymentUpdates';

// Mock the push notifications manager
vi.mock('#src/util/pushNotificationsManager', () => ({
	registerServiceWorker: vi.fn(() => Promise.resolve()),
	isSubscribed: vi.fn(() => Promise.resolve()),
	unsubscribe: vi.fn(() => Promise.resolve()),
}));

const global = {
	provide: {
		apollo: {
			mutate: vi.fn(() => Promise.resolve({ data: {} })),
		},
	},
	mocks: {
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
		$route: {
			path: '/settings',
		},
	},
	stubs: {
		KvCheckbox: {
			name: 'KvCheckbox',
			props: ['modelValue', 'id', 'name'],
			template: `<label class="kv-checkbox">
				<input
					type="checkbox"
					:id="id"
					:name="name"
					:checked="modelValue"
					@change="$emit('update:modelValue', $event.target.checked)"
				/>
				<slot />
			</label>`,
		},
	},
};

describe('PushRepaymentUpdates.vue', () => {
	it('renders checkbox with correct label', () => {
		const { getByText } = render(PushRepaymentUpdates, {
			global,
		});

		expect(getByText('Receive notifications on this device')).toBeTruthy();
	});

	it('has name property', () => {
		expect(PushRepaymentUpdates.name).toBe('PushRepaymentUpdates');
	});

	it('has data properties', () => {
		const data = PushRepaymentUpdates.data.call({});
		expect(data.pushNotificationsActive).toBe(false);
	});

	it('has changePushSetting method', () => {
		expect(PushRepaymentUpdates.methods.changePushSetting).toBeDefined();
	});

	it('has mounted lifecycle hook', () => {
		expect(PushRepaymentUpdates.mounted).toBeDefined();
	});

	it('renders checkbox with correct id', () => {
		const { container } = render(PushRepaymentUpdates, {
			global,
		});

		const checkbox = container.querySelector('#pushNotifications');
		expect(checkbox).toBeTruthy();
	});

	it('renders checkbox with correct name attribute', () => {
		const { container } = render(PushRepaymentUpdates, {
			global,
		});

		const checkbox = container.querySelector('input[name="pushNotifications"]');
		expect(checkbox).toBeTruthy();
	});

	it('renders unchecked checkbox initially', () => {
		const { container } = render(PushRepaymentUpdates, {
			global,
		});

		const checkbox = container.querySelector('input[type="checkbox"]');
		expect(checkbox?.checked).toBe(false);
	});

	it('applies kv-checkbox class', () => {
		const { container } = render(PushRepaymentUpdates, {
			global,
		});

		const checkbox = container.querySelector('.kv-checkbox');
		expect(checkbox).toBeTruthy();
	});

	it('renders KvCheckbox component', () => {
		const { container } = render(PushRepaymentUpdates, {
			global,
		});

		const checkbox = container.querySelector('.kv-checkbox');
		expect(checkbox).toBeTruthy();
		expect(checkbox.tagName).toBe('LABEL');
	});
});
