/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import DefinitionsLightbox from '#src/components/BorrowerProfile/DefinitionsLightbox';
import { globalOptions } from '../../../specUtils';

// Control what the shared definitions composable resolves so this spec exercises
// only the lightbox's own open/close/tracking behavior. The resolve pipeline
// (Contentful-first, Salesforce fallback) is covered by useBorrowerProfileDefinitions.spec.
const { mockResolveDefinition } = vi.hoisted(() => ({ mockResolveDefinition: vi.fn() }));
vi.mock('#src/composables/useBorrowerProfileDefinitions', () => ({
	default: () => ({ resolveDefinition: mockResolveDefinition }),
}));

const solution = {
	title: 'Why is this borrower anonymous?',
	content: '<p>For the borrower\'s privacy.</p>',
};

function mountLightbox() {
	const trackEvent = vi.fn();
	const wrapper = mount(DefinitionsLightbox, {
		global: {
			...globalOptions,
			mocks: { ...globalOptions.mocks, $kvTrackEvent: trackEvent },
			stubs: {
				// Surface visibility/title/content for assertions.
				KvLightbox: {
					name: 'KvLightbox',
					props: ['visible', 'title'],
					template: '<div v-if="visible" data-testid="stub-lightbox"><slot /></div>',
				},
			},
		},
	});
	return { wrapper, trackEvent };
}

describe('DefinitionsLightbox', () => {
	afterEach(() => {
		mockResolveDefinition.mockReset();
	});

	it('is hidden until open() is called', () => {
		const { wrapper } = mountLightbox();

		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(false);
		expect(wrapper.find('[data-testid="stub-lightbox"]').exists()).toBe(false);
	});

	it('resolves a definition and shows its title and content on open()', async () => {
		mockResolveDefinition.mockResolvedValue(solution);
		const { wrapper } = mountLightbox();

		await wrapper.vm.open({ cid: 'bp-def-anonymized-loan', sfid: '501US00000NRTYa' });
		await wrapper.vm.$nextTick();

		expect(mockResolveDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-anonymized-loan',
			sfid: '501US00000NRTYa',
			forceSalesforce: false,
		});
		const lightbox = wrapper.findComponent({ name: 'KvLightbox' });
		expect(lightbox.props('visible')).toBe(true);
		expect(lightbox.props('title')).toBe(solution.title);
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain(solution.content);
	});

	it('fires the tracking event passed to open()', async () => {
		mockResolveDefinition.mockResolvedValue(solution);
		const { wrapper, trackEvent } = mountLightbox();

		await wrapper.vm.open({
			cid: 'bp-def-anonymized-loan',
			track: ['Borrower Profile', 'click-Loan-Details-tab-definition-link', 'Loan length'],
		});

		expect(trackEvent).toHaveBeenCalledWith(
			'Borrower Profile',
			'click-Loan-Details-tab-definition-link',
			'Loan length',
		);
	});

	it('passes forceSalesforce through to the resolver', async () => {
		mockResolveDefinition.mockResolvedValue(solution);
		const { wrapper } = mountLightbox();

		await wrapper.vm.open({ cid: 'x', sfid: 'sf-1', forceSalesforce: true });

		expect(mockResolveDefinition).toHaveBeenCalledWith({ cid: 'x', sfid: 'sf-1', forceSalesforce: true });
	});

	it('stays hidden when the definition resolves to null', async () => {
		mockResolveDefinition.mockResolvedValue(null);
		const { wrapper } = mountLightbox();

		await wrapper.vm.open({ cid: 'missing' });
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.visible).toBe(false);
	});

	it('hides immediately on close() and clears its content after the animation', async () => {
		vi.useFakeTimers();
		try {
			mockResolveDefinition.mockResolvedValue(solution);
			const { wrapper } = mountLightbox();
			await wrapper.vm.open({ cid: 'bp-def-anonymized-loan' });

			wrapper.vm.close();

			// Hidden right away, but content is retained while the modal animates out.
			expect(wrapper.vm.visible).toBe(false);
			expect(wrapper.vm.title).toBe(solution.title);

			vi.advanceTimersByTime(500);
			expect(wrapper.vm.title).toBe('');
			expect(wrapper.vm.content).toBe('');
		} finally {
			vi.useRealTimers();
		}
	});

	it('does not clear content reopened before the previous close timer fires', async () => {
		vi.useFakeTimers();
		try {
			mockResolveDefinition.mockResolvedValue(solution);
			const { wrapper } = mountLightbox();
			await wrapper.vm.open({ cid: 'first' });
			wrapper.vm.close();

			// Reopen with new content partway through the close animation.
			const second = {
				title: 'Why is this loan anonymous?',
				content: '<p>The loan details were removed.</p>',
			};
			mockResolveDefinition.mockResolvedValue(second);
			vi.advanceTimersByTime(200);
			await wrapper.vm.open({ cid: 'second' });

			// The stale clear timer from the first close must not wipe the reopened content.
			vi.advanceTimersByTime(500);
			await wrapper.vm.$nextTick();

			expect(wrapper.vm.visible).toBe(true);
			expect(wrapper.vm.title).toBe(second.title);
			expect(wrapper.vm.content).toBe(second.content);
		} finally {
			vi.useRealTimers();
		}
	});
});
