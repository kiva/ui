import { gql } from 'graphql-tag';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { formatContentGroupsFlat } from '#src/util/contentfulUtils';
import { fetchSalesforceSolution } from '#src/util/salesforceSolution';

const contentfulDefinitionsQuery = gql`query contentfulDefinitions {
	contentful {
		entries(contentKey: "borrower-profile-definitions", contentType: "contentGroup")
	}
}`;

export default function useBorrowerProfileDefinitions(apollo) {
	// Cached after first successful load within this composable instance.
	// Apollo cache-first is the true dedup mechanism across components —
	// only one network fetch occurs per page load regardless of how many callers
	// invoke loadDefinitions().
	let contentfulDefinitions = null;

	async function loadDefinitions() {
		const result = await apollo.query({ query: contentfulDefinitionsQuery });
		const contentfulData = result.data?.contentful?.entries?.items ?? null;
		if (contentfulData) {
			const formatted = formatContentGroupsFlat(contentfulData);
			contentfulDefinitions = formatted.borrowerProfileDefinitions?.contents ?? null;
		}
	}

	async function resolveDefinition({ cid, sfid, forceSalesforce = false }) {
		if (contentfulDefinitions === null) {
			await loadDefinitions();
		}

		if (!forceSalesforce && contentfulDefinitions) {
			const entry = contentfulDefinitions.find(e => e.key === cid);
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
