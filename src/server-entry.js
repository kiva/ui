import { createRenderer } from 'vue-server-renderer';
import isArray from 'lodash-es/isArray';
import createApp from './main';

export default function serverRenderer(options) {
	console.log(options.clientStats.assetsByChunkName.app); // eslint-disable-line

	let assets = options.clientStats.assetsByChunkName.app;
	if (!isArray(assets)) {
		assets = [assets];
	}

	const renderer = createRenderer({
		runInNewContext: false,
		template: `
			<!DOCTYPE html>
			<html lang="en">
				<head></head>
				<body>
					<!--vue-ssr-outlet-->
					${assets.map(asset => `<script src="${asset}"></script>`)}
				</body>
			</html>
		`,
	});

	// return custom rendering middleware
	return (req, res) => {
		const { app, router } = createApp();

		// trigger async data loading and component fetching
		router.push(req.url);

		router.onReady(() => {
			if (!router.getMatchedComponents().length) {
				res.status(404).end('Page not found'); // @todo: 302 to kiva/main instead
			}

			renderer.renderToString(app, {}, (err, html) => {
				if (err) {
					res.status(500).end('Internal Server Error');
				} else {
					res.end(html);
				}
			});
		});
	};
}
