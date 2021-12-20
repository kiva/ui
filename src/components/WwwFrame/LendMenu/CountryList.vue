<template>
	<ul class="tw-whitespace-nowrap">
		<li v-for="country in countries" :key="country.isoCode" class="lg:tw-w-[11rem]">
			<router-link
				v-if="country.count > 0"
				:to="{ path: '/lend', query: { country: country.isoCode }}"
				v-kv-track-event="['TopNav', 'click-Lend-Country', country.name]"
				class="tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1"
			>
				{{ country.name }} ({{ country.count }})
			</router-link>
			<span v-else class="tw-block tw-py-1 tw-text-tertiary">
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
