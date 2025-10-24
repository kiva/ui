import changeCaseFilter from '#src/plugins/change-case-filter';

describe('change-case-filter.js', () => {
	it('should use noCase as default when no type provided', () => {
		const result = changeCaseFilter('hello world', 'noCase');

		expect(result).toBe('hello world');
	});

	it('should convert to camelCase', () => {
		const result = changeCaseFilter('hello world', 'camelCase');

		expect(result).toBe('helloWorld');
	});

	it('should convert to pascalCase', () => {
		const result = changeCaseFilter('hello world', 'pascalCase');

		expect(result).toBe('HelloWorld');
	});

	it('should convert to snakeCase', () => {
		const result = changeCaseFilter('hello world', 'snakeCase');

		expect(result).toBe('hello_world');
	});

	it('should convert to kebabCase', () => {
		const result = changeCaseFilter('hello world', 'kebabCase');

		expect(result).toBe('hello-world');
	});

	it('should convert to dotCase', () => {
		const result = changeCaseFilter('hello world', 'dotCase');

		expect(result).toBe('hello.world');
	});

	it('should convert to constantCase', () => {
		const result = changeCaseFilter('hello world', 'constantCase');

		expect(result).toBe('HELLO_WORLD');
	});

	it('should convert to titleCase', () => {
		const result = changeCaseFilter('hello world', 'titleCase');

		expect(result).toBe('Hello World');
	});

	it('should convert to sentenceCase', () => {
		const result = changeCaseFilter('hello world', 'sentenceCase');

		expect(result).toBe('Hello world');
	});

	it('should handle empty strings', () => {
		const result = changeCaseFilter('', 'camelCase');

		expect(result).toBe('');
	});

	it('should handle strings with special characters', () => {
		const result = changeCaseFilter('hello-world_test', 'camelCase');

		expect(result).toBe('helloWorldTest');
	});

	it('should handle strings with numbers in camelCase', () => {
		const result = changeCaseFilter('hello world 123', 'camelCase');

		// Numbers are preserved in the conversion
		expect(result).toContain('hello');
		expect(result).toContain('World');
	});
});
