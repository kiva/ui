import countriesNotLentToExpMixin, { COUNTRIES_NOT_LENT_TO_EXP } from '#src/plugins/countries-not-lent-to-exp-mixin';

vi.mock('#src/graphql/fragments/experimentVersion.graphql', () => ({
	default: 'experimentVersionFragment'
}));

describe('countries-not-lent-to-exp-mixin.js', () => {
	let context;
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			readFragment: vi.fn()
		};

		context = {
			apollo: mockApollo,
			cookieStore: {},
			isCountriesNotLentToExp: false
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('exports', () => {
		it('should export COUNTRIES_NOT_LENT_TO_EXP constant', () => {
			expect(COUNTRIES_NOT_LENT_TO_EXP).toBe('combo_page_countries_not_lent_to');
		});
	});

	describe('inject', () => {
		it('should inject apollo', () => {
			expect(countriesNotLentToExpMixin.inject).toContain('apollo');
		});

		it('should inject cookieStore', () => {
			expect(countriesNotLentToExpMixin.inject).toContain('cookieStore');
		});
	});

	describe('data', () => {
		it('should initialize isCountriesNotLentToExp to false', () => {
			const data = countriesNotLentToExpMixin.data();
			expect(data.isCountriesNotLentToExp).toBe(false);
		});
	});

	describe('computed', () => {
		describe('countriesNotLentToUrl', () => {
			it('should return experiment URL when in experiment', () => {
				context.isCountriesNotLentToExp = true;

				const result = countriesNotLentToExpMixin.computed.countriesNotLentToUrl.call(context);

				expect(result).toBe('/lend/filter?countries-not-lent-to=true');
			});

			it('should return default URL when not in experiment', () => {
				context.isCountriesNotLentToExp = false;

				const result = countriesNotLentToExpMixin.computed.countriesNotLentToUrl.call(context);

				expect(result).toBe('/lend/countries-not-lent');
			});
		});
	});

	describe('mounted', () => {
		it('should set isCountriesNotLentToExp to true when version is b', () => {
			mockApollo.readFragment.mockReturnValue({ version: 'b' });

			countriesNotLentToExpMixin.mounted.call(context);

			expect(mockApollo.readFragment).toHaveBeenCalledWith({
				id: 'Experiment:combo_page_countries_not_lent_to',
				fragment: 'experimentVersionFragment'
			});
			expect(context.isCountriesNotLentToExp).toBe(true);
		});

		it('should set isCountriesNotLentToExp to false when version is a', () => {
			mockApollo.readFragment.mockReturnValue({ version: 'a' });

			countriesNotLentToExpMixin.mounted.call(context);

			expect(context.isCountriesNotLentToExp).toBe(false);
		});

		it('should set isCountriesNotLentToExp to false when version is control', () => {
			mockApollo.readFragment.mockReturnValue({ version: 'control' });

			countriesNotLentToExpMixin.mounted.call(context);

			expect(context.isCountriesNotLentToExp).toBe(false);
		});

		it('should set isCountriesNotLentToExp to false when readFragment returns null', () => {
			mockApollo.readFragment.mockReturnValue(null);

			countriesNotLentToExpMixin.mounted.call(context);

			expect(context.isCountriesNotLentToExp).toBe(false);
		});

		it('should set isCountriesNotLentToExp to false when readFragment returns undefined', () => {
			mockApollo.readFragment.mockReturnValue(undefined);

			countriesNotLentToExpMixin.mounted.call(context);

			expect(context.isCountriesNotLentToExp).toBe(false);
		});

		it('should handle missing version property', () => {
			mockApollo.readFragment.mockReturnValue({});

			countriesNotLentToExpMixin.mounted.call(context);

			expect(context.isCountriesNotLentToExp).toBe(false);
		});
	});
});
