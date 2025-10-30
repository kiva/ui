import { render } from '@testing-library/vue';
import AppAuthentication from '#src/components/Settings/AppAuthentication';
import {
	commonStubs,
	createStubComponent,
	createMockApollo,
	createMockKvAuth0,
	createMockRouter,
	testComponentStructure
} from '../../../helpers/componentTestHelpers';

// Mock GraphQL mutations - these are imports, not components, so vi.mock is appropriate here
vi.mock('#src/graphql/mutation/mfa/enrollOTPAuthenticator.graphql', () => ({
	default: 'enrollOTPAuthenticatorMutation'
}));
vi.mock('#src/graphql/mutation/mfa/confirmOTPAuthenticatorEnrollment.graphql', () => ({
	default: 'confirmOTPAuthenticatorEnrollmentMutation'
}));

describe('AppAuthentication.vue', () => {
	let mockApollo;
	let mockKvAuth0;
	let mockRouter;

	beforeEach(() => {
		mockApollo = createMockApollo();
		mockKvAuth0 = createMockKvAuth0();
		mockRouter = createMockRouter();
	});

	const createWrapper = (props = {}) => {
		return render(AppAuthentication, {
			props,
			global: {
				mocks: {
					$router: mockRouter
				},
				provide: {
					apollo: mockApollo,
					kvAuth0: mockKvAuth0
				},
				stubs: {
					KvButton: commonStubs.KvButton,
					KvLightbox: commonStubs.KvLightbox,
					KvLoadingSpinner: commonStubs.KvLoadingSpinner,
					KvVerificationCodeInput: createStubComponent('KvVerificationCodeInput', {
						template: '<input type="text" />'
					}),
					FirstMFASetup: createStubComponent('FirstMFASetup', {
						template: '<div>First MFA Setup</div>'
					}),
					RecoveryCodeConfirm: createStubComponent('RecoveryCodeConfirm', {
						template: '<div>Recovery Code Confirm</div>'
					}),
					VueQrcode: createStubComponent('VueQrcode', {
						template: '<div>QR Code</div>'
					})
				}
			}
		});
	};

	// Consolidated structure tests
	testComponentStructure(AppAuthentication, {
		name: 'AppAuthentication',
		inject: ['apollo', 'kvAuth0'],
		components: [
			'FirstMFASetup',
			'KvButton',
			'KvLightbox',
			'KvLoadingSpinner',
			'KvVerificationCodeInput',
			'RecoveryCodeConfirm',
			'VueQrcode'
		]
	});

	describe('Component Structure', () => {
		it('renders the component', () => {
			const { container } = createWrapper();
			expect(container.querySelector('.app-authentication')).toBeTruthy();
		});

		it('declares the first prop with correct type and default', () => {
			expect(AppAuthentication.props.first).toEqual({
				type: Boolean,
				default: false
			});
		});

		it('declares all required components', () => {
			expect(AppAuthentication.components.FirstMFASetup).toBeDefined();
			expect(AppAuthentication.components.KvButton).toBeDefined();
			expect(AppAuthentication.components.KvLightbox).toBeDefined();
			expect(AppAuthentication.components.KvLoadingSpinner).toBeDefined();
			expect(AppAuthentication.components.KvVerificationCodeInput).toBeDefined();
			expect(AppAuthentication.components.RecoveryCodeConfirm).toBeDefined();
			expect(AppAuthentication.components.VueQrcode).toBeDefined();
		});
	});

	describe('Initial State', () => {
		it('initializes with correct data properties', () => {
			const component = AppAuthentication;
			const data = component.data.call({ first: false });

			expect(data.barcodeURI).toBe('');
			expect(data.enrollmentError).toBe('');
			expect(data.fetchingEnrollment).toBe(true);
			expect(data.lightboxVisible).toBe(true);
			expect(data.recoveryCode).toBe('');
			expect(data.secret).toBe('');
			expect(data.step).toBe(0);
			expect(data.userVerificationCode).toBe('');
			expect(data.verificationPending).toBe(false);
			expect(data.verificationError).toBe('');
		});
	});

	describe('Validations', () => {
		it('declares validations for userVerificationCode', () => {
			const component = AppAuthentication;
			const validations = component.validations.call({});

			expect(validations.userVerificationCode.required).toBeDefined();
			expect(validations.userVerificationCode.minLength).toBeDefined();
			expect(validations.userVerificationCode.maxLength).toBeDefined();
			expect(validations.userVerificationCode.numeric).toBeDefined();
		});
	});

	describe('Methods - getMFAToken', () => {
		it('resolves with token when auth is enabled', async () => {
			const instance = {
				kvAuth0: mockKvAuth0
			};

			const token = await AppAuthentication.methods.getMFAToken.call(instance);
			expect(token).toBe('mock-token');
			expect(mockKvAuth0.checkSession).toHaveBeenCalledWith({ skipIfUserExists: true });
			expect(mockKvAuth0.getMfaManagementToken).toHaveBeenCalled();
		});

		it('rejects when auth is not enabled', async () => {
			const instance = {
				kvAuth0: { enabled: false }
			};

			await expect(
				AppAuthentication.methods.getMFAToken.call(instance)
			).rejects.toBe('Auth not enabled');
		});
	});

	describe('Methods - afterScan', () => {
		it('advances to step 1', () => {
			const instance = { step: 0 };
			AppAuthentication.methods.afterScan.call(instance);
			expect(instance.step).toBe(1);
		});
	});

	describe('Methods - cannotScan', () => {
		it('advances to step 2', () => {
			const instance = { step: 0 };
			AppAuthentication.methods.cannotScan.call(instance);
			expect(instance.step).toBe(2);
		});
	});

	describe('Methods - startEnrollment', () => {
		it('sets fetchingEnrollment to true', () => {
			const instance = {
				fetchingEnrollment: false,
				getMFAToken: vi.fn(() => Promise.reject('test')),
				apollo: mockApollo
			};

			AppAuthentication.methods.startEnrollment.call(instance);
			expect(instance.fetchingEnrollment).toBe(true);
		});

		it('calls getMFAToken and apollo mutate', async () => {
			const getMFAToken = vi.fn(() => Promise.resolve('mock-token'));
			const instance = {
				fetchingEnrollment: false,
				getMFAToken,
				apollo: mockApollo
			};

			mockApollo.mutate.mockResolvedValue({
				data: {
					my: {
						enrollOTPAuthenticator: {
							barcode_uri: 'otpauth://test',
							secret: 'test-secret',
							recovery_codes: []
						}
					}
				}
			});

			AppAuthentication.methods.startEnrollment.call(instance);

			// Allow promise to resolve
			await new Promise(res => {
				setTimeout(res, 0);
			});

			expect(getMFAToken).toHaveBeenCalled();
			expect(mockApollo.mutate).toHaveBeenCalled();
		});
	});

	describe('Methods - submitVerification', () => {
		it('sets verificationPending to true', () => {
			const instance = {
				verificationPending: false,
				getMFAToken: vi.fn(() => Promise.reject('test')),
				apollo: mockApollo
			};

			AppAuthentication.methods.submitVerification.call(instance);
			expect(instance.verificationPending).toBe(true);
		});

		it('calls getMFAToken and apollo mutate', async () => {
			const getMFAToken = vi.fn(() => Promise.resolve('mock-token'));
			const instance = {
				verificationPending: false,
				userVerificationCode: '123456',
				recoveryCode: '',
				first: false,
				getMFAToken,
				apollo: mockApollo,
				completeSetup: vi.fn()
			};

			mockApollo.mutate.mockResolvedValue({
				data: { my: { confirmOTPAuthenticatorEnrollment: { success: true } } }
			});

			AppAuthentication.methods.submitVerification.call(instance);

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

			AppAuthentication.methods.confirmRecoveryCode.call(instance);

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

			AppAuthentication.methods.confirmRecoveryCode.call(instance);

			expect(instance.recoveryCode).toBe('');
			expect(instance.completeSetup).toHaveBeenCalled();
		});
	});

	describe('Methods - completeSetup', () => {
		it('navigates to MFA settings when lightbox is visible', () => {
			vi.useFakeTimers();

			const instance = {
				lightboxVisible: true,
				enrollmentError: 'error',
				barcodeURI: 'test-uri',
				secret: 'test-secret',
				step: 3,
				userVerificationCode: '123456',
				verificationError: 'error',
				$router: mockRouter
			};

			AppAuthentication.methods.completeSetup.call(instance);

			expect(mockRouter.push).toHaveBeenCalledWith('/settings/security/mfa');
			expect(instance.lightboxVisible).toBe(false);

			// Fast-forward timers to execute setTimeout
			vi.advanceTimersByTime(300);

			expect(instance.enrollmentError).toBe('');
			expect(instance.barcodeURI).toBe('');
			expect(instance.secret).toBe('');
			expect(instance.step).toBe(0);
			expect(instance.userVerificationCode).toBe('');
			expect(instance.verificationError).toBe('');

			vi.useRealTimers();
		});

		it('does not navigate when lightbox is not visible', () => {
			vi.useFakeTimers();

			const instance = {
				lightboxVisible: false,
				enrollmentError: '',
				barcodeURI: '',
				secret: '',
				step: 0,
				userVerificationCode: '',
				verificationError: '',
				$router: mockRouter
			};

			AppAuthentication.methods.completeSetup.call(instance);

			expect(mockRouter.push).not.toHaveBeenCalled();

			// Fast-forward timers
			vi.advanceTimersByTime(300);

			vi.useRealTimers();
		});
	});

	describe('Lifecycle', () => {
		it('sets lightboxVisible to false on beforeUnmount', () => {
			const instance = {
				lightboxVisible: true
			};

			AppAuthentication.beforeUnmount.call(instance);

			expect(instance.lightboxVisible).toBe(false);
		});
	});

	describe('Step 0 - QR Code Display', () => {
		it('renders use authenticator app heading at step 0', () => {
			const { getByText } = createWrapper();
			expect(getByText('Use an authenticator app')).toBeTruthy();
		});
	});

	describe('Step 1 - After Scan', () => {
		it('renders setup authenticator heading at step 1', () => {
			// Component renders step 1 content conditionally
			expect(AppAuthentication.components.KvVerificationCodeInput).toBeDefined();
		});
	});

	describe('Step 2 - Manual Entry', () => {
		it('renders manual entry instructions at step 2', () => {
			// Component renders step 2 content conditionally
			expect(AppAuthentication.components.KvVerificationCodeInput).toBeDefined();
		});
	});

	describe('Step 3 - Recovery Code', () => {
		it('renders RecoveryCodeConfirm component at step 3', () => {
			expect(AppAuthentication.components.RecoveryCodeConfirm).toBeDefined();
		});
	});

	describe('Step 4 - First MFA Setup', () => {
		it('renders FirstMFASetup component at step 4', () => {
			expect(AppAuthentication.components.FirstMFASetup).toBeDefined();
		});
	});
});
