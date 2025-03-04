<template>
	<www-page>
		<template #secondary>
			<developer-secondary-menu />
		</template>
		<build-page-wrapper class="tw-prose">
			<h1>Developer Docs</h1>
			<p>
				We created the Kiva API so that anyone with a good idea and some
				software savvy can help us expand the reach of Kiva, taking it into
				new environments and to new audiences, and creating new features for
				the Kiva community to experience our content in new ways.
				True to the name of our developer destination, we want you to help us
				build Kiva.org.
			</p>
			<h2>API Spotlight</h2>
			<p>
				In order to make the API as fast, usable, and mobile-friendly as
				possible we decided to use GraphQL. One of the great things about
				GraphQL is it's self documenting so you can easily explore all the
				functionality by going to the
				<a href="https://gateway.production.kiva.org/graphql">GraphiQL Explorer</a>.
				Click on the "Docs" link in the top right corner to open the Documentation
				Explorer. Click the "play" button to run the query you build.

				The GraphiQL Explorer allows you to practice writing queries
				and viewing the returned results. Try it out!
			</p>
			<h3>GraphQL Samples</h3>
			<p>
				<kv-multi-code-block nowrap :code="code" />
			</p>
			<p>
				<strong class="tw-hidden md:tw-inline">NOTE: </strong>
				QraphQL's limit for a GET request query is 2500 characters.
				A POST request is recommended for longer queries
			</p>
			<!-- eslint-disable-next-line max-len -->
			<p>
				With all the methods above, the successfully returned JSON data should look something like:<br>
				<kv-code-block :code="sampleJson" />
			</p>
			<p>
				For more information on GraphQL itself, and how to write queries,
				please check out these <a href="http://graphql.org/learn/">docs</a>
			</p>
		</build-page-wrapper>
	</www-page>
</template>

<script>
import DeveloperSecondaryMenu from '#src/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import KvCodeBlock from '#src/components/Kv/KvCodeBlock';
import KvMultiCodeBlock from '#src/components/Kv/KvMultiCodeBlock';
import BuildPageWrapper from '#src/components/Build/BuildPageWrapper';
import WwwPage from '#src/components/WwwFrame/WwwPage';

export default {
	name: 'DocsPage',
	components: {
		DeveloperSecondaryMenu,
		KvCodeBlock,
		KvMultiCodeBlock,
		BuildPageWrapper,
		WwwPage,
	},
	head: {
		title: 'Developer Docs'
	},
	data() {
		return {
			sampleJson:
`{'data': {'lend': {'loan': {'id': 1568001,
			   'name': 'Leydi'} } } }`,
			code: [
				{
					// eslint-disable-next-line no-script-url
					title: 'Javascript: POST Method',
					snippet:
`fetch('https://gateway.production.kiva.org/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: "{lend {loan (id: 1568001){id name}}}" }),
})
  .then(res => res.json())
  .then(res => console.log(res.data));`,
				},
				{
					title: 'Python 3: GET request',
					snippet:
`# this snippet requires the requests library which can be installed
# via pip with the command: pip install requests
import requests

base_url = 'https://gateway.production.kiva.org/graphql?query='

graphql_query = "{lend {loan (id: 1568001){id name}}}"

r = requests.get(base_url+ graphql_query )
r.json()`,
				},
				{
					title: 'Python 3: POST request',
					snippet:
`# this snippet requires the requests library which can be installed
# via pip with the command: pip install requests
import requests

base_url = 'https://gateway.production.kiva.org/graphql?query='

graphql_query = "{lend {loan (id: 1568001){id name}}}"

r = requests.post(base_url+ graphql_query )
r.json()`,
				},
				{
					title: 'CURL: GET method',
					snippet:
`curl \\
  -X GET \\
  -H "Content-Type: application/json" \\
  --data '{ "query": "{lend {loan (id: 1568001){id name}}}"}' \\
  'https://gateway.production.kiva.org/graphql'`,
				},
				{
					title: 'CURL: POST method',
					snippet:
`curl \\
  -X POST \\
  -H "Content-Type: application/json" \\
  --data '{ "query": "{lend {loan (id: 1568001){id name}}}"}' \\
  'https://gateway.production.kiva.org/graphql'`,
				},
			],
		};
	}
};
</script>
