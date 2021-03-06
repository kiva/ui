<template>
	<section>
		<h1>Introduction</h1>

		<p>
			The basis for Kiva's web styleguide is Zurb's
			<a href="https://foundation.zurb.com/sites/docs/" target="_blank">Foundation for Sites</a>
			responsive front-end framework.
		</p>

		<h2>Sensible HTML Element Defaults</h2>
		<p>
			Foundation provides a set of sensible defaults for all HTML elements by way of the
			<a href="https://foundation.zurb.com/sites/docs/sass.html#the-settings-file" target="_blank">
				_settings.scss</a>
			file. The nice thing about the settings file is that you can override it with your own
			<a href="https://github.com/kiva/ui/blob/master/src/assets/scss/_settings.scss" target="_blank">
				_settings.scss</a>
			file.
		</p>

		<p>
			What this means for us is a head start across almost all default HTML element styles along with
			a system to empower a grid + flexbox powered layout across the site.
		</p>

		<h2>Grid System</h2>
		<p>
			We are using the <a href="https://foundation.zurb.com/sites/docs/flex-grid.html" target="_blank">
				Flex Grid</a> which works like a traditional grid system with some additional Flex Box functionality
			added in.
		</p>

		<div class="callout warning">
			<h3><strong>No Foundation Javascript</strong></h3>
			<p class="small-text">
				We only use the scss portion of the Foundation toolset, opting NOT to include any of their
				javascript or any components that depend on that inclusion.
			</p>
			<p class="small-text">
				This decision was made primarily due to the additional filesize that including
				jQuery and other associated scripts would add.
			</p>
			<p class="small-text">
				<strong>Look for Foundation Callouts in other sections for tips on how the framework is used.</strong>
			</p>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';
@include foundation-callout;
</style>
