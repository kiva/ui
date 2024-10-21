<template>
	<div class="tw-flex tw-text-white tw-items-center">
		<div class="tw-flex">
			<span
				v-if="prefix"
				class="tw-text-small tw-mt-1"
			>
				{{ prefix }}
			</span>
			<p class="tw-text-jumbo">
				{{ parsedValue(value) }}
			</p>
		</div>
		<p
			v-html="label"
			class="tw-text-base tw-ml-1"
			style="line-height: 22px;"
		></p>
	</div>
</template>

<script setup>
import numeral from 'numeral';

defineProps({
	value: {
		type: Number,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	prefix: {
		type: String,
		default: '',
	},
});

const parsedValue = value => numeral(value).format('0,0');
</script>
