<template functional>
	<div id="container">
		<div id="title">Awarded for effectiveness and efficiency</div>
		<div id="image"><img src="~@/assets/images/charity-navigator.png"></div>
		<div id="subtitle">Charity Navigator's highest rating</div>
	</div>
</template>

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
	}

	#subtitle {
		font-size: 0.875rem;
	}
</style>
