import checkInjections from '#src/util/injectionCheck';

describe('injectionCheck', () => {
	it('throws an error if vm instance does not inject required injections', () => {
		const vm = {
			$options: {
				inject: {
					foo: {}
				}
			},
		};
		expect(() => checkInjections(vm, ['apollo'])).toThrow('Missing required injections');
	});

	it('throws an error if vm instance does not inject all required injections', () => {
		const vm = {
			$options: {
				inject: {
					foo: {},
					apollo: {},
				}
			},
		};
		expect(() => checkInjections(vm, ['apollo', 'cookieStore'])).toThrow('Missing required injections');
	});

	it('does nothing when no injections are required', () => {
		expect(() => checkInjections()).not.toThrow();
	});

	it('does nothing when correct injections are included', () => {
		const vm = {
			$options: {
				inject: {
					apollo: {},
					cookieStore: {},
				}
			},
		};
		expect(() => checkInjections(vm, ['apollo', 'cookieStore'])).not.toThrow();
	});

	it('handles vm with undefined $options', () => {
		const vm = {};
		expect(() => checkInjections(vm, ['apollo'])).toThrow('Missing required injections');
	});

	it('handles vm with null inject property', () => {
		const vm = {
			$options: {
				inject: null
			}
		};
		expect(() => checkInjections(vm, ['apollo'])).toThrow('Missing required injections');
	});

	it('handles empty injections array', () => {
		const vm = {
			$options: {
				inject: {
					apollo: {}
				}
			}
		};
		expect(() => checkInjections(vm, [])).not.toThrow();
	});

	it('handles single injection check', () => {
		const vm = {
			$options: {
				inject: {
					apollo: {}
				}
			}
		};
		expect(() => checkInjections(vm, ['apollo'])).not.toThrow();
	});

	it('error message includes all missing injection names', () => {
		const vm = {
			$options: {
				inject: {}
			}
		};
		expect(() => checkInjections(vm, ['apollo', 'cookieStore', 'kvAuth0']))
			.toThrow("inject: ['apollo', 'cookieStore', 'kvAuth0']");
	});
});
