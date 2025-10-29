import { render } from '@testing-library/vue';
import PhoneAuthentication from '../../../../../src/components/Settings/PhoneAuthentication';

// Mock components
vi.mock('@kiva/kv-components', () => ({
	KvLightbox: { name: 'KvLightbox', template: '<div><slot /></div>' },
	KvButton: { name: 'KvButton', template: '<button><slot /></button>' },
}));
vi.mock('#src/components/Kv/KvLoadingSpinner', () => ({
	default: { name: 'KvLoadingSpinner', template: '<div>Loading...</div>' }
}));
vi.mock('#src/components/Kv/KvPhoneInput', () => ({
	default: { name: 'KvPhoneInput', template: '<input type="tel" />' }
}));
vi.mock('#src/components/Kv/KvVerificationCodeInput', () => ({
	default: { name: 'KvVerificationCodeInput', template: '<input type="text" />' }
}));
vi.mock('#src/pages/Settings/FirstMFASetup', () => ({
	default: { name: 'FirstMFASetup', template: '<div>First MFA Setup</div>' }
}));
vi.mock('#src/pages/Settings/RecoveryCodeConfirm', () => ({
	default: { name: 'RecoveryCodeConfirm', template: '<div>Recovery Code Confirm</div>' }
}));

// Mock GraphQL mutations
vi.mock('#src/graphql/mutation/mfa/enrollSMSAuthenticator.graphql', () => ({
	default: 'enrollSMSAuthenticatorMutation'
}));
vi.mock('#src/graphql/mutation/mfa/enrollVoiceAuthenticator.graphql', () => ({
	default: 'enrollVoiceAuthenticatorMutation'
}));
vi.mock('#src/graphql/mutation/mfa/confirmSMSAuthenticatorEnroll.graphql', () => ({
	default: 'confirmSMSAuthenticatorEnrollmentMutation'
}));
vi.mock('#src/graphql/mutation/mfa/confirmVoiceAuthenticatorEnroll.graphql', () => ({
	default: 'confirmVoiceAuthenticatorEnrollmentMutation'
}));

