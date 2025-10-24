import useTipMessage from '#src/composables/useTipMessage';
import logFormatter from '#src/util/logFormatter';

vi.mock('#src/util/logFormatter');

describe('useTipMessage.js', () => {
	let mockApollo;
	let showTipMsgFn;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn(),
		};
		const composable = useTipMessage(mockApollo);
		showTipMsgFn = composable.$showTipMsg;
		vi.clearAllMocks();
	});

	it('should call apollo mutate with message only', () => {
		mockApollo.mutate.mockResolvedValue({});

		showTipMsgFn('Test message');

		expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
		expect(mockApollo.mutate).toHaveBeenCalledWith({
			mutation: expect.anything(),
			variables: {
				message: 'Test message',
				type: '',
				persist: false,
			},
		});
	});

	it('should call apollo mutate with message and type', () => {
		mockApollo.mutate.mockResolvedValue({});

		showTipMsgFn('Success message', 'success');

		expect(mockApollo.mutate).toHaveBeenCalledWith({
			mutation: expect.anything(),
			variables: {
				message: 'Success message',
				type: 'success',
				persist: false,
			},
		});
	});

	it('should call apollo mutate with all parameters', () => {
		mockApollo.mutate.mockResolvedValue({});

		showTipMsgFn('Persistent error', 'error', true);

		expect(mockApollo.mutate).toHaveBeenCalledWith({
			mutation: expect.anything(),
			variables: {
				message: 'Persistent error',
				type: 'error',
				persist: true,
			},
		});
	});

	it('should handle mutation success without errors', async () => {
		mockApollo.mutate.mockResolvedValue({ data: {} });

		await showTipMsgFn('Test');

		expect(logFormatter).not.toHaveBeenCalled();
	});

	it('should catch and log errors when mutation fails', async () => {
		const mockError = new Error('Mutation failed');
		mockApollo.mutate.mockRejectedValue(mockError);

		showTipMsgFn('Test message');

		// Wait for promise to resolve
		await new Promise(resolve => {
			setTimeout(resolve, 0);
		});

		expect(logFormatter).toHaveBeenCalledWith(mockError, 'error');
	});

	it('should handle different message types', () => {
		mockApollo.mutate.mockResolvedValue({});

		const messageTypes = ['info', 'warning', 'error', 'success'];

		messageTypes.forEach(type => {
			showTipMsgFn(`${type} message`, type);
		});

		expect(mockApollo.mutate).toHaveBeenCalledTimes(4);
	});

	it('should handle persist parameter variations', () => {
		mockApollo.mutate.mockResolvedValue({});

		showTipMsgFn('Message 1', 'info', true);
		showTipMsgFn('Message 2', 'info', false);

		expect(mockApollo.mutate).toHaveBeenCalledTimes(2);
		expect(mockApollo.mutate.mock.calls[0][0].variables.persist).toBe(true);
		expect(mockApollo.mutate.mock.calls[1][0].variables.persist).toBe(false);
	});
});
