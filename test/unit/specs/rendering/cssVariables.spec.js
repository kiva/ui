import renderCssVariables from '../../../../src/rendering/cssVariables';

describe('renderCssVariables', () => {
	it('renders a style tag with CSS variables and no prefix', () => {
		const cssVars = { color: 'red', size: '10px' };
		const result = renderCssVariables(cssVars);
		expect(result).toBe('<style>:root{--color:red;--size:10px;}</style>');
	});

	it('renders a style tag with CSS variables and a prefix', () => {
		const cssVars = { color: 'blue', margin: '5px' };
		const result = renderCssVariables(cssVars, 'kv');
		expect(result).toBe('<style>:root{--kv-color:blue;--kv-margin:5px;}</style>');
	});

	it('returns an empty string if cssVariables is empty', () => {
		expect(renderCssVariables({})).toBe('');
		expect(renderCssVariables(undefined)).toBe('');
		expect(renderCssVariables(null)).toBe('');
	});
});
