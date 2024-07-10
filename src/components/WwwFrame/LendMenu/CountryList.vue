<template>
	<ul class="tw-whitespace-nowrap tw-font-medium">
		<li v-for="country in countries" :key="country.isoCode" class="lg:tw-w-[11rem]">
			<a
				v-if="country.count > 0"
				:href="`/lend/filter?country=${country.isoCode}`"
				v-kv-track-event="['TopNav', 'click-Lend-Country', country.name]"
				class="tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1"
			>
				{{ country.name }} ({{ country.count }})
			</a>
			<span v-else class="tw-block tw-py-1 tw-text-tertiary">
				{{ country.name }} (0)
			</span>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'CountryList',
	props: {
		countries: {
			type: Array,
			default: () => [],
		}
	}
};
</script>
