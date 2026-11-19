import { parseLazy, observeLazyOperation } from '#src/util/lazyApolloOperation';
import mockIntersectionObserver from '../../helpers/mockIntersectionObserver';

describe('lazyApolloOperation', () => {
	describe('parseLazy', () => {
		it('returns null when lazy is not set', () => {
			expect(parseLazy(undefined)).toBeNull();
			expect(parseLazy(false)).toBeNull();
		});

		it('defaults to a 500px margin', () => {
			expect(parseLazy(true)).toEqual({ rootMargin: '500px' });
			expect(parseLazy({})).toEqual({ rootMargin: '500px' });
		});

		it('lets options override the margin and keeps the target', () => {
			expect(parseLazy({ rootMargin: '100px', threshold: 0.5, target: 'lazyRoot' }))
				.toEqual({ rootMargin: '100px', threshold: 0.5, target: 'lazyRoot' });
		});
	});

	describe('observeLazyOperation', () => {
		let mock;
		let start;

		beforeEach(() => {
			start = vi.fn();
		});

		afterEach(() => {
			mock?.restore();
			mock = undefined;
			vi.restoreAllMocks();
		});

		function observe(instance, lazy = true) {
			return observeLazyOperation({
				instance,
				lazyConfig: parseLazy(lazy),
				start,
				label: 'useApolloQuery HostComponent',
			});
		}

		it('observes the root element with the observer options, without the target key', () => {
			mock = mockIntersectionObserver();
			const root = document.createElement('div');

			const observer = observe({ $el: root, $refs: {} }, { threshold: 0.5 });

			expect(observer).toBe(mock.instances[0]);
			expect(mock.instances[0].observe).toHaveBeenCalledWith(root);
			expect(mock.instances[0].options).toEqual({ rootMargin: '500px', threshold: 0.5 });
			expect(mock.instances[0].options).not.toHaveProperty('target');
			expect(start).not.toHaveBeenCalled();
		});

		it('starts and disconnects on the first intersecting report', () => {
			mock = mockIntersectionObserver();
			observe({ $el: document.createElement('div'), $refs: {} });

			mock.trigger(1);

			expect(start).toHaveBeenCalledTimes(1);
			expect(mock.instances[0].disconnect).toHaveBeenCalled();
		});

		it('ignores reports that are not intersecting', () => {
			mock = mockIntersectionObserver();
			observe({ $el: document.createElement('div'), $refs: {} });

			mock.trigger(0);

			expect(start).not.toHaveBeenCalled();
			expect(mock.instances[0].disconnect).not.toHaveBeenCalled();
		});

		it('starts once when the observer reports intersecting twice', () => {
			mock = mockIntersectionObserver();
			observe({ $el: document.createElement('div'), $refs: {} });

			mock.trigger(1);
			mock.trigger(1);

			expect(start).toHaveBeenCalledTimes(1);
		});

		it('observes the element ref named by target', () => {
			mock = mockIntersectionObserver();
			const section = document.createElement('section');

			observe({ $el: document.createElement('div'), $refs: { lazyRoot: section } }, { target: 'lazyRoot' });

			expect(mock.instances[0].observe).toHaveBeenCalledWith(section);
		});

		it('observes the root element of a child component ref named by target', () => {
			mock = mockIntersectionObserver();
			const article = document.createElement('article');

			observe(
				{ $el: document.createElement('div'), $refs: { lazyRoot: { $el: article } } },
				{ target: 'lazyRoot' },
			);

			expect(mock.instances[0].observe).toHaveBeenCalledWith(article);
		});

		it('walks past a comment root to the next element sibling', () => {
			mock = mockIntersectionObserver();
			const parent = document.createElement('div');
			const comment = document.createComment('v-if');
			const span = document.createElement('span');
			parent.append(comment, span);

			observe({ $el: comment, $refs: {} });

			expect(mock.instances[0].observe).toHaveBeenCalledWith(span);
		});

		it('warns and starts immediately when the target ref is missing', () => {
			mock = mockIntersectionObserver();
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const observer = observe({ $el: document.createElement('div'), $refs: {} }, { target: 'lazyRoot' });

			expect(warn).toHaveBeenCalledWith(
				expect.stringContaining('[useApolloQuery HostComponent] No Element found'),
			);
			expect(start).toHaveBeenCalledTimes(1);
			expect(observer).toBeNull();
			expect(mock.instances).toHaveLength(0);
		});

		it('starts immediately and returns null without IntersectionObserver', () => {
			mock = mockIntersectionObserver({ supported: false });

			const observer = observe({ $el: document.createElement('div'), $refs: {} });

			expect(start).toHaveBeenCalledTimes(1);
			expect(observer).toBeNull();
		});
	});
});
