import { merge } from 'webpack-merge';
import stage from './stage.js';

export default merge(stage, {
	app: {
		apolloBatching: false,
		publicPath: 'https://www-stage-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedServers: 'marketplace-k8s-ui-stage.knmtma.cfg.usw2.cache.amazonaws.com:11211',
		enableDDTrace: true,
		disableCluster: true,
	}
});
