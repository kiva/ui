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

		<section>
			<h2>Colors</h2>
			<hr>
			<div class="row">
				<div class="columns small-2 color-card">
					<div class="color-box kiva-green"></div>
					<div class="color-hex small-text">#4faf4e</div>
					<div class="color-name">$kiva-green</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-dark-green"></div>
					<div class="color-hex small-text">#247037</div>
					<div class="color-name">$kiva-dark-green</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-accent-green"></div>
					<div class="color-hex small-text">#aee15c</div>
					<div class="color-name">$kiva-accent-green</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-icon-green"></div>
					<div class="color-hex small-text">#49953f</div>
					<div class="color-name">$kiva-icon-green</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-accent-blue"></div>
					<div class="color-hex small-text">#118aec</div>
					<div class="color-name">$kiva-accent-blue</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-accent-darkblue"></div>
					<div class="color-hex small-text">#006ed3</div>
					<div class="color-name">$kiva-accent-darkblue</div>
				</div>
			</div>

			<div class="row">
				<div class="columns small-2 color-card">
					<div class="color-box kiva-accent-red"></div>
					<div class="color-hex small-text">#d74937</div>
					<div class="color-name">$kiva-accent-red</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-accent-purple"></div>
					<div class="color-hex small-text">#6859c0</div>
					<div class="color-name">$kiva-accent-purple</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-alert-yellow"></div>
					<div class="color-hex small-text">#fee259</div>
					<div class="color-name">$kiva-alert-yellow</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-bg-lightgray"></div>
					<div class="color-hex small-text">#fafafa</div>
					<div class="color-name">$kiva-bg-lightgray</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-bg-darkgray"></div>
					<div class="color-hex small-text">#efefef</div>
					<div class="color-name">$kiva-bg-darkgray</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-stroke-gray"></div>
					<div class="color-hex small-text">#d8d8d8</div>
					<div class="color-name">$kiva-stroke-gray</div>
				</div>
			</div>

			<div class="row">
				<div class="columns small-2 color-card">
					<div class="color-box kiva-text-dark"></div>
					<div class="color-hex small-text">#484848</div>
					<div class="color-name">$kiva-text-dark</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-text-medium"></div>
					<div class="color-hex small-text">#666</div>
					<div class="color-name">$kiva-text-medium</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-text-light"></div>
					<div class="color-hex small-text">#999</div>
					<div class="color-name">$kiva-text-light</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-textlink-visited"></div>
					<div class="color-hex small-text">#0066a9</div>
					<div class="color-name">$kiva-textlink-visited</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box kiva-filter-indicator-bg"></div>
					<div class="color-hex small-text">#d2f0f8</div>
					<div class="color-name">$kiva-filter-indicator-bg</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box shadow-blue"></div>
					<div class="color-hex small-text">#1f92ba</div>
					<div class="color-name">$shadow-blue</div>
				</div>
			</div>

			<div class="row">
				<div class="columns small-2 color-card">
					<div class="color-box shadow-lightblue"></div>
					<div class="color-hex small-text">#6badc2</div>
					<div class="color-name">$shadow-lightblue</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box aqua-light-green"></div>
					<div class="color-hex small-text">#DDFFF4</div>
					<div class="color-name">$aqua-light-green</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box aqua-medium-green"></div>
					<div class="color-hex small-text">#C4E7DB</div>
					<div class="color-name">$aqua-medium-green</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box white"></div>
					<div class="color-hex small-text">#FFF</div>
					<div class="color-name">$white</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box black"></div>
					<div class="color-hex small-text">#000</div>
					<div class="color-name">$black</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box subtle-gray"></div>
					<div class="color-hex small-text">#CCC</div>
					<div class="color-name">$subtle-gray</div>
				</div>
				<div class="columns small-2 color-card">
					<div class="color-box dark-charcoal"></div>
					<div class="color-hex small-text">#333</div>
					<div class="color-name">$dark-charcoal</div>
				</div>
			</div>
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
	methods: {
		// work in progress
		// copyToClipboard() {
		// 	const copiedText = document.querySelector(this.element.value());
		// 	copiedText.setAttribute('type', 'text');
		// 	copiedText.select();

		// 	try {
		// 		var successful = document.execCommand('copy');
		// 		var msg = successful ? 'successful' : 'unsuccessful';
		// 		alert('Code was copied' + copiedText);
		// 	} catch (err) {
		// 		alert('something went wrong');
		// 	}
		// }
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';

.elem-desc {
	border-bottom: 1px solid #eee;
	color: #888;
	font-size: 80%;
}

// Colors section
.color-card {
	text-align: center;
	padding: 5px;
}

.color-box {
	height: 75px;
	width: 75px;
	margin: 0 auto;
}

.color-hex {
	color: $dark-gray;
}

.color-name {
	font-weight: bold;
}

.kiva-green {
	background: $green;
}

.kiva-dark-green {
	background: $dark-green;
}

.kiva-icon-green {
	background: $graphic-green;
}

.kiva-accent-green {
	background: $light-green;
}

.kiva-accent-blue {
	background: $blue;
}

.kiva-accent-darkblue {
	background: $dark-blue;
}

.kiva-accent-red {
	background: $red;
}

.kiva-accent-purple {
	background: $purple;
}

.kiva-alert-yellow {
	background: $vivid-yellow;
}

.kiva-bg-lightgray {
	background: $ghost;
}

.kiva-bg-darkgray {
	background: $ghost;
}

.kiva-stroke-gray {
	background: $platinum;
}

.kiva-text-dark {
	background: $charcoal;
}

.kiva-text-medium {
	background: $dark-gray;
}

.kiva-text-light {
	background: $gray;
}

.kiva-textlink-visited {
	background: $faded-blue;
}

.kiva-filter-indicator-bg {
	background: $pale-blue;
}

.shadow-blue {
	background: $shadow-blue;
}

.shadow-lightblue {
	background: $shadow-lightblue;
}

.aqua-light-green {
	background: $aqua-light-green;
}

.aqua-medium-green {
	background: $aqua-medium-green;
}

.white {
	background: $white;
}

.black {
	background: $black;
}

.subtle-gray {
	background: $subtle-gray;
}

.dark-charcoal {
	background: $dark-charcoal;
}

#section-form {
	.small-width {
		width: 300px;
	}
}
</style>
