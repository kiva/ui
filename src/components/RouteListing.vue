<template>
	<div>
		<label>Prod Routes</label>
		<ul>
			<li v-for="route in prodRoutes" :key="route.path">
				Name: {{ route.name }}, Path: {{ route.path }}, Status: {{ route.status }}
				<p><router-link :to="route.path">go to {{ route.name }}</router-link></p>
			</li>
		</ul>
		<label>Dev Routes</label>
		<ul>
			<li v-for="route in devRoutes" :key="route.path">
				Name: {{ route.name }}, Path: {{ route.path }}, Status: {{ route.status }}
				<p><router-link :to="route.path">go to {{ route.name }}</router-link></p>
			</li>
		</ul>
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
