<template>
	<h1 class="tw-text-h2">
		{{ name }}
	</h1>
</template>

<script>

export default {
	name: 'BorrowerName',
	props: {
		maxLength: {
			type: Number,
			default: 0
		},
		name: {
			type: String,
			default: ''
		}
	},
	computed: {
		processedName() {
			if (this.maxLength === 0) {
				return this.name;
			}
			if (this.name?.length > this.maxLength) {
				return `${this.name?.substring(0, this.maxLength)}...`;
			}
			return this.name;
		}
	}
};
</script>
