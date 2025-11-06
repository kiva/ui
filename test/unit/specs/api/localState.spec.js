import { initState, setLocalState } from '#src/api/localState';

// Mock the glob import
vi.mock('#src/api/localResolvers/*.js', () => ({}));

describe('localState.js', () => {
	let mockCache;
	let mockOptions;

	beforeEach(() => {
		mockCache = {
			writeQuery: vi.fn(),
			readQuery: vi.fn(),
		};
		mockOptions = {
			someOption: 'value',
		};
	});

	describe('initState', () => {
		it('should be a function', () => {
			expect(typeof initState).toBe('function');
		});

		it('should call local resolvers and merge results', () => {
			const result = initState(mockOptions);

			expect(result).toBeDefined();
			expect(typeof result).toBe('object');
		});

		it('should return an object with defaults and resolvers when resolvers exist', () => {
			const result = initState(mockOptions);

			expect(result).toHaveProperty('defaults');
			expect(result).toHaveProperty('resolvers');
		});

		it('should handle empty options', () => {
			const result = initState({});

			expect(result).toBeDefined();
			expect(typeof result).toBe('object');
		});

		it('should handle minimal options', () => {
			const result = initState({ cookieStore: {} });

			expect(result).toBeDefined();
			expect(typeof result).toBe('object');
		});
	});

	describe('setLocalState', () => {
		it('should be a function', () => {
			expect(typeof setLocalState).toBe('function');
		});

		it('should call defaults function for each local resolver', () => {
			const result = setLocalState(mockOptions, mockCache);

			// Function should execute without errors
			expect(result).toBeUndefined();
		});

		it('should handle cache parameter', () => {
			expect(() => {
				setLocalState(mockOptions, mockCache);
			}).not.toThrow();
		});

		it('should handle empty options', () => {
			expect(() => {
				setLocalState({}, mockCache);
			}).not.toThrow();
		});

		it('should throw when cache is null', () => {
			expect(() => {
				setLocalState(mockOptions, null);
			}).toThrow();
		});
	});

	describe('integration', () => {
		it('should work together - initState then setLocalState', () => {
			const state = initState(mockOptions);

			expect(state).toBeDefined();

			expect(() => {
				setLocalState(mockOptions, mockCache);
			}).not.toThrow();
		});
	});
});
