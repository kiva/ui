<template>
	<div class="columns">
		<p>
			<strong>Current Git Hash:</strong> {{ UI_COMMIT }}
			<br>
			<strong>Branch:</strong> {{ UI_BRANCH }}
			<br>
			<strong>Tag:</strong> {{ UI_TAG }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'UiRevision',
	data() {
		return {
			// eslint-disable-next-line no-undef
			UI_COMMIT: UI_COMMIT || '',
			// eslint-disable-next-line no-undef
			UI_BRANCH: UI_BRANCH || '',
			// eslint-disable-next-line no-undef
			UI_TAG: UI_TAG || '',
		};
	},
};
</script>
