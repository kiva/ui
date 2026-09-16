<template>
	<div>static child</div>
</template>

<script>
export default {
	name: 'StaticChild',
	apollo: {
		preFetch: true,
		query: 'staticChildQuery',
	},
};
</script>
