import { merge } from 'webpack-merge';
import test from './test.js';

export default merge(test, {
	app: {
		publicPath: 'https://www-test-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedServers: 'marketplace-k8s-ui-test.knmtma.0001.usw2.cache.amazonaws.com:11211',
		disableCluster: true,
	}
});
