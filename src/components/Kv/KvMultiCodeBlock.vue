<template>
	<div>
		<div
			class="tab-container"
			:class="`${open ? 'open' : ''}`"
			@click="handleClickContainer"
			ref="tabContainer"
		>
			<div
				v-for="{title, index} in code"
				:key="index"
				class="tab"
				:class="`${isTabSelected(index) ? 'active' : ''}`"
				@click="setSelected(index)"
			>
				{{ title }}
			</div>
			<kv-hamburger-icon class="hamburger-menu" :open="open" color="#118aec" width="1.5rem"/>
		</div>
		<kv-code-block :code="selectedCode" :nowrap="nowrap" />
	</div>
</template>

<script>
import KvCodeBlock from '@/components/Kv/KvCodeBlock';
import KvHamburgerIcon from './KvHamburgerIcon';

export default {
	components: {
		KvHamburgerIcon,
		KvCodeBlock,
	},
	data() {
		return {
			open: false,
			code: [
				{
					// eslint-disable-next-line no-script-url
					title: 'Javascript: POST Method',
					snippet:
`fetch('https://api.kivaws.org/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: "{lend {loan (id: 1568001){id name}}}" }),
})
  .then(res => res.json())
  .then(res => console.log(res.data));
`,
				},
				{
					title: 'Python 3: GET request',
					snippet:
`# this snippet requires the requests library which can be installed
# via pip with the command: pip install requests
import requests

base_url = 'https://api.kivaws.org/graphql?query='

graphql_query = "{lend {loan (id: 1568001){id name}}}"

r = requests.get(base_url+ graphql_query )
r.json()
`,
				},
				{
					title: 'Python 3: POST request',
					snippet:
`# this snippet requires the requests library which can be installed
# via pip with the command: pip install requests
import requests

base_url = 'https://api.kivaws.org/graphql?query='

graphql_query = "{lend {loan (id: 1568001){id name}}}"

r = requests.post(base_url+ graphql_query )
r.json()
`,
				},
				{
					title: 'CURL: GET method',
					snippet:
`curl \\
  -X GET \\
  -H "Content-Type: application/json" \\
  --data '{ "query": "{lend {loan (id: 1568001){id name}}}"}' \\
  'https://api.kivaws.org/graphql'
`,
				},
				{
					title: 'CURL: POST method',
					snippet:
`curl \\
  -X POST \\
  -H "Content-Type: application/json" \\
  --data '{ "query": "{lend {loan (id: 1568001){id name}}}"}' \\
  'https://api.kivaws.org/graphql'
`,
				},
			].map((codeObject, index) => ({ ...codeObject, index })),
			selectedIndex: 0,
		};
	},
	props: {
		/*
		code: {
			type: Array,
			default: () => [],
		},
		*/
		nowrap: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		selectedCode() {
			return this.code[this.selectedIndex].snippet;
		},
	},
	methods: {
		isTabSelected(index) {
			return index === this.selectedIndex;
		},
		setSelected(index) {
			this.selectedIndex = index;
		},
		handleClickContainer() {
			this.open = !this.open;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.tab-container {
	display: flex;
	justify-content: flex-start;
	margin-bottom: 0.25rem;
	border: 1px solid $blue;
	border-radius: rem-calc(3);
	cursor: pointer;
	flex-direction: column;
	position: relative;

	.tab {
		display: none;
		text-align: left;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		user-select: none;

		&:hover,
		&.active {
			color: $blue;
		}

		&.active {
			display: block;
		}
	}

	&.open {
		.tab {
			display: block;
		}
	}

	.hamburger-menu {
		position: absolute;
		top: rem-calc(12);
		right: 0.75rem;
	}

	@include breakpoint(large) {
		border: none;
		border-radius: initial;
		cursor: initial;
		flex-direction: row;

		.tab {
			text-align: center;
			display: block;
			border-bottom: 1px solid rgba(17, 138, 238, 0);
			transition: color 0.16s linear, border-bottom 0.16s linear, text-shadow 0.16s linear;

			&.active {
				border-bottom: 1px solid rgba(17, 138, 238, 1);
				text-shadow: 0.5px 0 $blue;
			}
		}

		.hamburger-menu {
			display: none;
		}
	}
}
</style>
