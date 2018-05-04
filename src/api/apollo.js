import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import ErrorLinkCreator from './ErrorLink';
import HttpLinkCreator from './HttpLink';

export default function createApolloClient({
	cookie,
	csrfToken,
	types = [],
	uri,
}) {
	return new ApolloClient({
		link: ApolloLink.from([
			ErrorLinkCreator(),
			HttpLinkCreator({ cookie, csrfToken, uri }),
		]),
		cache: new InMemoryCache({
			fragmentMatcher: new IntrospectionFragmentMatcher({
				introspectionQueryResultData: {
					__schema: { types }
				}
			})
		}),
	});
}
