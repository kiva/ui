<template>
	<div class="settings-card">
		<div class="icon-wrapper">
			<slot name="icon"></slot>
		</div>
		<div class="title-wrapper">
			<h3>{{ title }}</h3>
		</div>
		<div class="content-wrapper">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		title: {
			type: String,
			default: ''
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.settings-card {
	background: $white;
	padding: 1.95rem;
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	gap: 1rem 1rem;
	grid-template-areas: "icon-wrapper title-wrapper" "icon-wrapper content-wrapper";
}

.icon-wrapper {
	grid-area: icon-wrapper;

	.icon {
		height: 2rem;
		width: 2rem;
	}
}

.title-wrapper {
	grid-area: title-wrapper;

	h3 {
		font-weight: $global-weight-bold;
	}
}

.content-wrapper { grid-area: content-wrapper; }
</style>
