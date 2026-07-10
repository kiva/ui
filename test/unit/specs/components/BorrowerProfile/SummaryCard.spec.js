/* eslint-disable import/no-extraneous-dependencies */
import { mount, flushPromises } from '@vue/test-utils';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import { globalOptions } from '../../../specUtils';

vi.mock('#src/util/logReadQueryError');

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
			.mockResolvedValueOnce({ data: { getLoanPills: { values: [] } } }) // aiLoanPills from mounted()
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

describe('SummaryCard AI pills', () => {
	const loanResponse = {
		data: {
			lend: {
				loan: {
					id: 12345,
					activity: { id: 1, name: 'Retail' },
					distributionModel: 'fieldPartner',
					fundraisingPercent: 0.5,
					fundraisingTimeLeft: '5 days',
					fundraisingTimeLeftMilliseconds: 1,
					geocode: { city: 'Lima', state: '', country: { id: 1, name: 'Peru' } },
					loanAmount: '600',
					loanFundraisingInfo: { id: 1, fundedAmount: '300', reservedAmount: '0' },
					plannedExpirationDate: '2026-12-01',
					unreservedAmount: '300',
					inPfp: false,
					pfpMinLenders: 0,
					lenders: { totalCount: 3 },
					comments: { totalCount: 0 },
				},
			},
		},
	};

	// Mounts SummaryCard with a controllable apollo.query mock; callers queue the
	// mount-query response first, then the AI-pills response.
	function mountWithQuery(query) {
		return mount(SummaryCard, {
			global: {
				...globalOptions,
				mocks: {
					...globalOptions.mocks,
					$route: { params: { id: '12345' } },
				},
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, query },
				},
				stubs: {
					KvLightbox: {
						name: 'KvLightbox',
						props: ['visible', 'title'],
						template: '<div v-if="visible"><slot /></div>',
					},
				},
			},
		});
	}

	it('renders a single AI pill in place of the activity tag when pills are returned', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(loanResponse) // mountQuery
			.mockResolvedValueOnce({
				data: {
					getLoanPills: {
						values: [
							{ loanId: 12345, pills: ['Woman-owned', 'First loan'] },
						]
					}
				}
			}); // aiLoanPills
		const wrapper = mountWithQuery(query);
		await flushPromises();

		const pill = wrapper.find('[data-testid="bp-summary-ai-pill"]');
		expect(pill.exists()).toBe(true);
		expect(pill.text()).toBe('Woman-owned'); // only the first pill
		expect(wrapper.findAll('[data-testid="bp-summary-ai-pill"]')).toHaveLength(1);
		expect(wrapper.find('[data-testid="bp-summary-country-tag"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="bp-summary-activity-tag"]').exists()).toBe(false);
		expect(query).toHaveBeenNthCalledWith(2, expect.objectContaining({ variables: { loanIds: [12345] } }));
	});

	it('falls back to the activity tag when no pills are returned', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(loanResponse) // mountQuery
			.mockResolvedValueOnce({ data: { getLoanPills: { values: [] } } }); // aiLoanPills
		const wrapper = mountWithQuery(query);
		await flushPromises();

		expect(wrapper.find('[data-testid="bp-summary-ai-pill"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-activity-tag"]').text()).toBe('Retail');
		expect(wrapper.find('[data-testid="bp-summary-country-tag"]').exists()).toBe(true);
	});

	it('falls back to the activity tag when the loan entry has an empty pills list', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(loanResponse) // mountQuery
			.mockResolvedValueOnce({
				data: { getLoanPills: { values: [{ loanId: 12345, pills: [] }] } },
			}); // aiLoanPills: loan entry present, but no pills for it
		const wrapper = mountWithQuery(query);
		await flushPromises();

		expect(wrapper.find('[data-testid="bp-summary-ai-pill"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-activity-tag"]').text()).toBe('Retail');
	});

	it('falls back to the activity tag when the pills query rejects', async () => {
		const query = vi.fn()
			.mockResolvedValueOnce(loanResponse) // mountQuery
			.mockRejectedValueOnce(new Error('network error')); // aiLoanPills fails
		const wrapper = mountWithQuery(query);
		await flushPromises();

		expect(wrapper.find('[data-testid="bp-summary-ai-pill"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-activity-tag"]').text()).toBe('Retail');
	});

	it('keeps the loader until the pills fetch resolves (no activity-then-pill pop)', async () => {
		let resolvePills;
		const pillsPromise = new Promise(resolve => { resolvePills = resolve; });
		const query = vi.fn()
			.mockResolvedValueOnce(loanResponse) // mountQuery
			.mockReturnValueOnce(pillsPromise); // aiLoanPills still pending
		const wrapper = mountWithQuery(query);
		await flushPromises();

		// The mount query has resolved but pills are still in flight, so the card is
		// still loading: the tags must not render the activity tag (which would then
		// pop to the pill once pills arrive).
		expect(wrapper.find('[data-testid="bp-summary-activity-tag"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-ai-pill"]').exists()).toBe(false);

		resolvePills({
			data: { getLoanPills: { values: [{ loanId: 12345, pills: ['Woman-owned'] }] } },
		});
		await flushPromises();

		expect(wrapper.find('[data-testid="bp-summary-ai-pill"]').text()).toBe('Woman-owned');
	});
});
