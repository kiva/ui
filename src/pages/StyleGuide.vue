<template>
	<www-page>
		<build-page-wrapper class="tw-prose">
			<h1>Styleguide</h1>

			<p class="tw-text-subhead tw-text-secondary">
				Kiva.org's frontend is built using a Vue.js component library
				and a custom Tailwind.css configuration for styling.
			</p>

			<section class="tw-mb-8">
				<h2>Technical resources</h2>
				<!-- eslint-disable max-len -->
				<ul>
					<li>
						<h3>
							<a href="https://github.com/kiva/kv-ui-elements/tree/main/%40kiva/kv-components">Component Library <kv-material-icon class="tw-w-3 tw-h-3" :icon="mdiGithub" /></a>
						</h3>
					</li>
					<li>
						<h3>
							<a href="https://github.com/kiva/kv-ui-elements/tree/main/%40kiva/kv-tokens">Design Tokens &amp; Tailwind Config <kv-material-icon class="tw-w-3 tw-h-3" :icon="mdiGithub" /></a>
						</h3>
					</li>
					<li>
						<h3>
							<a href="https://main--608b4cf87f686c00213841b1.chromatic.com/?path=/docs/base-styling-primitives--primitives">Storybook</a>
						</h3>
					</li>
				</ul>
				<!-- eslint-enable max-len -->
			</section>
			<section class="tw-mb-8">
				<h2>Brand guidelines</h2>
				<ul>
					<li>
						<h3>
							<router-link to="/design">
								kiva.org/design
							</router-link>
						</h3>
					</li>
				</ul>
			</section>
			<p class="tw-bg-caution tw-text-black tw-text-center tw-py-2 tw-px-4">
				Note: Some areas of the site use Foundation's
				<a href="https://get.foundation/sites/docs/flex-grid.html" target="_blank">
					Flex Grid
				</a>
				for layout and other style rules which we are incrementally replacing.
			</p>
		</build-page-wrapper>
	</www-page>
</template>

<script>
import { mdiGithub } from '@mdi/js';
import WwwPage from '@/components/WwwFrame/WwwPage';
import BuildPageWrapper from '@/components/Build/BuildPageWrapper';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'StyleGuide',
	components: {
		BuildPageWrapper,
		KvMaterialIcon,
		WwwPage,
	},
	metaInfo: {
		title: 'Styleguide'
	},
	data() {
		return { mdiGithub };
	}
};
</script>
