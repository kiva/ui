<template>
	<div v-once class="row columns">
		<p>
			<strong>Current Git Hash:</strong> {{ UI_COMMIT }}
			<br>
			<strong>Branch:</strong> {{ UI_BRANCH }}
		</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// eslint-disable-next-line no-undef
			UI_COMMIT: UI_COMMIT || '',
			// eslint-disable-next-line no-undef
			UI_BRANCH: UI_BRANCH || '',
		};
	},
};
</script>
