import { merge } from 'webpack-merge';
import dev from './dev.js';

export default merge(dev, {
	app: {
		publicPath: 'https://www.dev.kiva.org/',
	},
	server: {
		memcachedServers: 'marketplace-k8s-ui-dev.knmtma.cfg.usw2.cache.amazonaws.com:11211',
		disableCluster: true,
	}
});
