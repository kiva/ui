<template>
	<div class="tw-flex tw-items-center tw-mb-1">
		<img
			class="tw-block tw-rounded-full"
			:src="lender.image.url"
			alt="Lender image"
			width="48"
			height="48"
		>
		<p class="tw-ml-2">
			{{ lender.name }}
		</p>
		<div class="tw-mx-1">
			<svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="2" cy="2.00006" r="2" fill="#28A062" />
			</svg>
		</div>
		<p class="tw-text-small tw-text-secondary tw-font-medium">
			{{ lender.lenderPage.city.toUpperCase() }}, {{ lender.lenderPage.country.isoCode }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'LendersListItem',
	inject: ['apollo', 'cookieStore'],
	props: {
		lender: {
			type: Object,
			default: null
		}
	},
};
</script>
