import Bloodhound from 'bloodhound-js';
import { startsWith } from '@/util/comparators';

/*
 * Simple wrapper class around Bloodhound
 */
export default class SearchEngine {
	constructor() {
		this.bloodhound = new Bloodhound({
			datumTokenizer: datum => {
				// Split the datum label by words, where words can include accented characters
				const label = datum && datum.label ? datum.label.toString() : '';
				return label ? label.split(/[^a-zA-ZÀ-Ÿ0-9]+/) : [];
			},
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			identify: datum => `${datum.group}${datum.label}`.replace(/[^a-zA-Z]/g, ''),
			initialize: false,
		});

		this.ready = new Promise(resolve => {
			this.resolveReady = resolve;
		}).then(() => this.bloodhound.initialize());
	}

	search(query) {
		return this.ready.then(() => {
			return new Promise(resolve => {
				this.bloodhound.search(query, results => {
					// Sort the results alphabetically, putting results start with the query first
					resolve(results.sort(startsWith(query, 'label')));
				});
			});
		});
	}

	reset(data) {
		this.bloodhound.local = data;
		this.bloodhound.initialize(true);
		this.resolveReady();
	}
}
