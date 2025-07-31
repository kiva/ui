<template>
	<header>
		<nav
			aria-label="Primary navigation"
			class="tw-bg-primary tw-border-b tw-border-tertiary tw-relative"
		>
		<!--header content-->
		</nav>
	</header>
</template>

<script>

export default {
	name: 'TheNewHeader',
	components: {

	},
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
		kvAuth0: { default: null },
	},
	data() {
		return {
			userId: null,
		};
	},
	emits: ['show-basket'],
	props: {

	},
	computed: {

	},
	apollo: {

	},
	created() {

	},
	mounted() {

	},
	beforeUnmount() {

	},
	methods: {}
};

</script>

<style lang="postcss" scoped>

</style>
