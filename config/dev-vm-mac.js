import { merge } from 'webpack-merge';
import base from './index.js';
import devVm from './dev-vm.js';

export default merge(base, devVm, {
	app: {
		graphqlUri: 'https://api-vm.kiva.org/fed/graphql',
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/fed/graphql',
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		disableCluster: true,
	}
});
