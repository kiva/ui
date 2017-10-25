<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
// We know if we're in the browser or not...
// console.log(process);
// - BUT the imports must be at the top level

// - Tried to use browser-env but which mostly works for Modernizr (one fail for HTMLCanvas....)
// - - Foundation is seeking even more info out of Modernizr and Window which causes cascading
// - - failures across the header resulting in failed server render

// import 'modernizr';
// import 'foundation/foundation';

export default {
	name: 'app',
	beforeCreate() {
		// Vue instance is only available attached this within the export block
		// console.log(this);
	},
	beforeMount() {
		window.Foundation = window.Foundation || { global: { namespace: '' } };
	},
};
</script>

<style lang="scss">
// import all the variables
@import 'settings';

// reset the browser styles
@import 'normalize';

// import global styles
@import 'global/page-layout';
@import 'global/fonts';
@import 'global/colors';
@import 'global/line-breaks';

// import global foundation components
@import 'foundation/components/grid';
@import 'foundation/components/type';
@import 'foundation/components/visibility';

// import overrides
@import 'vendor_override/foundation/type';

#app {
	height: 100%;
}
</style>
