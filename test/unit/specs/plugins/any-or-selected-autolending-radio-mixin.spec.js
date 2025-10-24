import radioMixin from '#src/plugins/any-or-selected-autolending-radio-mixin';

describe('any-or-selected-autolending-radio-mixin.js', () => {
	let context;
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn().mockResolvedValue({})
		};

		context = {
			apollo: mockApollo,
			radioKey: 'testFilter',
			$emit: vi.fn()
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('props', () => {
		it('should define selectorShown prop with default false', () => {
			expect(radioMixin.props.selectorShown).toBeDefined();
			expect(radioMixin.props.selectorShown.type).toBe(Boolean);
			expect(radioMixin.props.selectorShown.default).toBe(false);
		});
	});

	describe('data', () => {
		it('should initialize with radio set to all and empty currentFilterValues', () => {
			const data = radioMixin.data();
			expect(data.radio).toBe('all');
			expect(data.currentFilterValues).toEqual([]);
		});
	});

	describe('saveAny', () => {
		it('should call Apollo mutate with correct variables', () => {
			radioMixin.methods.saveAny.call(context);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					filters: {
						testFilter: null
					}
				}
			});
		});

		it('should use radioKey from context', () => {
			context.radioKey = 'myCustomKey';
			radioMixin.methods.saveAny.call(context);

			expect(mockApollo.mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: {
						filters: {
							myCustomKey: null
						}
					}
				})
			);
		});
	});

	describe('emitChangeEvent', () => {
		it('should emit update event with radioKey and value', () => {
			const testValue = ['value1', 'value2'];
			radioMixin.methods.emitChangeEvent.call(context, testValue);

			expect(context.$emit).toHaveBeenCalledWith('update', {
				radioKey: 'testFilter',
				value: testValue
			});
		});

		it('should emit with null value', () => {
			radioMixin.methods.emitChangeEvent.call(context, null);

			expect(context.$emit).toHaveBeenCalledWith('update', {
				radioKey: 'testFilter',
				value: null
			});
		});

		it('should emit with string value', () => {
			radioMixin.methods.emitChangeEvent.call(context, 'single-value');

			expect(context.$emit).toHaveBeenCalledWith('update', {
				radioKey: 'testFilter',
				value: 'single-value'
			});
		});
	});

	describe('selectedFiltersFormattedString', () => {
		it('should format array of selected filters into comma-separated string', () => {
			const filters = [
				{ name: 'Filter 1' },
				{ name: 'Filter 2' },
				{ name: 'Filter 3' }
			];
			const result = radioMixin.methods.selectedFiltersFormattedString.call(context, filters);

			expect(result).toBe('Filter 1, Filter 2, Filter 3');
		});

		it('should limit display to 10 items and show remaining count', () => {
			const filters = Array.from({ length: 15 }, (_, i) => ({ name: `Filter ${i + 1}` }));
			const result = radioMixin.methods.selectedFiltersFormattedString.call(context, filters);

			// Should show first 10 items
			expect(result).toContain('Filter 1');
			expect(result).toContain('Filter 10');
			// Should show +5 more
			expect(result).toContain('+5 more');
			// Should not show item 11
			expect(result).not.toContain('Filter 11');
		});

		it('should not show "more" text when exactly 10 items', () => {
			const filters = Array.from({ length: 10 }, (_, i) => ({ name: `Filter ${i + 1}` }));
			const result = radioMixin.methods.selectedFiltersFormattedString.call(context, filters);

			expect(result).not.toContain('more');
			expect(result).toContain('Filter 10');
		});

		it('should handle single filter', () => {
			const filters = [{ name: 'Single Filter' }];
			const result = radioMixin.methods.selectedFiltersFormattedString.call(context, filters);

			expect(result).toBe('Single Filter');
		});

		it('should handle empty array', () => {
			const result = radioMixin.methods.selectedFiltersFormattedString.call(context, []);

			expect(result).toBe('');
		});
	});

	describe('watch selectorShown', () => {
		it('should set radio to all when selectorShown becomes false with no filters', () => {
			const watchContext = {
				radio: 'selected',
				currentFilterValues: []
			};

			// Call the watcher
			radioMixin.watch.selectorShown.call(watchContext, false);

			expect(watchContext.radio).toBe('all');
		});

		it('should not change radio when selectorShown becomes false with filters present', () => {
			const watchContext = {
				radio: 'selected',
				currentFilterValues: ['filter1', 'filter2']
			};

			radioMixin.watch.selectorShown.call(watchContext, false);

			// Should remain 'selected' because filters exist
			expect(watchContext.radio).toBe('selected');
		});

		it('should not change radio when selectorShown becomes true', () => {
			const watchContext = {
				radio: 'selected',
				currentFilterValues: []
			};

			radioMixin.watch.selectorShown.call(watchContext, true);

			// Should remain 'selected'
			expect(watchContext.radio).toBe('selected');
		});
	});
});
