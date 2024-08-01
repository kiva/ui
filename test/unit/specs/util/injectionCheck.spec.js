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
});
