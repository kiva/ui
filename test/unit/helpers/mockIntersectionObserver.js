const KEYS = ['IntersectionObserver', 'IntersectionObserverEntry'];

/**
 * Replaces the IntersectionObserver globals with a mock whose callbacks the test fires, or removes them.
 *
 * @param {object} [options]
 * @param {boolean} [options.supported=true] - false removes IntersectionObserver instead of mocking it
 * @returns {{ instances: object[], trigger: Function, restore: Function }}
 */
export default function mockIntersectionObserver({ supported = true } = {}) {
	const targets = [...new Set([globalThis, globalThis.window].filter(Boolean))];
	const saved = targets.map(target => KEYS.map(key => Object.getOwnPropertyDescriptor(target, key)));
	const instances = [];

	targets.forEach(target => KEYS.forEach(key => Reflect.deleteProperty(target, key)));

	if (supported) {
		const MockObserver = vi.fn((callback, options) => {
			const instance = {
				callback,
				options,
				observe: vi.fn(),
				disconnect: vi.fn(),
			};
			instances.push(instance);
			return instance;
		});
		targets.forEach(target => Object.assign(target, {
			IntersectionObserver: MockObserver,
			IntersectionObserverEntry: { prototype: { intersectionRatio: 0 } },
		}));
	}

	return {
		instances,
		trigger(intersectionRatio = 1) {
			instances.forEach(instance => {
				instance.callback([{ target: instance.observe.mock.calls[0]?.[0], intersectionRatio }]);
			});
		},
		restore() {
			targets.forEach((target, i) => KEYS.forEach((key, j) => {
				Reflect.deleteProperty(target, key);
				if (saved[i][j]) {
					Object.defineProperty(target, key, saved[i][j]);
				}
			}));
		},
	};
}
