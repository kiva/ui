import { metaGlobReader } from '../../../../src/util/importHelpers';

describe('importHelpers', () => {
	describe('metaGlobReader', () => {
		it('should return a module from glob matching the path', () => {
			const glob = {
				'/root/path/module1.js': { default: 'module1' },
				'/root/path/module2.js': { value: 'module2' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('module1.js');
			expect(result).toBe('module1');
		});

		it('should return the module itself if no default export', () => {
			const glob = {
				'/root/path/module.js': { value: 'module' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('module.js');
			expect(result).toEqual({ value: 'module' });
		});

		it('should return undefined if module not found', () => {
			const glob = {
				'/root/path/module1.js': { default: 'module1' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('nonexistent.js');
			expect(result).toBeUndefined();
		});

		it('should handle null or undefined glob', () => {
			const reader = metaGlobReader(null, '/root/path/');

			const result = reader('module.js');
			expect(result).toBeUndefined();
		});

		it('should handle empty glob', () => {
			const glob = {};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('module.js');
			expect(result).toBeUndefined();
		});

		it('should handle different root paths', () => {
			const glob = {
				'/src/components/Button.vue': { default: 'ButtonComponent' }
			};
			const reader = metaGlobReader(glob, '/src/components/');

			const result = reader('Button.vue');
			expect(result).toBe('ButtonComponent');
		});

		it('should handle nested paths', () => {
			const glob = {
				'/root/path/nested/deep/module.js': { default: 'nestedModule' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('nested/deep/module.js');
			expect(result).toBe('nestedModule');
		});

		it('should handle module with null default', () => {
			const glob = {
				'/root/path/module.js': { default: null, value: 'fallback' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('module.js');
			expect(result).toEqual({ default: null, value: 'fallback' });
		});

		it('should handle module with undefined default', () => {
			const glob = {
				'/root/path/module.js': { default: undefined, value: 'fallback' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('module.js');
			expect(result).toEqual({ default: undefined, value: 'fallback' });
		});

		it('should handle empty string path', () => {
			const glob = {
				'/root/path/': { default: 'rootModule' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('');
			expect(result).toBe('rootModule');
		});

		it('should return function when reader is called multiple times', () => {
			const glob = {
				'/root/path/module1.js': { default: 'module1' },
				'/root/path/module2.js': { default: 'module2' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result1 = reader('module1.js');
			const result2 = reader('module2.js');

			expect(result1).toBe('module1');
			expect(result2).toBe('module2');
		});

		it('should handle modules with special characters in path', () => {
			const glob = {
				'/root/path/@special-module.js': { default: 'specialModule' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('@special-module.js');
			expect(result).toBe('specialModule');
		});

		it('should handle path without leading slash', () => {
			const glob = {
				'/root/path/module.js': { default: 'module' }
			};
			const reader = metaGlobReader(glob, '/root/path/');

			const result = reader('module.js');
			expect(result).toBe('module');
		});
	});
});
