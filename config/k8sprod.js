import { merge } from 'webpack-merge';
import prod from './index.js';

export default merge(prod, {
	app: {
		publicPath: 'https://www-kiva-org.freetls.fastly.net/',
	},
	server: {
		// eslint-disable-next-line max-len
		memcachedServers: 'awsprod-ui-memcached-cluster.xd6r4x.0001.usw2.cache.amazonaws.com:11211,awsprod-ui-memcached-cluster.xd6r4x.0002.usw2.cache.amazonaws.com:11211,awsprod-ui-memcached-cluster.xd6r4x.0003.usw2.cache.amazonaws.com:11211,awsprod-ui-memcached-cluster.xd6r4x.0004.usw2.cache.amazonaws.com:11211',
		disableCluster: true,
	}
});
