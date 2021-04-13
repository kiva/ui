<template>
	<contentful-page :options="options" />
</template>

<script>
import ContentfulPage from '@/pages/ContentfulPage';

export default {
	inject: ['cookieStore'],
	components: {
		ContentfulPage,
	},
	data() {
		return {
			options: {
				customCtaFunction() {
					console.log('custom function');
				}
			}
		};
	},
};
</script>
