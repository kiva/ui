import checkApolloInject from '@/util/apolloInjectCheck';

describe('apolloInjectCheck', () => {
	it('throws an error if vm instance has no injections', () => {
		const vm = {
			$options: {},
		};
		expect(() => checkApolloInject(vm)).toThrow('No apollo client provided');
	});

	it('throws an error if vm instance does not inject apollo', () => {
		const vm = {
			$options: {
				inject: {
					foo: {}
				}
			},
		};
		expect(() => checkApolloInject(vm)).toThrow('No apollo client provided');
	});

	it('does nothing when there is no issue', () => {
		const vm = {
			$options: {
				inject: {
					apollo: {}
				}
			},
		};
		expect(() => checkApolloInject(vm)).not.toThrow();
	});
});
