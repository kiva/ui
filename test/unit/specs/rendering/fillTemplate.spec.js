/* eslint-disable no-template-curly-in-string */
import fillTemplate from '../../../../src/rendering/fillTemplate';

describe('fillTemplate', () => {
	it('replaces a single variable in the template', () => {
		const template = '<div>${name}</div>';
		const data = { name: 'Kiva' };
		const result = fillTemplate(template, data);
		expect(result).toBe('<div>Kiva</div>');
	});

	it('replaces multiple variables in the template', () => {
		const template = '<div>${greeting}, ${name}!</div>';
		const data = { greeting: 'Hello', name: 'World' };
		const result = fillTemplate(template, data);
		expect(result).toBe('<div>Hello, World!</div>');
	});

	it('returns the original template if no variables match', () => {
		const template = '<div>${foo}</div>';
		const data = { bar: 'baz' };
		const result = fillTemplate(template, data);
		expect(result).toBe('<div>${foo}</div>');
	});

	it('handles empty data object', () => {
		const template = '<div>${foo}</div>';
		const data = {};
		const result = fillTemplate(template, data);
		expect(result).toBe('<div>${foo}</div>');
	});

	it('handles empty template', () => {
		const template = '';
		const data = { foo: 'bar' };
		const result = fillTemplate(template, data);
		expect(result).toBe('');
	});

	it('replaces variable with falsy values', () => {
		const template = '<div>${zero} ${empty} ${bool}</div>';
		const data = { zero: 0, empty: '', bool: false };
		const result = fillTemplate(template, data);
		expect(result).toBe('<div>0  false</div>');
	});
});
