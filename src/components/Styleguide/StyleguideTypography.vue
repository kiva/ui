<template>
	<section>
		<h1>Typography</h1>

		<div class="elem-desc">
			Level 1 header
		</div>
		<h1>{{ shortLorem }}</h1>

		<div class="elem-desc">
			Level 2 header
		</div>
		<h2>{{ shortLorem }}</h2>

		<div class="elem-desc">
			Level 3 header
		</div>
		<h3>{{ shortLorem }}</h3>

		<div class="elem-desc">
			Level 4 header
		</div>
		<h4>{{ shortLorem }}</h4>

		<div class="elem-desc">
			Level 5 header
		</div>
		<h5>{{ shortLorem }}</h5>

		<div class="elem-desc">
			Level 6 header
		</div>
		<h6>{{ shortLorem }}</h6>

		<div class="elem-desc">
			Body text
		</div>
		<p>{{ lorem }}</p>

		<div class="elem-desc">
			Small text (.small-text)
		</div>
		<p class="small-text">
			{{ lorem }}
		</p>

		<div class="elem-desc">
			Featured text (.featured-text, @include featred-text())
		</div>
		<p class="featured-text">
			{{ lorem }}
		</p>

		<div class="elem-desc">
			Overlay text (.overlay-text, @include overlay-text())
		</div>
		<p class="overlay-text">
			{{ lorem }}
		</p>

		<div class="elem-desc">
			Medium text (.medium-text, @include medium-text())
		</div>
		<p class="medium-text">
			{{ shortLorem }}
		</p>

		<div class="elem-desc">
			Large text (.large-text, @include large-text())
		</div>
		<p class="large-text">
			{{ shortLorem }}
		</p>

		<div class="elem-desc">
			Impact text (.impact-text, @include impact-text())
		</div>
		<p class="impact-text">
			{{ shortLorem }}
		</p>

		<div class="elem-desc">
			Huge level 1 header (h1.huge, @include huge-headline())
		</div>
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
