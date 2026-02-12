import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import AccountSettingsLenderProfile from '#src/pages/Settings/AccountSettings/components/AccountSettingsLenderProfile';
import { globalOptions } from '../../../../specUtils';

/** Minimal country list for country dropdown (sourced from general.allCountriesIsoMap in app) */
const mockCountries = [{ isoCode: 'US', name: 'United States' }];

/** Mock profile data matching lenderProfileQuery shape */
const mockProfileData = (overrides = {}) => ({
	my: {
		id: '123',
		userAccount: {
			id: '123',
			firstName: 'Jane',
			publicId: 'jane123',
			public: true,
		},
		lender: {
			id: '123',
			name: 'Jane',
			publicId: 'jane123',
			image: { id: 1, url: 'https://example.com/photo.jpg' },
			lenderPage: {
				city: 'Oakland',
				state: 'CA',
				country: { id: 1, isoCode: 'US', name: 'United States' },
				occupation: 'Engineer',
				url: 'https://jane.example.com',
				loanBecause: 'I care about impact.',
				otherInfo: 'About me text.',
			},
		},
		...overrides.my,
	},
});

/** Success response shape expected by checkMutationResponse */
const mutationSuccess = key => ({ data: { my: { [key]: { success: true } } } });

/**
 * Wrapper that exposes the child component instance after mount (via shared ref),
 * so we can test methods/state using only @testing-library/vue's render.
 */
function getProfileWrapper(apolloOverrides = {}) {
	const childRef = { current: null };
	const showTipMsg = vi.fn();
	const Mutate = apolloOverrides.mutate ?? vi.fn(({ mutation }) => {
		const name = mutation?.definitions?.[0]?.name?.value || 'updateDisplayName';
		return Promise.resolve(mutationSuccess(name));
	});
	const query = apolloOverrides.query ?? vi.fn(() => Promise.resolve({ data: {} }));

	const Wrapper = {
		components: { AccountSettingsLenderProfile },
		template: '<AccountSettingsLenderProfile ref="child" :countries="countries" />',
		data: () => ({ countries: mockCountries }),
		mounted() {
			childRef.current = this.$refs.child;
		},
	};

	render(Wrapper, {
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				apollo: {
					...globalOptions.provide.apollo,
					query,
					mutate: Mutate,
					...apolloOverrides,
				},
			},
			mocks: {
				...globalOptions.mocks,
				$showTipMsg: showTipMsg,
			},
			stubs: {
				KvSettingsCard: {
					template: '<div><slot name="content"></slot></div>',
				},
				ProfileImageUpload: { template: '<div></div>' },
			},
		},
	});

	return {
		getVm: () => childRef.current,
		mutate: Mutate,
		query,
		showTipMsg,
	};
}

