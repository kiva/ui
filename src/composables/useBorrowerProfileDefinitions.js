import { gql } from 'graphql-tag';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatContentGroupsFlat } from '#src/util/contentfulUtils';
import { fetchSalesforceSolution } from '#src/util/salesforceSolution';

const contentfulDefinitionsQuery = gql`query contentfulDefinitions {
	contentful {
		entries(contentKey: "borrower-profile-definitions", contentType: "contentGroup")
	}
}`;

// Module-level cache shared by every caller. Each SSR request runs in its own
// process, so this is request-scoped on the server and session-scoped on the
// client: the definitions are fetched and parsed once, no matter how many
// components resolve a definition.
let contentfulDefinitions = null;
let loadPromise = null;

// Test-only: clear the module cache so specs don't leak state between cases.
export function resetBorrowerProfileDefinitions() {
	contentfulDefinitions = null;
	loadPromise = null;
}

export default function useBorrowerProfileDefinitions(apollo) {
	function loadDefinitions() {
		if (loadPromise) return loadPromise;
		loadPromise = apollo.query({ query: contentfulDefinitionsQuery }).then(result => {
			const contentfulData = result.data?.contentful?.entries?.items ?? null;
			if (contentfulData) {
				const formatted = formatContentGroupsFlat(contentfulData);
				contentfulDefinitions = formatted.borrowerProfileDefinitions?.contents ?? null;
			}
		}).catch(error => {
			// Don't cache the rejection — let a later call retry the load.
			loadPromise = null;
			throw error;
		});
		return loadPromise;
	}

	async function resolveDefinition({ cid, sfid, forceSalesforce = false }) {
		if (!forceSalesforce) {
			if (contentfulDefinitions === null) {
				try {
					await loadDefinitions();
				} catch {
					// Contentful failed — fall through to the Salesforce fallback below.
				}
			}
			const entry = contentfulDefinitions?.find(e => e.key === cid);
			if (entry) {
				return {
					title: entry.name,
					content: documentToHtmlString(entry.richText),
				};
			}
		}

		if (sfid) {
			return fetchSalesforceSolution(apollo, sfid);
		}

		return null;
	}

	return { loadDefinitions, resolveDefinition };
}
