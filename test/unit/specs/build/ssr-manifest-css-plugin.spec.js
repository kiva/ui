// @vitest-environment node
import path from 'path';
import { expandManifest, importedCss } from '../../../../build/ssr-manifest-css-plugin';

const root = '/repo';
const options = { base: '/', root };

const chunk = (fileName, { modules = [], css = [], imports = [] } = {}) => ({
	type: 'chunk',
	fileName,
	imports,
	viteMetadata: { importedCss: new Set(css) },
	modules: Object.fromEntries(modules.map(id => [path.join(root, id), {}])),
});

// The global header: a component in one chunk whose styles rollup hoisted into a
// shared chunk reached by static import
const headerBundle = () => ({
	'static/frame.js': chunk('static/frame.js', {
		modules: ['src/components/WwwFrame/TheHeader.vue'],
		css: ['static/frame.css'],
		imports: ['static/shared.js'],
	}),
	'static/shared.js': chunk('static/shared.js', { css: ['static/shared.css'] }),
});

describe('importedCss', () => {
	it('collects stylesheets across a chain of static imports', () => {
		const chunks = {
			'a.js': { css: ['a.css'], imports: ['b.js'] },
			'b.js': { css: ['b.css'], imports: ['c.js'] },
			'c.js': { css: ['c.css'], imports: [] },
		};
		expect(importedCss('a.js', chunks)).toEqual(['b.css', 'c.css']);
	});

	it('excludes the stylesheets of the chunk itself', () => {
		const chunks = { 'a.js': { css: ['a.css'], imports: [] } };
		expect(importedCss('a.js', chunks)).toEqual([]);
	});

	it('terminates on a cycle', () => {
		const chunks = {
			'a.js': { css: ['a.css'], imports: ['b.js'] },
			'b.js': { css: ['b.css'], imports: ['a.js'] },
		};
		expect(importedCss('a.js', chunks)).toEqual(['b.css']);
	});

	it('ignores imports that are not chunks', () => {
		const chunks = { 'a.js': { css: [], imports: ['missing.js'] } };
		expect(importedCss('a.js', chunks)).toEqual([]);
	});
});

describe('expandManifest', () => {
	it('adds the stylesheets a module reaches by static import', () => {
		const manifest = {
			'src/components/WwwFrame/TheHeader.vue': ['/static/frame.js', '/static/frame.css'],
		};
		const expanded = expandManifest(manifest, headerBundle(), options);
		expect(expanded['src/components/WwwFrame/TheHeader.vue']).toEqual([
			'/static/frame.js',
			'/static/frame.css',
			'/static/shared.css',
		]);
	});

	it('leaves entries whose chunk reaches no further stylesheets alone', () => {
		const manifest = { 'src/pages/Leaf.vue': ['/static/leaf.js'] };
		const bundle = {
			'static/leaf.js': chunk('static/leaf.js', { modules: ['src/pages/Leaf.vue'] }),
		};
		expect(expandManifest(manifest, bundle, options)['src/pages/Leaf.vue']).toEqual(['/static/leaf.js']);
	});

	it('does not duplicate a stylesheet Vite already recorded', () => {
		const manifest = {
			'src/components/WwwFrame/TheHeader.vue': ['/static/frame.js', '/static/shared.css'],
		};
		const expanded = expandManifest(manifest, headerBundle(), options);
		expect(expanded['src/components/WwwFrame/TheHeader.vue']).toEqual(['/static/frame.js', '/static/shared.css']);
	});

	it('does not invent entries for modules the manifest omits', () => {
		const expanded = expandManifest({}, headerBundle(), options);
		expect(expanded).toEqual({});
	});

	it('applies the configured base to the stylesheets it adds', () => {
		const manifest = { 'src/components/WwwFrame/TheHeader.vue': ['/assets/frame.js'] };
		const expanded = expandManifest(manifest, headerBundle(), { base: '/assets/', root });
		expect(expanded['src/components/WwwFrame/TheHeader.vue']).toContain('/assets/static/shared.css');
	});
});
