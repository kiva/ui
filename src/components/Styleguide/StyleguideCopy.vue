<template>
	<section>
		<h2>Body Copy</h2>

		<label class="elem-desc">&lt;p&gt; Tag, &lt;a&gt; Tag</label>
		<p>
			Example &lt;p&gt; paragraph text.
			{{ lorem }}
			{{ lorem }}
		</p>
		<p>
			<a>Example &lt;a&gt; Link</a>.
			{{ lorem }}
			{{ lorem }}
		</p>

		<label class="elem-desc">Unordered List &lt;ul&gt;</label>
		<ul>
			<li>Example &lt;ul&gt; unordered list. {{ shortLorem }}</li>
			<li>{{ shortLorem }}</li>
			<li>{{ shortLorem }}</li>
		</ul>

		<label class="elem-desc">Ordered List</label>
		<ol>
			<li>Example &lt;ol&gt; ordered list. {{ shortLorem }}</li>
			<li>{{ shortLorem }}</li>
			<li>{{ shortLorem }}</li>
		</ol>

		<!-- eslint-disable-next-line -->
		<label class="elem-desc">&lt;i&gt; Tag, &lt;em&gt; Tag, &lt;b&gt; Tag, &lt;strong&gt; Tag</label>
		<p>
			<i>Example &lt;i&gt; italicized text</i>.
			{{ lorem }}
		</p>
		<p>
			<em>Example &lt;em&gt; emphasized text</em>.
			{{ lorem }}
		</p>
		<p>
			<b>Example &lt;b&gt; bolded text</b>.
			{{ lorem }}
		</p>
		<p>
			<strong>Example &lt;strong&gt; strong text</strong>.
			{{ lorem }}
		</p>

		<label class="elem-desc">&lt;blockquote&gt; Tag</label>
		<blockquote>Example &lt;blockquote&gt; blockquote text. {{ lorem }}</blockquote>
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
// @import 'settings';
</style>
