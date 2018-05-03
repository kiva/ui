<template>
	<ul>
		<li v-for="country in countries" :key="country.isoCode">
			<router-link
				v-if="country.count > 0"
				:to="{ path: '/lend', query: { country: country.isoCode }}"
				v-kv-track-event="['TopNav', 'click-Lend-Country', country.name]">
				{{ country.name }} ({{ country.count }})
			</router-link>
			<span v-else>
				{{ country.name }} (0)
			</span>
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
