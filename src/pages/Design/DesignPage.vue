<template>
	<div class="kv-tailwind">
		<design-header />
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<div class="lg:tw-col-span-8">
					<header class="tw-py-8">
						<h1>
							Everything you need to create <span class="tw-text-brand">good</span> experiences.
						</h1>
					</header>
					<section id="intro" class="tw-py-8">
						<h2 class="tw-mb-4">
							Doing good has never looked so good
						</h2>
						<p>Contentful Content Here</p>
					</section>
					<section id="logo" class="tw-py-8">
						<h2 class="tw-mb-4">
							Logo
						</h2>
						<p>Contentful Content Here</p>
					</section>
					<section id="colors" class="tw-py-8">
						<h2 class="tw-mb-4">
							Colors
						</h2>
						<p>Contentful Content Here</p>
					</section>
					<section id="type" class="tw-py-8">
						<h2 class="tw-mb-4">
							Type
						</h2>
						<p>Contentful Content Here</p>
					</section>
				</div>
			</kv-grid>
		</kv-page-container>
		<design-footer />
	</div>
</template>

<script>
import DesignHeader from './DesignHeader';
import DesignFooter from './DesignFooter';

// import KvButton from '~/@kiva/kv-components/vue/KvButton';
// import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		DesignHeader,
		DesignFooter,
		// KvButton,
		// KvGrid,
		KvPageContainer,
	}
};
</script>
