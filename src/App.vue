<template>
	<div id="app">
		<router-view/>
		<vue-progress-bar/>
	</div>
</template>

<script>
import 'foundation/foundation.core';
import 'foundation/foundation.util.mediaQuery';

export default {
	name: 'App',
	metaInfo: {
		title: 'Loans that change lives',
		titleTemplate: '%s | Kiva',
	},
	beforeCreate() {
		// Vue instance is only available attached this within the export block
		// console.log(this);
	},
};
</script>

<style lang="scss">
// import all the variables
@import 'settings';
@import 'foundation';

// import global styles
@import 'global/page-layout';
@import 'global/fonts';
@import 'global/line-breaks';

// import global foundation components
@include foundation-global-styles;
@include foundation-flex-grid;
@include foundation-visibility-classes;

#app {
	height: 100%;
}
</style>
