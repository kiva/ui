<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Kiva UI</h1>
				<p>Kiva + Vue.js</p>
				<p><router-link to="/two">go to page two</router-link></p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/pages/WwwPage';

export default {
	components: { WwwPage },
};
</script>

<style lang="scss">
@import 'settings';

// .menu {
// 	ul {
// 		list-style: none;
// 		margin: 0;
// 		display: flex;
// 		flex-flow: column wrap;
// 		align-items: flex-start;
// 		align-content: flex-start;
// 		height: 11rem;
// 	}
//
// 	li {
// 		margin-right: 1rem;
// 	}
//
// 	li.last {
// 		flex-grow: 1;
// 	}
// }
</style>
