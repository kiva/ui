<template>
	<div>
		<div v-if="prodRoutes.length">
			<h3>Prod Routes</h3>
			<ul>
				<li v-for="route in prodRoutes" :key="route.path">
					<p><router-link :to="route.path">{{ route.path.replace('/','') }}</router-link></p>
				</li>
			</ul>
		</div>
		<div v-if="devRoutes.length">
			<h3>Dev Routes</h3>
			<ul>
				<li v-for="route in devRoutes" :key="route.path">
					<p><router-link :to="route.path">{{ route.path.replace('/','') }}</router-link></p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
			devRoutes: [],
			prodRoutes: [],
		};
	},
	created() {
		this.$router.options.routes.forEach(route => {
			if (route.status === 'dev') {
				this.devRoutes.push({
					name: route.name ? route.name : 'no-name',
					path: route.path ? route.path : 'no-path',
					status: route.status ? route.status : 'no-status',
				});
			} else {
				this.prodRoutes.push({
					name: route.name ? route.name : 'no-name',
					path: route.path ? route.path : 'no-path',
					status: route.status ? route.status : 'no-status',
				});
			}
		});
	},
};
</script>

<style lang="scss">

</style>
