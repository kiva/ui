<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import 'modernizr';
import 'foundation/foundation';

window.Foundation.global.namespace = '';

export default {
	name: 'app',
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
