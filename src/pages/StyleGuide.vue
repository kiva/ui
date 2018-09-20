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
</style>
