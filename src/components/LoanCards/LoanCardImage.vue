<template functional>
	<div class="borrower-image-wrapper">
		<router-link
			:to="`/lend/${props.id}`"
			v-kv-track-event="['Lending', 'click-Read more', 'Photo', props.id, 'true']">

			<img class="borrower-image"
				:srcset = "props.retinaImageUrl + ' 2x'"
				:src = "props.standardImageUrl"
				:alt = "'photo of ' + props.name"
			>
		</router-link>
	</div>
</template>

<style lang="scss" scoped>
	@import 'settings';

	.borrower-image-wrapper {
		height: 0;
		overflow: hidden;
		padding-top: 75%;
		background: $kiva-stroke-gray;
		position: relative;
	}

	.borrower-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
