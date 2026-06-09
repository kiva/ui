/* eslint-disable import/no-extraneous-dependencies */
import { mount, flushPromises } from '@vue/test-utils';
import DetailsDefinitionsLightbox from '#src/components/BorrowerProfile/DetailsDefinitionsLightbox';
import { globalOptions } from '../../../specUtils';

// Isolate the component's own logic (route -> fetch -> find entry -> display)
// from the Contentful formatting pipeline, which is covered by contentfulUtils' own tests.
vi.mock('#src/util/contentfulUtils', () => ({
	formatContentGroupsFlat: () => ({
		borrowerProfileDefinitions: {
			contents: [{ key: 'bp-def-loan-length', name: 'Loan length', richText: {} }],
		},
	}),
}));
vi.mock('@contentful/rich-text-html-renderer', () => ({
	documentToHtmlString: () => '<p>rich text</p>',
}));

function mountLightbox({ useSalesForce = false, apolloQuery } = {}) {
	const trackEvent = vi.fn();
	const apollo = { ...globalOptions.provide.apollo, query: apolloQuery };
	const wrapper = mount(DetailsDefinitionsLightbox, {
		props: { useSalesForce },
		global: {
			...globalOptions,
			provide: { ...globalOptions.provide, apollo },
			mocks: { ...globalOptions.mocks, $kvTrackEvent: trackEvent },
		},
	});
	return { wrapper, trackEvent };
}

describe('DetailsDefinitionsLightbox', () => {
	it('fetches and displays a Salesforce solution when useSalesForce is true', async () => {
		const apolloQuery = vi.fn().mockResolvedValue({
			data: { general: { salesforceSolution: { name: 'Loan length', note: '<p>How long...</p>' } } },
		});
		const { wrapper, trackEvent } = mountLightbox({ useSalesForce: true, apolloQuery });

		await wrapper.vm.showDefinition({
			sfid: '50150000000Ry3z', panelName: 'Loan-Details', linkText: 'Loan length',
		});
		await flushPromises();

		expect(trackEvent).toHaveBeenCalledWith(
			'Borrower Profile',
			'click-Loan-Details-tab-definition-link',
			'Loan length',
		);
		expect(wrapper.vm.lightboxTitle).toBe('Loan length');
		expect(wrapper.vm.lightboxContent).toBe('<p>How long...</p>');
		expect(wrapper.vm.isLightboxVisible).toBe(true);
	});

	it('fetches and displays a Contentful definition when useSalesForce is false', async () => {
		const apolloQuery = vi.fn().mockResolvedValue({
			data: { contentful: { entries: { items: [{}] } } },
		});
		const { wrapper } = mountLightbox({ useSalesForce: false, apolloQuery });

		await wrapper.vm.showDefinition({
			cid: 'bp-def-loan-length', panelName: 'Loan-Details', linkText: 'Loan length',
		});
		await flushPromises();

		expect(wrapper.vm.lightboxTitle).toBe('Loan length');
		expect(wrapper.vm.lightboxContent).toBe('<p>rich text</p>');
		expect(wrapper.vm.isLightboxVisible).toBe(true);
	});

	it('hides the lightbox when closed', async () => {
		const { wrapper } = mountLightbox({ apolloQuery: vi.fn() });
		wrapper.vm.isLightboxVisible = true;

		wrapper.vm.closeLightbox();

		expect(wrapper.vm.isLightboxVisible).toBe(false);
	});
});
