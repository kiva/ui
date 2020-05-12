<template>
	<section>
		<h1>Typography</h1>

		<dl class="glossary">
			<dt>h1.huge, <br>@include huge-headline()</dt>
			<dd>
				<h1 class="huge">
					{{ shortLorem }}
				</h1>
			</dd>

			<dt>.impact-text, <br>@include impact-text()</dt>
			<dd>
				<p class="impact-text">
					{{ shortLorem }}
				</p>
			</dd>

			<dt>.large-text, <br>@include large-text()</dt>
			<dd>
				<p class="large-text">
					{{ shortLorem }}
				</p>
			</dd>

			<dt>h1, .h1</dt>
			<dd>
				<h1>{{ shortLorem }}</h1>
			</dd>

			<dt>h2, .h2</dt>
			<dd>
				<h2>{{ shortLorem }}</h2>
			</dd>

			<dt>.featured-text, <br>@include featured-text()</dt>
			<dd>
				<p class="featured-text">
					{{ shortLorem }}
				</p>
			</dd>

			<dt>.medium-text, <br>@include medium-text()</dt>
			<dd>
				<p class="medium-text">
					{{ shortLorem }}
				</p>
			</dd>

			<dt>h3, .h3</dt>
			<dd>
				<h3>{{ shortLorem }}</h3>
			</dd>

			<dt>h4, .h4</dt>
			<dd>
				<h4>{{ shortLorem }}</h4>
			</dd>

			<dt>Body text</dt>
			<dd>
				<p>{{ shortLorem }}</p>
			</dd>

			<dt>.small-text, <br>@include small-text()</dt>
			<dd>
				<p class="small-text">
					{{ shortLorem }}
				</p>
			</dd>
		</dl>
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

<style lang="scss" scoped>
.glossary {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-gap: 2rem;

	dt {
		text-align: right;
		font-weight: normal;
	}

	dd * {
		outline: 1px solid pink;
	}
}
</style>
