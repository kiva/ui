import trackTransactionEvent from '#src/util/trackTransactionEvent';
import parseGACookie from '#src/util/parseGACookie';
import parseSPCookie from '#src/util/parseSPCookie';

vi.mock('#src/util/parseGACookie');
vi.mock('#src/util/parseSPCookie');

describe('trackTransactionEvent.js', () => {
	let mockApolloClient;
	let mockCookieStore;

	beforeEach(() => {
		vi.clearAllMocks();

		mockApolloClient = {
			mutate: vi.fn().mockResolvedValue({ data: {} })
		};

		mockCookieStore = {
			get: vi.fn().mockReturnValue('test-visitor-id')
		};

		parseGACookie.mockReturnValue({
			campaign: 'test-campaign',
			campaignContent: 'test-content',
			gclid: '',
			medium: 'email',
			source: 'newsletter'
		});

		parseSPCookie.mockReturnValue({
			snowplowUserId: 'sp-user-123',
			snowplowSessionId: 'sp-session-456'
		});
	});

	describe('trackTransactionEvent', () => {
		it('should track transaction with GA and Snowplow data', async () => {
			await trackTransactionEvent('txn-123', mockApolloClient, mockCookieStore);

			expect(parseGACookie).toHaveBeenCalledWith(mockCookieStore);
			expect(parseSPCookie).toHaveBeenCalledWith(mockCookieStore);
			expect(mockCookieStore.get).toHaveBeenCalledWith('uiv');
			expect(mockApolloClient.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					campaign: 'test-campaign',
					campaignContent: 'test-content',
					medium: 'email',
					snowplowSessionId: 'sp-session-456',
					snowplowUserId: 'sp-user-123',
					source: 'newsletter',
					transactionId: 'txn-123',
					visitorId: 'test-visitor-id'
				}
			});
		});

		it('should return false when transactionId is missing', async () => {
			const result = await trackTransactionEvent('', mockApolloClient, mockCookieStore);

			expect(result).toBe(false);
			expect(mockApolloClient.mutate).not.toHaveBeenCalled();
		});

		it('should return false when transactionId is null', async () => {
			const result = await trackTransactionEvent(null, mockApolloClient, mockCookieStore);

			expect(result).toBe(false);
			expect(mockApolloClient.mutate).not.toHaveBeenCalled();
		});

		it('should return false when transactionId is undefined', async () => {
			const result = await trackTransactionEvent(undefined, mockApolloClient, mockCookieStore);

			expect(result).toBe(false);
			expect(mockApolloClient.mutate).not.toHaveBeenCalled();
		});

		it('should use google-cpc as source when gclid is present', async () => {
			parseGACookie.mockReturnValue({
				campaign: 'google-campaign',
				campaignContent: 'ad-content',
				gclid: 'abc123',
				medium: 'cpc',
				source: 'google'
			});

			await trackTransactionEvent('txn-456', mockApolloClient, mockCookieStore);

			expect(mockApolloClient.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: expect.objectContaining({
					source: 'google-cpc'
				})
			});
		});

		it('should use original source when gclid is not present', async () => {
			parseGACookie.mockReturnValue({
				campaign: 'social-campaign',
				campaignContent: 'post-content',
				gclid: '',
				medium: 'social',
				source: 'facebook'
			});

			await trackTransactionEvent('txn-789', mockApolloClient, mockCookieStore);

			expect(mockApolloClient.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: expect.objectContaining({
					source: 'facebook'
				})
			});
		});

		it('should use null for visitorId when cookie is not present', async () => {
			mockCookieStore.get.mockReturnValue(null);

			await trackTransactionEvent('txn-101', mockApolloClient, mockCookieStore);

			expect(mockApolloClient.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: expect.objectContaining({
					visitorId: null
				})
			});
		});

		it('should handle empty tracking data from cookies', async () => {
			parseGACookie.mockReturnValue({
				campaign: '',
				campaignContent: '',
				gclid: '',
				medium: '',
				source: ''
			});

			parseSPCookie.mockReturnValue({
				snowplowUserId: '',
				snowplowSessionId: ''
			});

			await trackTransactionEvent('txn-202', mockApolloClient, mockCookieStore);

			expect(mockApolloClient.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					campaign: '',
					campaignContent: '',
					medium: '',
					snowplowSessionId: '',
					snowplowUserId: '',
					source: '',
					transactionId: 'txn-202',
					visitorId: 'test-visitor-id'
				}
			});
		});

		it('should handle mutation success', async () => {
			mockApolloClient.mutate.mockResolvedValue({
				data: { trackTransaction: { success: true } }
			});

			await trackTransactionEvent('txn-303', mockApolloClient, mockCookieStore);

			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});

		it('should handle mutation failure', async () => {
			mockApolloClient.mutate.mockRejectedValue(new Error('Mutation failed'));

			await trackTransactionEvent('txn-404', mockApolloClient, mockCookieStore);

			expect(mockApolloClient.mutate).toHaveBeenCalled();
		});
	});
});
