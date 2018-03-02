<template>
	<div id="app">
		<router-view/>
		<vue-progress-bar/>
	</div>
</template>

<script>
// import 'modernizr';
// import 'foundation/foundation';
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
	beforeMount() {
		// window.Foundation = window.Foundation || { global: { namespace: '' } };
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
// @import 'global/colors';
@import 'global/line-breaks';

// import global foundation components
@include foundation-global-styles;
// @include foundation-flex-classes;
// @include foundation-flex-grid;
@include foundation-xy-grid-classes;
@include foundation-visibility-classes;
// @include foundation-typography;
// @include foundation-visibility;

// import overrides
// @import 'vendor_override/foundation/type';

#app {
	height: 100%;
}
</style>
