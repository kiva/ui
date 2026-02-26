import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import DataSettingsPage from '#src/pages/Settings/DataSettings/DataSettingsPage';
import { globalOptions } from '../../../../specUtils';

/** Mock response that indicates a successful updateDataSettings mutation. */
const updateDataSettingsSuccessResponse = (cookieOptOut = true, piiSharingOptOut = false) => ({
	data: {
		my: {
			updateCookieOptOut: cookieOptOut,
			updatePiiSharingOptOut: piiSharingOptOut,
		},
	},
});

/** Mount the component and return a function to get the instance (for testing methods only). */
function mountForMethods(apolloOverrides = {}) {
	const childRef = { current: null };
	const showTipMsg = vi.fn();
	const mutate = apolloOverrides.mutate ?? vi.fn(() => Promise.resolve(updateDataSettingsSuccessResponse()));

	const Wrapper = {
		components: { DataSettingsPage },
		template: '<DataSettingsPage ref="child" />',
		mounted() {
			childRef.current = this.$refs.child;
		},
	};

	render(Wrapper, {
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				apollo: { ...globalOptions.provide.apollo, mutate, ...apolloOverrides },
			},
			mocks: { ...globalOptions.mocks, $showTipMsg: showTipMsg },
			stubs: {
				WwwPage: { template: '<div><slot /></div>' },
				KvDefaultWrapper: { template: '<div><slot /></div>' },
				KvSettingsCard: { template: '<div><slot name="content" /></div>' },
				KvButton: { template: '<button><slot /></button>' },
				KvCheckbox: { template: '<input type="checkbox">' },
				KvLightbox: { template: '<div><slot /><slot name="controls" /></div>' },
				KvLoadingPlaceholder: { template: '<div />' },
				TheMyKivaSecondaryMenu: { template: '<div />' },
			},
		},
	});

	return {
		getVm: () => childRef.current,
		mutate,
		showTipMsg,
	};
}