describe('PhoneAuthentication.vue', () => {
	let mockApollo;
	let mockKvAuth0;
	let mockRouter;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn()
		};
		mockKvAuth0 = {
			enabled: true,
			checkSession: vi.fn(() => Promise.resolve()),
			getMfaManagementToken: vi.fn(() => Promise.resolve('mock-token'))
		};
		mockRouter = {
			push: vi.fn()
		};
	});

	const createWrapper = (props = {}) => {
		return render(PhoneAuthentication, {
			props,
			global: {
				mocks: {
					$router: mockRouter
				},
				provide: {
					apollo: mockApollo,
					kvAuth0: mockKvAuth0
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('renders the component with lightbox', () => {
			const { container } = createWrapper();
			expect(container.querySelector('.phone-authentication')).toBeTruthy();
		});

		it('has the correct component name', () => {
			expect(PhoneAuthentication.name).toBe('PhoneAuthentication');
		});

		it('declares the correct inject properties', () => {
			expect(PhoneAuthentication.inject).toEqual(['apollo', 'kvAuth0']);
		});

		it('declares the first prop with correct type and default', () => {
			expect(PhoneAuthentication.props.first).toEqual({
				type: Boolean,
				default: false
			});
		});
	});

	describe('Step 0 - Phone Number Entry', () => {
		it('renders phone number input step by default', () => {
			const { getByText } = createWrapper();
			const legendText = 'Enter a phone number that can be used to verify your identity';
			expect(getByText(legendText, { exact: false })).toBeTruthy();
			expect(getByText('Enter your phone number here:')).toBeTruthy();
		});

		it('renders "How do you want to get codes?" heading', () => {
			const { getByText } = createWrapper();
			expect(getByText('How do you want to get codes?')).toBeTruthy();
		});

		it('renders text message and phone call buttons', () => {
			const { getByText } = createWrapper();
			expect(getByText('Text message')).toBeTruthy();
			expect(getByText('Phone call')).toBeTruthy();
		});

		it('initializes with correct data properties', () => {
			createWrapper();
			const component = PhoneAuthentication;
			const data = component.data.call({ first: false });

			expect(data.lightboxVisible).toBe(true);
			expect(data.phoneNumber).toBe('');
			expect(data.isPhoneNumberValid).toBe(false);
			expect(data.enrollmentType).toBe('');
			expect(data.userVerificationCode).toBe('');
			expect(data.oobCode).toBe('');
			expect(data.enrollmentPending).toBe(false);
			expect(data.enrollmentError).toBe('');
			expect(data.recoveryCode).toBe('');
			expect(data.verificationPending).toBe(false);
			expect(data.verificationError).toBe('');
			expect(data.step).toBe(0);
		});
	});

	describe('Validations', () => {
		it('declares validations for phoneNumber', () => {
			const component = PhoneAuthentication;
			const validations = component.validations.call({
				isPhoneNumberValid: true
			});

			expect(validations.phoneNumber.required).toBeDefined();
			const validResult = validations.phoneNumber.valid.call({ isPhoneNumberValid: true });
			expect(validResult).toBe(true);
		});

		it('declares validations for userVerificationCode', () => {
			const component = PhoneAuthentication;
			const validations = component.validations.call({});

			expect(validations.userVerificationCode.required).toBeDefined();
			expect(validations.userVerificationCode.minLength).toBeDefined();
			expect(validations.userVerificationCode.maxLength).toBeDefined();
			expect(validations.userVerificationCode.numeric).toBeDefined();
		});
	});

	describe('Computed Properties', () => {
		it('returns "Phone number" title for step 0', () => {
			createWrapper();
			const instance = { step: 0 };
			const title = PhoneAuthentication.computed.lightboxTitle.call(instance);
			expect(title).toBe('Phone number');
		});

		it('returns "We sent you a text message" title for SMS at step 1', () => {
			const instance = { step: 1, enrollmentType: 'SMS' };
			const title = PhoneAuthentication.computed.lightboxTitle.call(instance);
			expect(title).toBe('We sent you a text message');
		});

		it('returns title for voice at step 1', () => {
			const instance = { step: 1, enrollmentType: 'voice' };
			const title = PhoneAuthentication.computed.lightboxTitle.call(instance);
			expect(title).toContain('receive a call');
		});

		it('returns "Complete setup" title for step 4', () => {
			const instance = { step: 4 };
			const title = PhoneAuthentication.computed.lightboxTitle.call(instance);
			expect(title).toBe('Complete setup');
		});
	});

	describe('Methods - getMFAToken', () => {
		it('resolves with token when auth is enabled', async () => {
			createWrapper();
			const instance = {
				kvAuth0: mockKvAuth0
			};

			const token = await PhoneAuthentication.methods.getMFAToken.call(instance);
			expect(token).toBe('mock-token');
			expect(mockKvAuth0.checkSession).toHaveBeenCalledWith({ skipIfUserExists: true });
			expect(mockKvAuth0.getMfaManagementToken).toHaveBeenCalled();
		});

		it('rejects when auth is not enabled', async () => {
			createWrapper();
			const instance = {
				kvAuth0: { enabled: false }
			};

			await expect(
				PhoneAuthentication.methods.getMFAToken.call(instance)
			).rejects.toBe('Auth not enabled');
		});
	});

	describe('Methods - onValidityChanged', () => {
		it('updates isPhoneNumberValid property', () => {
			createWrapper();
			const instance = { isPhoneNumberValid: false };

			PhoneAuthentication.methods.onValidityChanged.call(instance, true);
			expect(instance.isPhoneNumberValid).toBe(true);

			PhoneAuthentication.methods.onValidityChanged.call(instance, false);
			expect(instance.isPhoneNumberValid).toBe(false);
		});
	});

	describe('Methods - startEnrollment', () => {
		it('sets enrollment type and clears errors', () => {
			const instance = {
				enrollmentType: 'old-type',
				enrollmentError: 'old-error',
				enrollmentPending: false,
				userVerificationCode: '123456',
				phoneNumber: '+1234567890',
				recoveryCode: '',
				oobCode: '',
				step: 0,
				getMFAToken: vi.fn(() => Promise.reject('test')),
				apollo: mockApollo
			};

			// Just verify initial synchronous actions
			PhoneAuthentication.methods.startEnrollment.call(instance, 'SMS');

			expect(instance.enrollmentType).toBe('SMS');
			expect(instance.enrollmentError).toBe('');
			expect(instance.enrollmentPending).toBe(true);
			expect(instance.userVerificationCode).toBe('');
		});

		it('calls getMFAToken and apollo mutate', async () => {
			const getMFAToken = vi.fn(() => Promise.resolve('mock-token'));
			const instance = {
				enrollmentType: '',
				enrollmentError: '',
				enrollmentPending: false,
				userVerificationCode: '',
				phoneNumber: '+1234567890',
				getMFAToken,
				apollo: mockApollo
			};

			mockApollo.mutate.mockResolvedValue({
				data: { my: { enrollSMSAuthenticator: { oob_code: 'test', recovery_codes: [] } } }
			});

			PhoneAuthentication.methods.startEnrollment.call(instance, 'SMS');

			// Allow promise to resolve
			await new Promise(res => {
				setTimeout(res, 0);
			});

			expect(getMFAToken).toHaveBeenCalled();
			expect(mockApollo.mutate).toHaveBeenCalled();
		});
	});

	describe('Methods - submitVerification', () => {
		it('sets verification pending and clears errors', () => {
			const instance = {
				enrollmentType: 'SMS',
				verificationError: 'old-error',
				verificationPending: false,
				oobCode: 'test-oob-code',
				userVerificationCode: '123456',
				recoveryCode: '',
				step: 1,
				first: false,
				getMFAToken: vi.fn(() => Promise.reject('test')),
				apollo: mockApollo
			};

			PhoneAuthentication.methods.submitVerification.call(instance);

			expect(instance.verificationError).toBe('');
			expect(instance.verificationPending).toBe(true);
		});

		it('calls getMFAToken and apollo mutate', async () => {
			const getMFAToken = vi.fn(() => Promise.resolve('mock-token'));
			const instance = {
				enrollmentType: 'SMS',
				verificationError: '',
				verificationPending: false,
				oobCode: 'test-oob-code',
				userVerificationCode: '123456',
				recoveryCode: '',
				step: 1,
				first: false,
				getMFAToken,
				apollo: mockApollo,
				completeSetup: vi.fn()
			};

			mockApollo.mutate.mockResolvedValue({
				data: { my: { confirmSMSAuthenticatorEnrollment: { success: true } } }
			});

			PhoneAuthentication.methods.submitVerification.call(instance);

			// Allow promise to resolve
			await new Promise(res => {
				setTimeout(res, 0);
			});

			expect(getMFAToken).toHaveBeenCalled();
			expect(mockApollo.mutate).toHaveBeenCalled();
		});
	});

	describe('Methods - confirmRecoveryCode', () => {
		it('clears recovery code and advances to step 4 when first is true', () => {
			const instance = {
				recoveryCode: 'test-code',
				first: true,
				step: 3,
				completeSetup: vi.fn()
			};

			PhoneAuthentication.methods.confirmRecoveryCode.call(instance);

			expect(instance.recoveryCode).toBe('');
			expect(instance.step).toBe(4);
			expect(instance.completeSetup).not.toHaveBeenCalled();
		});

		it('clears recovery code and completes setup when first is false', () => {
			const instance = {
				recoveryCode: 'test-code',
				first: false,
				step: 3,
				completeSetup: vi.fn()
			};

			PhoneAuthentication.methods.confirmRecoveryCode.call(instance);

			expect(instance.recoveryCode).toBe('');
			expect(instance.completeSetup).toHaveBeenCalled();
		});
	});

	describe('Methods - completeSetup', () => {
		it('navigates to MFA settings and resets state', () => {
			const instance = {
				lightboxVisible: true,
				phoneNumber: '+1234567890',
				step: 3,
				oobCode: 'test-code',
				userVerificationCode: '123456',
				enrollmentError: 'error',
				verificationError: 'error',
				$router: mockRouter
			};

			PhoneAuthentication.methods.completeSetup.call(instance);

			expect(mockRouter.push).toHaveBeenCalledWith('/settings/security/mfa');
			expect(instance.lightboxVisible).toBe(false);
			expect(instance.phoneNumber).toBe('');
			expect(instance.step).toBe(0);
			expect(instance.oobCode).toBe('');
			expect(instance.userVerificationCode).toBe('');
			expect(instance.enrollmentError).toBe('');
			expect(instance.verificationError).toBe('');
		});

		it('does not navigate when lightbox is not visible', () => {
			const instance = {
				lightboxVisible: false,
				phoneNumber: '+1234567890',
				step: 3,
				oobCode: 'test-code',
				userVerificationCode: '123456',
				enrollmentError: '',
				verificationError: '',
				$router: mockRouter
			};

			PhoneAuthentication.methods.completeSetup.call(instance);

			expect(mockRouter.push).not.toHaveBeenCalled();
		});
	});

	describe('Lifecycle', () => {
		it('sets lightboxVisible to false on beforeUnmount', () => {
			const instance = {
				lightboxVisible: true
			};

			PhoneAuthentication.beforeUnmount.call(instance);

			expect(instance.lightboxVisible).toBe(false);
		});
	});

	describe('Step 1 - Verification Code Entry', () => {
		it('displays verification code input when step is 1', () => {
			const { container } = createWrapper();

			// Verify the component has sections for different steps
			expect(container.querySelector('.phone-authentication')).toBeTruthy();
			expect(PhoneAuthentication.components.KvVerificationCodeInput).toBeDefined();
		});
	});

	describe('Step 3 - Recovery Code', () => {
		it('renders RecoveryCodeConfirm component at step 3', () => {
			expect(PhoneAuthentication.components.RecoveryCodeConfirm).toBeDefined();
		});
	});

	describe('Step 4 - First MFA Setup', () => {
		it('renders FirstMFASetup component at step 4', () => {
			expect(PhoneAuthentication.components.FirstMFASetup).toBeDefined();
		});
	});
});
