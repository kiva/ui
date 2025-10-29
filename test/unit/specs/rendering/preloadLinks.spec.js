import { renderPreloadLink, renderPreloadLinks } from '../../../../src/rendering/preloadLinks';

describe('renderPreloadLink', () => {
	it('renders modulepreload link for .js files', () => {
		const file = '/assets/app.js';
		const result = renderPreloadLink(file);
		expect(result).toBe('<link rel="modulepreload" crossorigin href="/assets/app.js">');
	});

	it('renders stylesheet link for .css files', () => {
		const file = '/assets/styles.css';
		const result = renderPreloadLink(file);
		expect(result).toBe('<link rel="stylesheet" href="/assets/styles.css">');
	});

	it('returns empty string for unknown file types', () => {
		const file = '/assets/image.png';
		const result = renderPreloadLink(file);
		expect(result).toBe('');
	});
});

describe('renderPreloadLinks', () => {
	it('renders links for all files in manifest for given modules', () => {
		const modules = ['mod1', 'mod2'];
		const manifest = {
			mod1: ['/assets/a.js', '/assets/a.css'],
			mod2: ['/assets/b.js']
		};
		const result = renderPreloadLinks(modules, manifest);
		expect(result).toContain('<link rel="modulepreload" crossorigin href="/assets/a.js">');
		expect(result).toContain('<link rel="stylesheet" href="/assets/a.css">');
		expect(result).toContain('<link rel="modulepreload" crossorigin href="/assets/b.js">');
	});

	it('does not duplicate links for the same file', () => {
		const modules = ['mod1', 'mod2'];
		const manifest = {
			mod1: ['/assets/shared.js'],
			mod2: ['/assets/shared.js']
		};
		const result = renderPreloadLinks(modules, manifest);
		const count = (result.match(/shared\.js/g) || []).length;
		expect(count).toBe(1);
	});

	it('returns empty string if no files are found', () => {
		const modules = ['mod1'];
		const manifest = { mod1: [] };
		const result = renderPreloadLinks(modules, manifest);
		expect(result).toBe('');
	});

	it('returns empty string if manifest is empty', () => {
		const modules = ['mod1'];
		const manifest = {};
		const result = renderPreloadLinks(modules, manifest);
		expect(result).toBe('');
	});

	it('returns empty string if manifest is missing', () => {
		const modules = ['mod1'];
		const result = renderPreloadLinks(modules);
		expect(result).toBe('');
	});

	it('returns empty string if modules is empty', () => {
		const modules = [];
		const manifest = { mod1: ['/assets/a.js'] };
		const result = renderPreloadLinks(modules, manifest);
		expect(result).toBe('');
	});
});