describe('DataSettingsPage', () => {
	describe('isUpdateDataSettingsSuccess', () => {
		it('returns true when both mutation fields are present', async () => {
			const { getVm } = mountForMethods();
			await nextTick();
			const vm = getVm();
			expect(vm.isUpdateDataSettingsSuccess({
				updateCookieOptOut: true,
				updatePiiSharingOptOut: false,
			})).toBe(true);
		});

		it('returns falsy when my is null or missing a field', async () => {
			const { getVm } = mountForMethods();
			await nextTick();
			const vm = getVm();
			expect(vm.isUpdateDataSettingsSuccess(null)).toBeFalsy();
			expect(vm.isUpdateDataSettingsSuccess({})).toBeFalsy();
			expect(vm.isUpdateDataSettingsSuccess({ updateCookieOptOut: true })).toBe(false);
		});
	});

	describe('getUpdateDataSettingsMy', () => {
		it('extracts my from response or error result', async () => {
			const { getVm } = mountForMethods();
			await nextTick();
			const vm = getVm();
			expect(vm.getUpdateDataSettingsMy({ data: { my: { updateCookieOptOut: true } } }))
				.toEqual({ updateCookieOptOut: true });
			expect(vm.getUpdateDataSettingsMy({
				result: { data: { my: { updatePiiSharingOptOut: false } } },
			})).toEqual({ updatePiiSharingOptOut: false });
			expect(vm.getUpdateDataSettingsMy(null)).toBe(null);
		});
	});

	describe('showSaveError', () => {
		it('shows auth message when code is api.authenticationRequired', async () => {
			const { getVm, showTipMsg } = mountForMethods();
			await nextTick();
			const vm = getVm();
			const e = { graphQLErrors: [{ extensions: { code: 'api.authenticationRequired' } }] };
			vm.showSaveError(e);
			expect(showTipMsg).toHaveBeenCalledWith('Please sign in to save your data settings.', 'error');
		});

		it('shows generic error otherwise', async () => {
			const { getVm, showTipMsg } = mountForMethods();
			await nextTick();
			const vm = getVm();
			vm.showSaveError({});
			expect(showTipMsg).toHaveBeenCalledWith(
				'There was an error trying to save your data settings. Please try again later.',
				'error'
			);
		});
	});

	describe('applySaveSuccess', () => {
		it('updates initialValues from form and shows success tip', async () => {
			const setCookie = vi.fn();
			const { getVm, showTipMsg } = mountForMethods();
			await nextTick();
			const vm = getVm();
			vm.cookieStore = { get: () => '', set: setCookie };
			vm.form.cookieOptOut = true;
			vm.form.piiSharingOptOut = false;

			vm.applySaveSuccess();

			expect(vm.initialValues).toEqual({ cookieOptOut: true, piiSharingOptOut: false });
			expect(showTipMsg).toHaveBeenCalledWith('Your cookie preferences have been saved');
		});
	});

	describe('saveSettings', () => {
		it('calls mutate with form values and runs success path when response has both fields', async () => {
			const mutate = vi.fn(() => Promise.resolve(updateDataSettingsSuccessResponse()));
			const { getVm, showTipMsg } = mountForMethods({ mutate });
			await nextTick();
			const vm = getVm();
			vm.cookieStore = { get: () => '', set: vi.fn() };
			vm.form.cookieOptOut = true;
			vm.form.piiSharingOptOut = true;

			await vm.saveSettings();

			expect(mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { cookieOptOut: true, piiSharingOptOut: true },
				})
			);
			expect(showTipMsg).toHaveBeenCalledWith('Your cookie preferences have been saved');
			expect(vm.initialValues.cookieOptOut).toBe(true);
		});

		it('calls showSaveError when mutation rejects without success result', async () => {
			const mutate = vi.fn(() => Promise.reject(new Error('Network error')));
			const { getVm, showTipMsg } = mountForMethods({ mutate });
			await nextTick();
			const vm = getVm();

			await vm.saveSettings();

			expect(showTipMsg).toHaveBeenCalledWith(
				'There was an error trying to save your data settings. Please try again later.',
				'error'
			);
		});
	});

	describe('syncKvgdprCookie', () => {
		it('writes kvgdpr cookie with opted_out and pii_opted_out from form', async () => {
			const setCookie = vi.fn();
			const { getVm } = mountForMethods();
			await nextTick();
			const vm = getVm();
			vm.cookieStore = { get: () => '', set: setCookie };
			vm.form.cookieOptOut = true;
			vm.form.piiSharingOptOut = true;

			vm.syncKvgdprCookie();

			expect(setCookie).toHaveBeenCalledTimes(1);
			expect(setCookie.mock.calls[0][0]).toBe('kvgdpr');
			expect(setCookie.mock.calls[0][1]).toMatch(/opted_out=true/);
			expect(setCookie.mock.calls[0][1]).toMatch(/pii_opted_out=true/);
		});

		it('does nothing when cookieStore is absent', async () => {
			const { getVm } = mountForMethods();
			await nextTick();
			const vm = getVm();
			vm.cookieStore = null;
			expect(() => vm.syncKvgdprCookie()).not.toThrow();
		});
	});

	describe('confirmCloseAccount', () => {
		it('calls mutate and redirects to /closed on success', async () => {
			const mutate = vi.fn(() => Promise.resolve({ data: { my: { closeAccount: true } } }));
			const { getVm } = mountForMethods({ mutate });
			await nextTick();
			const vm = getVm();
			delete window.location;
			window.location = { href: '' };

			await vm.confirmCloseAccount();

			expect(mutate).toHaveBeenCalled();
			expect(window.location.href).toBe('/closed');
		});

		it('shows error when mutation returns closeAccount false', async () => {
			const mutate = vi.fn(() => Promise.resolve({ data: { my: { closeAccount: false } } }));
			const { getVm, showTipMsg } = mountForMethods({ mutate });
			await nextTick();
			const vm = getVm();

			await vm.confirmCloseAccount();

			expect(showTipMsg).toHaveBeenCalledWith(
				'There was an error trying to close your account. Please try again later.',
				'error'
			);
		});

		it('shows auth error when mutation rejects with api.authenticationRequired', async () => {
			const err = new Error('Auth');
			err.graphQLErrors = [{ extensions: { code: 'api.authenticationRequired' } }];
			const mutate = vi.fn(() => Promise.reject(err));
			const { getVm, showTipMsg } = mountForMethods({ mutate });
			await nextTick();
			const vm = getVm();

			await vm.confirmCloseAccount();

			expect(showTipMsg).toHaveBeenCalledWith(
				'Please sign in recently to close your account.',
				'error'
			);
		});

		it('redirects to start-verification when org.kiva.EmailVerificationRequired', async () => {
			const err = new Error('Verify');
			err.graphQLErrors = [{ extensions: { code: 'org.kiva.EmailVerificationRequired' } }];
			const mutate = vi.fn(() => Promise.reject(err));
			const { getVm } = mountForMethods({ mutate });
			await nextTick();
			const vm = getVm();
			delete window.location;
			window.location = { href: 'https://kiva.org/settings/data' };

			await vm.confirmCloseAccount();

			expect(window.location.href).toContain('/start-verification');
			expect(window.location.href).toContain('process=closing');
		});
	});
});
