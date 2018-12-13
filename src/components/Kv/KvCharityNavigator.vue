<template>
	<div id="container">
		<div id="title">{{ title }}</div>
		<div id="image" :class="`${wideIcon ? 'wide-icon' : ''}`">
			<img v-if="!wideIcon" src="~@/assets/images/charity-navigator.png">
			<img v-else src="~@/assets/images/charity-navigator-wide.png">
		</div>
		<div id="subtitle">{{ subtitle }}</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: 'Awarded for effectiveness and efficiency',
		},
		wideIcon: {
			type: Boolean,
			default: false,
		},
		subtitle: {
			type: String,
			default: 'Charity Navigator\'s highest rating',
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	* {
		text-align: center;
	}
}

#title {
	font-weight: 500;
}

#image {
	margin: rem-calc(10) 0 rem-calc(5) 0;
	max-width: 75%;

	&.wide-icon {
		margin: rem-calc(10) 0;
	}
}

#subtitle {
	font-size: 0.875rem;
}
</style>
