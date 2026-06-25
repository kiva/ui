/* eslint-disable import/no-extraneous-dependencies */
import { mount, flushPromises } from '@vue/test-utils';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import { globalOptions } from '../../../specUtils';

// Builds a Contentful apollo response containing a borrower-profile-definitions group.
function makeContentfulResponse(entries) {
	return {
		data: {
			contentful: {
				entries: {
					items: [{
						sys: { contentType: { sys: { id: 'contentGroup' } } },
						fields: {
							key: 'borrower-profile-definitions',
							name: 'Borrower Profile Definitions',
							type: null,
							contents: entries,
						},
					}],
				},
			},
		},
	};
}

// Builds a richTextContent entry compatible with formatContentTypes / formatRichTextContent.
// marks: [] is required by @contentful/rich-text-html-renderer on text nodes.
function makeRichTextEntry(key, name, text) {
	return {
		sys: { contentType: { sys: { id: 'richTextContent' } } },
		fields: {
			key,
			name,
			richText: {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'paragraph',
					data: {},
					content: [{
						nodeType: 'text',
						value: text,
						marks: [],
						data: {},
					}],
				}],
			},
		},
	};
}

async function mountSummaryCard({ anonymizationLevel, query }) {
	const wrapper = mount(SummaryCard, {
		global: {
			...globalOptions,
			mocks: {
				...globalOptions.mocks,
				$route: { params: { id: '12345' } },
			},
			provide: {
				...globalOptions.provide,
				apollo: {
					...globalOptions.provide.apollo,
					query,
				},
			},
			stubs: {
				// Expose lightbox visibility/content via simple markup for assertions.
				KvLightbox: {
					name: 'KvLightbox',
					props: ['visible', 'title'],
					template: '<div v-if="visible" data-testid="stub-lightbox"><slot /></div>',
				},
			},
		},
	});
	// anonymizationLevel is populated by the apollo result() handler in the running app;
	// set it directly so the relevant trigger renders for this behavior test.
	await wrapper.setData({ isLoading: false, anonymizationLevel, use: 'A loan of $600 helps...' });
	return wrapper;
}

describe('SummaryCard', () => {
	it('opens the lightbox with Contentful content when the PII info icon is clicked', async () => {
		// mounted() fires fetchSummaryCardData() which calls apollo.query({query: mountQuery}).
		// Provide a default empty response for that call; the Contentful response is returned
		// for subsequent calls triggered by button interaction.
		const contentfulResponse = makeContentfulResponse([
			makeRichTextEntry('bp-def-anonymized-loan', 'Why anonymous?', 'This borrower requested privacy.'),
		]);
		const query = vi.fn()
			.mockResolvedValueOnce({}) // mountQuery from mounted()
			.mockResolvedValue(contentfulResponse); // Contentful query on click
		const wrapper = await mountSummaryCard({ anonymizationLevel: 'pii', query });
		await flushPromises(); // let mounted() settle

		query.mockClear(); // reset call count — only count calls from here on

		await wrapper.find('[data-testid="bp-summary-pii-info"]').trigger('click');
		await flushPromises();

		// Only the Contentful query should have fired (not a direct Salesforce query)
		expect(query).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(query.mock.calls[0][0].query)).toContain('borrower-profile-definitions');

		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(true);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('title')).toBe('Why anonymous?');
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain('This borrower requested privacy.');
	});

	it('opens the lightbox with Contentful content when "Learn more" is clicked', async () => {
		const contentfulResponse = makeContentfulResponse([
			makeRichTextEntry('bp-def-anonymous-description', 'Anonymous loan', 'Details about anonymization.'),
		]);
		const query = vi.fn()
			.mockResolvedValueOnce({}) // mountQuery from mounted()
			.mockResolvedValue(contentfulResponse); // Contentful query on click
		const wrapper = await mountSummaryCard({ anonymizationLevel: 'full', query });
		await flushPromises(); // let mounted() settle

		query.mockClear(); // reset call count — only count calls from here on

		await wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').trigger('click');
		await flushPromises();

		// Only the Contentful query should have fired (not a direct Salesforce query)
		expect(query).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(query.mock.calls[0][0].query)).toContain('borrower-profile-definitions');

		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(true);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('title')).toBe('Anonymous loan');
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain('Details about anonymization.');
	});

	it('falls back to Salesforce when Contentful has no matching entry for the PII icon', async () => {
		const salesforceSolution = {
			name: 'Why is this anonymous?',
			note: '<p>For the borrower\'s privacy.</p>',
		};
		const query = vi.fn()
			.mockResolvedValueOnce({}) // mountQuery from mounted()
			.mockResolvedValueOnce(makeContentfulResponse([])) // Contentful: no matching entry
			.mockResolvedValueOnce({ // Salesforce fallback
				data: { general: { salesforceSolution } },
			});
		const wrapper = await mountSummaryCard({ anonymizationLevel: 'pii', query });
		await flushPromises(); // let mounted() settle

		query.mockClear(); // reset call count — only count calls from here on

		await wrapper.find('[data-testid="bp-summary-pii-info"]').trigger('click');
		await flushPromises();

		// Both queries should fire: Contentful first, then Salesforce
		expect(query).toHaveBeenCalledTimes(2);
		expect(query).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: '501US00000NRTYa' } })
		);

		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('visible')).toBe(true);
		expect(wrapper.findComponent({ name: 'KvLightbox' }).props('title')).toBe(salesforceSolution.name);
		expect(wrapper.get('[data-testid="stub-lightbox"]').html()).toContain(salesforceSolution.note);
	});
});
