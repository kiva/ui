// @vitest-environment node
import path from 'path';
import { expandManifest, importedCss } from '../../../../build/ssr-manifest-css-plugin';

const root = '/repo';
const options = { base: '/', root };

const chunk = (fileName, {
	modules = [], css = [], imports = [], isEntry = false
} = {}) => ({
	type: 'chunk',
	fileName,
	imports,
	isEntry,
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
	it('collects stylesheets across a chain of static imports, dependencies first', () => {
		const chunks = {
			'a.js': { css: ['a.css'], imports: ['b.js'] },
			'b.js': { css: ['b.css'], imports: ['c.js'] },
			'c.js': { css: ['c.css'], imports: [] },
		};
		expect(importedCss('a.js', chunks)).toEqual(['c.css', 'b.css']);
	});

	it('excludes the stylesheets of the chunk itself', () => {
		const chunks = { 'a.js': { css: ['a.css'], imports: [] } };
		expect(importedCss('a.js', chunks)).toEqual([]);
	});

	it('excludes the stylesheets of an entry chunk it reaches', () => {
		const chunks = {
			'a.js': { css: ['a.css'], imports: ['entry.js'] },
			'entry.js': { css: ['index.css'], imports: [], isEntry: true },
		};
		expect(importedCss('a.js', chunks)).toEqual([]);
	});

	it('still walks past an entry chunk to reach further stylesheets', () => {
		const chunks = {
			'a.js': { css: ['a.css'], imports: ['entry.js'] },
			'entry.js': { css: ['index.css'], imports: ['b.js'], isEntry: true },
			'b.js': { css: ['b.css'], imports: [] },
		};
		expect(importedCss('a.js', chunks)).toEqual(['b.css']);
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
	it('adds the stylesheets a module reaches by static import, before its own', () => {
		const manifest = {
			'src/components/WwwFrame/TheHeader.vue': ['/static/frame.js', '/static/frame.css'],
		};
		const expanded = expandManifest(manifest, headerBundle(), options);
		expect(expanded['src/components/WwwFrame/TheHeader.vue']).toEqual([
			'/static/shared.css',
			'/static/frame.js',
			'/static/frame.css',
		]);
	});

	it('excludes the stylesheet of an entry chunk reached by static import', () => {
		const manifest = {
			'src/components/WwwFrame/TheHeader.vue': ['/static/frame.js', '/static/frame.css'],
		};
		const bundle = {
			'static/frame.js': chunk('static/frame.js', {
				modules: ['src/components/WwwFrame/TheHeader.vue'],
				css: ['static/frame.css'],
				imports: ['index.js'],
			}),
			'index.js': chunk('index.js', { css: ['index.css'], isEntry: true }),
		};
		const expanded = expandManifest(manifest, bundle, options);
		expect(expanded['src/components/WwwFrame/TheHeader.vue']).toEqual(['/static/frame.js', '/static/frame.css']);
	});

	it('collapses a Vue SFC style variant key onto its base id', () => {
		const manifest = {
			'src/components/WwwFrame/TheHeader.vue': ['/static/frame.js', '/static/frame.css'],
			'src/components/WwwFrame/TheHeader.vue?vue&type=style&index=0&lang.css': [
				'/static/frame.js',
				'/static/frame.css',
			],
		};
		const expanded = expandManifest(manifest, headerBundle(), options);
		expect(expanded).toEqual({
			'src/components/WwwFrame/TheHeader.vue': ['/static/shared.css', '/static/frame.js', '/static/frame.css'],
		});
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
