import { getCDNHelper } from '#src/composables/useCDNHeaders';

export default function getCDNHeaders({ useCDNCaching } = {}) {
	if (useCDNCaching) {
		const cdnHelper = getCDNHelper();
		if (cdnHelper) {
			// Add common cache tags for all pages
			cdnHelper.addTags(['ui-all', 'ui-pages']);
			// Return CDN headers
			return {
				'Surrogate-Key': [...cdnHelper.tags.values()].join(' '),
				'Surrogate-Control': cdnHelper.cacheControl.format(),
			};
		}
	}
}
