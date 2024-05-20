import { merge } from 'webpack-merge';
import base from './dev-vm.js';

export default merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		auth0: {
			enable: false,
		},
	},
	server: {
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
});
