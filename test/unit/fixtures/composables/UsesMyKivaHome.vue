<template>
	<div>
		<span data-testid="home">{{ homePagePath }}</span>
		<span data-testid="portfolio">{{ portfolioPath }}</span>
	</div>
</template>

<script setup>
import useMyKivaHome from '#src/composables/useMyKivaHome';

defineOptions({ name: 'UsesMyKivaHome' });

const { homePagePath, portfolioPath } = useMyKivaHome();
</script>
