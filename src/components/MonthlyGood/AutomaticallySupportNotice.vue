<template>
	<section class="row tw-flex tw-justify-center">
		<div
			class="md:tw-flex-1
			tw-order-last md:tw-order-first
			md:tw-mt-2 lg:tw-mt-10
			tw-max-w-sm
			tw-px-2 tw-mb-6"
		>
			<h2
				v-html="valueHeadline"
				class="tw-mb-4"
			></h2>
			<p v-html="valueBody"></p>
		</div>
		<div
			class="md:tw-flex-1 tw-block
			tw-order-first md:tw-order-last
			md:tw-px-4
			tw-mb-2 md:tw-mb-4
			tw-inline-flex
			tw-justify-center"
		>
			<kv-contentful-img
				:contentful-src="valueImage"
				fallback-format="jpg"
				:width="1440"
				:alt="valueImageAlt"
				crop="&fit=fill&f=face"
				class="tw-max-w-md"
			/>
		</div>
	</section>
</template>

<script>
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

export default {
	name: 'AutomaticallySupportNotice',
	props: {
		valueHeadline: {
			type: String,
			default: '',
		},
		valueBody: {
			type: String,
			default: '',
		},
		valueImage: {
			type: String,
			default: '',
		},
		valueImageAlt: {
			type: String,
			default: '',
		},
	},
	components: {
		KvContentfulImg
	}
};
</script>
