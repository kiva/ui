<template>
	<div>dynamic child</div>
</template>

<script>
export default {
	name: 'DynamicChild',
	apollo: {
		preFetch: true,
		query: 'dynamicChildQuery',
	},
};
</script>
