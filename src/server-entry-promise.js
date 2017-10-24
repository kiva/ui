// import { createRenderer } from 'vue-server-renderer';
// const { createBundleRenderer } = require('vue-server-renderer');
// import isArray from 'lodash-es/isArray';
// const isArray = require('lodash/isArray');
import createApp from './main';

const isDev = process.env.NODE_ENV !== 'production';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
	return new Promise((resolve, reject) => {
		const s = isDev && Date.now();
		const { app, router, store } = createApp();

		const { url } = context;
		const { fullPath } = router.resolve(url).route;

		if (fullPath !== url) {
			return reject({ url: fullPath });
		}

		// set router's location
		router.push(url);

		// wait until router has resolved possible async hooks
		router.onReady(() => {
			const matchedComponents = router.getMatchedComponents();
			// no matched routes
			if (!matchedComponents.length) {
				return reject({ code: 404 });
			}
			// Call fetchData hooks on components matched by the route.
			// A preFetch hook dispatches a store action and returns a Promise,
			// which is resolved when the action is complete and store state has been
			// updated.
			Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
				store,
				route: router.currentRoute,
			}))).then(() => {
				isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`) // eslint-disable-line
				// After all preFetch hooks are resolved, our store is now
				// filled with the state needed to render the app.
				// Expose the state on the render context, and let the request handler
				// inline the state in the HTML response. This allows the client-side
				// store to pick-up the server-side state without having to duplicate
				// the initial data fetching on the client.
				context.state = store.state;
				resolve(app);
			}).catch(reject);
		}, reject);
	});
};

// export default function serverRenderer(options) {
// module.exports = function serverRenderer(options) {
// 	console.log(options.clientStats.assetsByChunkName.app); // eslint-disable-line

// 	let assets = options.clientStats.assetsByChunkName.app;
// 	if (!isArray(assets)) {
// 		assets = [assets];
// 	}

// 	const renderer = createRenderer({
// 		runInNewContext: false,
// 		template: `
// 			<!DOCTYPE html>
// 			<html lang="en">
// 				<head></head>
// 				<body>
// 					<!--vue-ssr-outlet-->
// 					${assets.map(asset => `<script src="${asset}"></script>`)}
// 				</body>
// 			</html>
// 		`,
// 	});

// 	// return custom rendering middleware
// 	return (req, res) => {
// 		const { app, router } = createApp();

// 		// trigger async data loading and component fetching
// 		router.push(req.url);

// 		router.onReady(() => {
// 			if (!router.getMatchedComponents().length) {
// 				res.status(404).end('Page not found'); // @todo: 302 to kiva/main instead
// 			}

// 			renderer.renderToString(app, {}, (err, html) => {
// 				if (err) {
// 					res.status(500).end('Internal Server Error');
// 				} else {
// 					res.end(html);
// 				}
// 			});
// 		});
// 	};
// }
