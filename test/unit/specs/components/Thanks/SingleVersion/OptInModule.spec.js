/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount, flushPromises } from '@vue/test-utils';
import { trackMetaEvent } from '@kiva/kv-analytics';
import OptInModule from '#src/components/Thanks/SingleVersion/OptInModule';
import { globalOptions } from '../../../../specUtils';

vi.mock('@kiva/kv-analytics', async importOriginal => ({
	...(await importOriginal()),
	trackMetaEvent: vi.fn(),
}));

// Presentational children, stubbed so the test focuses on what this component reports.
const stubs = {
	BorrowerAvatarsContainer: { template: '<div />' },
	OptInNotification: { template: '<div data-testid="opt-in-notification" />' },
};

describe('OptInModule.vue', () => {
	let mutate;

	// Both mutations resolve to a nullable Boolean; the composable turns that into the
	// applied/not-applied value this component reports on.
	const mountModule = ({ applied = true, isGuest = false, visitorId = null } = {}) => {
		mutate = vi.fn().mockResolvedValue({
			data: {
				my: { updateCommunicationSettings: applied },
				visitorEmailOptIn: { updateCommunicationSettings: applied },
			},
		});

		return mount(OptInModule, {
			props: { isGuest },
			global: {
				...globalOptions,
				stubs,
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, mutate },
					cookieStore: { get: () => visitorId, set: () => {} },
					// injected here rather than supplied as a global mock
					$kvTrackEvent: () => {},
				},
			},
		});
	};

	const accept = wrapper => wrapper.findAll('button')[0].trigger('click');
	const decline = wrapper => wrapper.findAll('button')[1].trigger('click');

	beforeEach(() => {
		trackMetaEvent.mockClear();
	});

	it('reports the sign-up when a lender opts in', async () => {
		const wrapper = mountModule();

		await accept(wrapper);
		await flushPromises();

		expect(trackMetaEvent).toHaveBeenCalledWith('emailSignUp');
	});

	it('reports the sign-up for a guest visitor', async () => {
		const wrapper = mountModule({ isGuest: true, visitorId: 'visitor-123' });

		await accept(wrapper);
		await flushPromises();

		expect(trackMetaEvent).toHaveBeenCalledWith('emailSignUp');
	});

	// Declining runs no mutation at all, so there is nothing to report
	it('reports nothing when a lender declines', async () => {
		const wrapper = mountModule();

		await decline(wrapper);
		await flushPromises();

		expect(mutate).not.toHaveBeenCalled();
		expect(trackMetaEvent).not.toHaveBeenCalled();
	});

	it('reports nothing when the mutation does not apply', async () => {
		const wrapper = mountModule({ applied: false });

		await accept(wrapper);
		await flushPromises();

		expect(mutate).toHaveBeenCalled();
		expect(trackMetaEvent).not.toHaveBeenCalled();
	});
});