describe('AccountSettingsLenderProfile', () => {
	describe('applyProfileData', () => {
		it('applies existing user data to localForm and initialForm', async () => {
			const { getVm } = getProfileWrapper();
			await nextTick();
			const vm = getVm();
			const data = mockProfileData();

			vm.applyProfileData(data);

			expect(vm.localForm.name).toBe('Jane');
			expect(vm.localForm.publicId).toBe('jane123');
			expect(vm.localForm.city).toBe('Oakland');
			expect(vm.localForm.state).toBe('CA');
			expect(vm.localForm.countryIsoCode).toBe('US');
			expect(vm.localForm.occupation).toBe('Engineer');
			expect(vm.localForm.website).toBe('https://jane.example.com');
			expect(vm.localForm.loanBecause).toBe('I care about impact.');
			expect(vm.localForm.otherInfo).toBe('About me text.');
			expect(vm.localForm.public).toBe(true);
			expect(vm.initialForm).toEqual(vm.localForm);
		});
	});

	describe('incremental field updates', () => {
		it('sends only the changed field in its mutation (no other fields included)', async () => {
			const mutate = vi.fn(() => Promise.resolve(
				{ data: { my: { updateDisplayName: { success: true } } } },
			));
			const { getVm } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('name', 'Jane Doe');

			await vm.save();

			expect(mutate).toHaveBeenCalledTimes(1);
			expect(mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { displayName: 'Jane Doe' },
				}),
			);
			expect(mutate.mock.calls[0][0].variables).toEqual({ displayName: 'Jane Doe' });
		});

		it('sends only occupation when only occupation was changed', async () => {
			const mutate = vi.fn(() => Promise.resolve(
				{ data: { my: { updateOccupation: { success: true } } } },
			));
			const { getVm } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('occupation', 'Designer');

			await vm.save();

			expect(mutate).toHaveBeenCalledTimes(1);
			expect(mutate.mock.calls[0][0].variables).toEqual({ occupation: 'Designer' });
		});

		it('sends only location fields when only location was changed', async () => {
			const mutate = vi.fn(() => Promise.resolve(
				{ data: { my: { updateLocation: { success: true } } } },
			));
			const { getVm } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('city', 'Berkeley');
			vm.updateForm('state', 'CA');
			vm.updateForm('countryIsoCode', 'US');

			await vm.save();

			expect(mutate).toHaveBeenCalledTimes(1);
			expect(mutate.mock.calls[0][0].variables).toEqual({
				city: 'Berkeley',
				state: 'CA',
				countryIsoCode: 'US',
			});
		});

		it('runs multiple mutations in sequence, each with only its variables', async () => {
			const mutate = vi.fn(({ mutation }) => {
				const name = mutation?.definitions?.[0]?.name?.value || 'unknown';
				return Promise.resolve({ data: { my: { [name]: { success: true } } } });
			});
			const { getVm } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('name', 'Jane Smith');
			vm.updateForm('occupation', 'Writer');

			await vm.save();

			expect(mutate).toHaveBeenCalledTimes(2);
			expect(mutate.mock.calls[0][0].variables).toEqual({ displayName: 'Jane Smith' });
			expect(mutate.mock.calls[1][0].variables).toEqual({ occupation: 'Writer' });
		});

		it('awaits each mutation response before starting the next (sequential, not parallel)', async () => {
			const resolvers = [];
			const mutate = vi.fn(() => new Promise(resolve => {
				resolvers.push(resolve);
			}));
			const { getVm } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('name', 'Jane Smith');
			vm.updateForm('occupation', 'Writer');

			const savePromise = vm.save();

			// First mutation in flight; second must not start until first resolves
			await nextTick();
			expect(mutate).toHaveBeenCalledTimes(1);

			resolvers[0]({ data: { my: { updateDisplayName: { success: true } } } });
			await new Promise(r => { setTimeout(r, 0); });

			expect(mutate).toHaveBeenCalledTimes(2);

			resolvers[1]({ data: { my: { updateOccupation: { success: true } } } });
			await savePromise;
		});

		it('does not call any profile mutation when no field was changed', async () => {
			const mutate = vi.fn(() => Promise.resolve({ data: { my: {} } }));
			const { getVm } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());

			await vm.save();

			expect(mutate).not.toHaveBeenCalled();
		});
	});

	describe('checkMutationResponse / save error handling', () => {
		it('shows error tip when mutation returns response.errors', async () => {
			const mutate = vi.fn(() => Promise.resolve({
				errors: [{ message: 'GraphQL validation failed' }],
			}));
			const { getVm, showTipMsg } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('name', 'Jane Doe');

			await vm.save();

			expect(showTipMsg).toHaveBeenCalledWith('GraphQL validation failed', 'error');
		});

		it('shows error tip when mutation returns success: false with error message', async () => {
			const mutate = vi.fn(() => Promise.resolve({
				data: { my: { updateDisplayName: { success: false, error: 'Name is already taken' } } },
			}));
			const { getVm, showTipMsg } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('name', 'Jane Doe');

			await vm.save();

			expect(showTipMsg).toHaveBeenCalledWith('Name is already taken', 'error');
		});

		it('shows fallback error tip when mutation returns success: false without error message', async () => {
			const mutate = vi.fn(() => Promise.resolve({
				data: { my: { updateDisplayName: { success: false } } },
			}));
			const { getVm, showTipMsg } = getProfileWrapper({ mutate });
			await nextTick();
			const vm = getVm();

			vm.loading = false;
			vm.applyProfileData(mockProfileData());
			vm.updateForm('name', 'Jane Doe');

			await vm.save();

			expect(showTipMsg).toHaveBeenCalledWith('Failed to save profile', 'error');
		});
	});
});
