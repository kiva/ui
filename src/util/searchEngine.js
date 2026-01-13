import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _map from 'lodash/map';
import Fuse from 'fuse.js';
import { startsWith } from '#src/util/comparators';

/*
 * Simple wrapper class around Fuse
 */
export default class SearchEngine {
	constructor(data = []) {
		this.ready = new Promise(resolve => {
			this.resolveReady = resolve;
		});

		if (data.length) {
			this.init(data);
		}
	}

	reset(data) {
		if (this.fuse) {
			this.fuse.setCollection(data);
		} else {
			this.init(data);
		}
	}

	init(data) {
		this.fuse = new Fuse(data, {
			threshold: 0.25,
			distance: 100000,
			includeMatches: true,
			keys: ['label', 'keywords'],
		});
		this.resolveReady();
	}

	search(query) {
		return this.ready.then(() => {
			return new Promise(resolve => {
				const results = this.fuse.search(query);

				// filter out results that don't have any matches
				const filtered = _filter(results, result => result.matches.length);

				// flatten the results back to the original item + simple array of matches
				const flattened = _map(filtered, ({ item, matches }) => {
					return {
						...item,
						matches: _flatten(_map(matches, 'indices'))
					};
				});

				// Sort the results alphabetically, putting results start with the query first
				resolve(flattened.sort(startsWith(query, 'label')));
			});
		});
	}
}
