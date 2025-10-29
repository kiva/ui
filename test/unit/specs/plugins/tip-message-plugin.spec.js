import tipMessagePlugin from '../../../../src/plugins/tip-message-plugin';

vi.mock('#src/util/injectionCheck', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/mutation/tipMessage/closeTipMessage.graphql', () => ({
	default: 'closeTipMessageMutation'
}));

vi.mock('#src/graphql/mutation/tipMessage/showTipMessage.graphql', () => ({
	default: 'showTipMessageMutation'
}));

describe('tip-message-plugin.js', () => {
	let mockApp;
	let mockContext;
	let mockApollo;
	let mixinMethods;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn()
		};

		mockContext = {
			apollo: mockApollo
		};

		mixinMethods = null;

		mockApp = {
			mixin: vi.fn(config => {
				mixinMethods = config.methods;
			})
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('plugin installation', () => {
		it('should install mixin on app', () => {
			tipMessagePlugin(mockApp);

			expect(mockApp.mixin).toHaveBeenCalledWith({
				methods: expect.any(Object)
			});
		});

		it('should expose $showTipMsg method', () => {
			tipMessagePlugin(mockApp);

			expect(mixinMethods).toHaveProperty('$showTipMsg');
			expect(typeof mixinMethods.$showTipMsg).toBe('function');
		});

		it('should expose $closeTipMsg method', () => {
			tipMessagePlugin(mockApp);

			expect(mixinMethods).toHaveProperty('$closeTipMsg');
			expect(typeof mixinMethods.$closeTipMsg).toBe('function');
		});
	});

	describe('$showTipMsg', () => {
		beforeEach(() => {
			tipMessagePlugin(mockApp);
		});

		it('should call Apollo mutate with message', () => {
			mixinMethods.$showTipMsg.call(mockContext, 'Test message');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'showTipMessageMutation',
				variables: {
					message: 'Test message',
					type: '',
					persist: false
				}
			});
		});

		it('should call Apollo mutate with message and type', () => {
			mixinMethods.$showTipMsg.call(mockContext, 'Error message', 'error');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'showTipMessageMutation',
				variables: {
					message: 'Error message',
					type: 'error',
					persist: false
				}
			});
		});

		it('should call Apollo mutate with persist option', () => {
			mixinMethods.$showTipMsg.call(mockContext, 'Persistent message', 'info', true);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'showTipMessageMutation',
				variables: {
					message: 'Persistent message',
					type: 'info',
					persist: true
				}
			});
		});

		it('should handle null type with persist', () => {
			mixinMethods.$showTipMsg.call(mockContext, 'Message', null, true);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'showTipMessageMutation',
				variables: {
					message: 'Message',
					type: null,
					persist: true
				}
			});
		});

		it('should default to empty type and non-persistent', () => {
			mixinMethods.$showTipMsg.call(mockContext, 'Simple message');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'showTipMessageMutation',
				variables: {
					message: 'Simple message',
					type: '',
					persist: false
				}
			});
		});
	});

	describe('$closeTipMsg', () => {
		beforeEach(() => {
			tipMessagePlugin(mockApp);
		});

		it('should call Apollo mutate to close tip message', () => {
			mixinMethods.$closeTipMsg.call(mockContext);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'closeTipMessageMutation'
			});
		});

		it('should call Apollo mutate without variables', () => {
			mixinMethods.$closeTipMsg.call(mockContext);

			const callArgs = mockApollo.mutate.mock.calls[0][0];
			expect(callArgs).not.toHaveProperty('variables');
		});
	});
});
