<template>
	<ul>
		<li v-for="country in countries" :key="country.isoCode">
			<router-link :to="{ path: 'lend', query: { country: country.isoCode }}">
				{{ country.name }} ({{ country.count }})
			</router-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		countries: {
			type: Array,
			default: () => [],
		}
	}
};
</script>
