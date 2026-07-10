import useBorrowerProfileDefinitions, {
	resetBorrowerProfileDefinitions,
} from '#src/composables/useBorrowerProfileDefinitions';

// Builds a Contentful apollo response containing a borrower-profile-definitions content group.
// entries is an array of richTextContent-typed items to include as the group's contents.
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

describe('useBorrowerProfileDefinitions', () => {
	// The definitions cache is module-level (shared across callers within a request),
	// so clear it between cases to keep them independent.
	afterEach(() => {
		resetBorrowerProfileDefinitions();
	});

	describe('resolveDefinition', () => {
		it('returns Contentful title and rendered HTML when cid matches', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue(
					makeContentfulResponse([
						makeRichTextEntry('bp-def-loan-length', 'Loan length', 'This loan runs 12 months.'),
					])
				),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			const result = await composable.resolveDefinition({ cid: 'bp-def-loan-length', sfid: 'some-sf-id' });

			expect(result.title).toBe('Loan length');
			expect(result.content).toContain('This loan runs 12 months.');
		});

		it('calls the Contentful query with contentKey borrower-profile-definitions', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue(
					makeContentfulResponse([
						makeRichTextEntry('bp-def-loan-length', 'Loan length', 'Some text'),
					])
				),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			await composable.resolveDefinition({ cid: 'bp-def-loan-length', sfid: 'some-sf-id' });

			// Only one query fired — the Contentful one, not Salesforce
			expect(mockApollo.query).toHaveBeenCalledTimes(1);
			const callArgs = mockApollo.query.mock.calls[0][0];
			// The GQL document should reference borrower-profile-definitions
			expect(JSON.stringify(callArgs.query)).toContain('borrower-profile-definitions');
		});

		it('falls back to Salesforce when cid has no matching Contentful entry', async () => {
			const mockApollo = {
				query: vi.fn()
					.mockResolvedValueOnce(
						// Contentful response — no entry for bp-def-nonexistent
						makeContentfulResponse([
							makeRichTextEntry('bp-def-loan-length', 'Loan length', 'Other content'),
						])
					)
					.mockResolvedValueOnce({
						// Salesforce response
						data: { general: { salesforceSolution: { name: 'SF Title', note: 'SF content' } } },
					}),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			const result = await composable.resolveDefinition({
				cid: 'bp-def-nonexistent',
				sfid: '50150000000SXVz',
			});

			expect(result).toEqual({ title: 'SF Title', content: 'SF content' });
			expect(mockApollo.query).toHaveBeenCalledTimes(2);
			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { id: '50150000000SXVz' } })
			);
		});

		it('returns null when cid has no matching entry and no sfid is provided', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue(
					makeContentfulResponse([
						makeRichTextEntry('bp-def-loan-length', 'Loan length', 'Some text'),
					])
				),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			const result = await composable.resolveDefinition({ cid: 'bp-def-nonexistent' });

			expect(result).toBeNull();
			// Only Contentful was queried — no Salesforce call
			expect(mockApollo.query).toHaveBeenCalledTimes(1);
		});

		it('reuses the cached Contentful response on subsequent calls', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue(
					makeContentfulResponse([
						makeRichTextEntry('bp-def-loan-length', 'Loan length', 'Cached text'),
					])
				),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			await composable.resolveDefinition({ cid: 'bp-def-loan-length' });
			await composable.resolveDefinition({ cid: 'bp-def-loan-length' });

			// loadDefinitions should only fire once even after two resolveDefinition calls
			expect(mockApollo.query).toHaveBeenCalledTimes(1);
		});

		it('falls back to Salesforce when the Contentful query rejects', async () => {
			const mockApollo = {
				query: vi.fn()
					.mockRejectedValueOnce(new Error('Contentful unavailable'))
					.mockResolvedValueOnce({
						data: { general: { salesforceSolution: { name: 'SF Title', note: 'SF content' } } },
					}),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			const result = await composable.resolveDefinition({
				cid: 'bp-def-loan-length',
				sfid: '50150000000SXVz',
			});

			// Contentful failure must not short-circuit the Salesforce fallback
			expect(result).toEqual({ title: 'SF Title', content: 'SF content' });
			expect(mockApollo.query).toHaveBeenCalledTimes(2);
		});

		it('retries the Contentful load after an earlier rejection instead of caching it', async () => {
			const mockApollo = {
				query: vi.fn()
					.mockRejectedValueOnce(new Error('Contentful unavailable'))
					.mockResolvedValueOnce(
						makeContentfulResponse([
							makeRichTextEntry('bp-def-loan-length', 'Loan length', 'Recovered text'),
						])
					),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			// First call: Contentful rejects and no sfid is given, so it resolves to null
			const first = await composable.resolveDefinition({ cid: 'bp-def-loan-length' });
			expect(first).toBeNull();

			// Second call: the rejected promise was not cached, so the load is retried and succeeds
			const second = await composable.resolveDefinition({ cid: 'bp-def-loan-length' });
			expect(second.title).toBe('Loan length');
			expect(second.content).toContain('Recovered text');
			expect(mockApollo.query).toHaveBeenCalledTimes(2);
		});

		it('bypasses Contentful and calls Salesforce directly when forceSalesforce is true', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValueOnce({
					// Salesforce response (the only call that should happen)
					data: { general: { salesforceSolution: { name: 'SF Title', note: 'SF content' } } },
				}),
			};
			const composable = useBorrowerProfileDefinitions(mockApollo);

			const result = await composable.resolveDefinition({
				cid: 'bp-def-loan-length',
				sfid: '50150000000SXVz',
				forceSalesforce: true,
			});

			// Contentful query must NOT fire — only the Salesforce query
			expect(mockApollo.query).toHaveBeenCalledTimes(1);
			expect(mockApollo.query).toHaveBeenCalledWith(
				expect.objectContaining({ variables: { id: '50150000000SXVz' } })
			);
			expect(result).toEqual({ title: 'SF Title', content: 'SF content' });
		});
	});
});
