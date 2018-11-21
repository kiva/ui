<template>
	<div v-once class="row columns">
		<h1>UI Styleguide</h1>
		<section>
			<h2>Typography</h2>

			<label class="elem-desc">Level 1 header</label>
			<h1>{{ shortLorem }}</h1>

			<label class="elem-desc">Level 2 header</label>
			<h2>{{ shortLorem }}</h2>

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
		<section id="section-form">
			<h2>Forms</h2>
			<form>
				<label class="elem-desc">Legend above radio buttons with labels</label>
				<fieldset>
					<legend>Example Legend for Radio Buttons and Checkbox</legend>
					<label>
						<input
							type="radio"
							name="radio-example"
							value="on"
						>
						On
					</label>
					<label>
						<input
							type="radio"
							name="radio-example"
							value="off"
						>
						Off
					</label>
					<label v-for="option in options" :key="option">
						{{ option }}
						<input
							type="checkbox"
						>
					</label>
				</fieldset>
				<label class="elem-desc">Select and Multiple Select</label>
				<fieldset class="small-width">
					<label for="example-select">
						Select
						<select
							name="example-select"
							id="example-select"
						>
							<option
								v-for="singleOption in options"
								:key="singleOption"
								:value="singleOption"
							>
								{{ singleOption }}
							</option>
						</select>
					</label>
					<label for="example-multiple-select">
						Multiple Select
						<select
							name="example-multiple-select"
							id="example-multiple-select"
							multiple
						>
							<option
								v-for="singleOption in options"
								:key="singleOption"
								:value="singleOption"
							>
								{{ singleOption }}
							</option>
						</select>
					</label>
				</fieldset>
				<label class="elem-desc">Input Text and Textarea</label>
				<fieldset class="small-width">
					<label for="inputText">
						Input Text
						<input
							type="text"
							name="inputText"
							id="inputText"
							maxlength="40"
						>
					</label>
					<label for="inputTextarea">
						Input Text Area
						<textarea
							name="inputTextarea"
							id="inputTextarea"
							rows="4"
						></textarea>
					</label>
				</fieldset>
			</form>
		</section>
		<section>
			<h2>Buttons</h2>

			<label class="elem-desc">Primary button</label>
			<kv-button>Primary</kv-button>

			<label class="elem-desc">Smaller button (.smaller)</label>
			<kv-button class="smaller">Smaller</kv-button>

			<label class="elem-desc">Secondary button (.secondary)</label>
			<kv-button class="secondary">Secondary</kv-button>

			<label class="elem-desc">Setting button (.setting)</label>
			<kv-button class="setting">Setting</kv-button>
		</section>
	</div>
</template>

<script>
/* eslint-disable max-len */
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	data() {
		return {
			lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			shortLorem: 'Lorem ipsum dolor sit amet',
			options: [
				'Option A',
				'Option B',
				'Option C',
				'Option D',
			],
		};
	},
};
</script>

<style lang="scss" scoped>
.elem-desc {
	border-bottom: 1px solid #eee;
	color: #888;
	font-size: 80%;
}

#section-form {
	.small-width {
		width: 300px;
	}
}
</style>
