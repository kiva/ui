<template>
	<div class="tw-flex tw-items-center tw-mb-1">
		<div
			v-if="!this.hash"
			class="
				tw-rounded-full
				tw-flex
				tw-items-center
				tw-justify-center
				tw-w-6 tw-h-6
				tw-text-h2
				tw-text-action
				tw-bg-brand-50
			"
		>
			<span>
				{{ lenderNameFirstLetter }}
			</span>
		</div>
		<img
			v-else
			class="tw-block tw-rounded-full"
			:src="lender.image.url"
			alt="Lender image"
			width="48"
			height="48"
		>
		<p class="tw-ml-2">
			{{ name }}
		</p>
		<div class="tw-mx-1">
			<svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="2" cy="2.00006" r="2" fill="#28A062" />
			</svg>
		</div>
		<p class="tw-text-h4 tw-text-tertiary">
			{{ location }}
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
		},
	},
	computed: {
		name() {
			return this.lender?.name ?? '';
		},
		location() {
			return this.lender?.lenderPage?.city && this.lender?.lenderPage?.country?.isoCode
				? `${this.lender?.lenderPage?.city?.toUpperCase()}, ${this.lender?.lenderPage?.country?.isoCode}`
				: '';
		},
		lenderNameFirstLetter() {
			return this.name.substring(0, 1).toUpperCase();
		},
		hash() {
			return this.lender?.image?.hash ?? '';
		}
	}
};
</script>
