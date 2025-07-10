import ContentfulBlogPosts from '#src/graphql/query/ContentfulBlogPosts.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

export default apollo => {
	async function getMostRecentBlogPost(categorySlug) {
		// eslint-disable-next-line max-len
		const customFields = `fields.category.sys.contentType.sys.id=blogCategory|fields.category.fields.slug=${categorySlug}|order=-fields.originalPublishDate`;
		try {
			const result = await apollo.query({
				query: ContentfulBlogPosts,
				variables: { customFields, limit: 1, skip: 0 },
			});
			const post = result?.data?.contentful?.blogPosts?.items?.[0];
			if (!post) return null;
			return {
				id: post.sys.id,
				title: post.fields.title,
				image: post.fields.image?.fields?.file?.url,
				category: post.fields.category?.fields?.shortName,
				date: post.fields.originalPublishDate,
				slug: post.fields.slug,

			};
		} catch (error) {
			logReadQueryError(error, 'Error fetching most recent blog post:', error);
			return null;
		}
	}
	return {
		getMostRecentBlogPost,
	};
};
