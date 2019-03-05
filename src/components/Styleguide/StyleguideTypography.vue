<template>
	<section>
		<h1>Typography</h1>

		<label class="elem-desc">Level 1 header</label>
		<h1>{{ shortLorem }}</h1>

		<label class="elem-desc">Level 2 header</label>
		<h2>{{ shortLorem }}</h2>

		<label class="elem-desc">Level 3 header</label>
		<h3>{{ shortLorem }}</h3>

		<label class="elem-desc">Level 4 header</label>
		<h4>{{ shortLorem }}</h4>

		<label class="elem-desc">Level 5 header</label>
		<h5>{{ shortLorem }}</h5>

		<label class="elem-desc">Level 6 header</label>
		<h6>{{ shortLorem }}</h6>

		<label class="elem-desc">Body text</label>
		<p>{{ lorem }}</p>

		<label class="elem-desc">Small text (.small-text)</label>
		<p class="small-text">{{ lorem }}</p>

		<label class="elem-desc">Featured text (.featured-text)</label>
		<p class="featured-text">{{ lorem }}</p>

		<label class="elem-desc">Overlay text (.overlay-text)</label>
		<p class="overlay-text">{{ lorem }}</p>

		<label class="elem-desc">Impact text (.impact-text)</label>
		<p class="impact-text">{{ shortLorem }}</p>

		<label class="elem-desc">Huge level 1 header (h1.huge)</label>
		<h1 class="huge">{{ shortLorem }}</h1>
	</section>
</template>

<script>
export default {
	data() {
		return {
			/* eslint-disable-next-line max-len */
			lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			shortLorem: 'Lorem ipsum dolor sit amet',
		};
	}
};
</script>
