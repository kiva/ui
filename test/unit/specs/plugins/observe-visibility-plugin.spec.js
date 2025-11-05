import observeVisibilityPlugin from '#src/plugins/observe-visibility-plugin';

vi.mock('vue-observe-visibility', () => ({
	default: {
		install: vi.fn(),
	},
}));

describe('observe-visibility-plugin.js', () => {
	let mockApp;
	let VueObserveVisibility;

	beforeEach(async () => {
		vi.clearAllMocks();
		mockApp = {
			use: vi.fn(),
		};
		VueObserveVisibility = (await import('vue-observe-visibility')).default;
	});

	it('should call app.use with VueObserveVisibility', () => {
		observeVisibilityPlugin(mockApp);

		expect(mockApp.use).toHaveBeenCalledWith(VueObserveVisibility);
		expect(mockApp.use).toHaveBeenCalledTimes(1);
	});

	it('should be a function', () => {
		expect(typeof observeVisibilityPlugin).toBe('function');
	});
});
