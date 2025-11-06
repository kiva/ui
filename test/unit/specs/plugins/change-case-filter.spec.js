import changeCaseFilter from '#src/plugins/change-case-filter';

vi.mock('change-case', () => ({
	camelCase: vi.fn(),
	no: vi.fn(),
}));

vi.mock('title-case', () => ({
	titleCase: vi.fn(),
}));

describe('change-case-filter.js', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should call the specified case method with the value', async () => {
		const { camelCase } = await import('change-case');
		camelCase.mockReturnValue('camelCaseResult');

		const result = changeCaseFilter('hello world', 'camelCase');

		expect(camelCase).toHaveBeenCalledWith('hello world');
		expect(result).toBe('camelCaseResult');
	});

	it('should use "no" as default type when no type provided', async () => {
		const { no } = await import('change-case');
		no.mockReturnValue('noResult');

		const result = changeCaseFilter('hello world');

		expect(no).toHaveBeenCalledWith('hello world');
		expect(result).toBe('noResult');
	});

	it('should call titleCase from title-case library', async () => {
		const { titleCase } = await import('title-case');
		titleCase.mockReturnValue('Title Case Result');

		const result = changeCaseFilter('hello world', 'titleCase');

		expect(titleCase).toHaveBeenCalledWith('hello world');
		expect(result).toBe('Title Case Result');
	});
});
