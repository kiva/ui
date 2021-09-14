<template>
	<div class="tw-bg-secondary tw-py-8">
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-3">
					<kiva-logo class="tw-h-3 tw-text-brand" />
				</div>
				<div class="tw-col-span-3">
					<h2 class="tw-text-h4 tw-mb-2">
						Navigation
					</h2>
					<ul>
						<li>
							<router-link to="#logo">
								Logo
							</router-link>
						</li>
						<li>
							<router-link to="#colors">
								Colors
							</router-link>
						</li>
						<li>
							<router-link to="#type">
								Type
							</router-link>
						</li>
					</ul>
				</div>
				<div class="tw-col-span-3">
					<h2 class="tw-text-h4 tw-mb-2">
						Our Sites
					</h2>
					<ul>
						<li>
							<router-link to="/">
								kiva.org
							</router-link>
						</li>
						<li>
							<a href="https://kiva.global">
								kiva.global
							</a>
						</li>
					</ul>
				</div>
				<div class="tw-col-span-3">
					<h2 class="tw-text-h4 tw-mb-2">
						Contact Us
					</h2>
					<ul>
						<li>
							<a href="mailto:design@kiva.org">design@kiva.org</a>
						</li>
					</ul>
				</div>
			</kv-grid>
			<p class="tw-text-secondary">
				&copy; {{ year }} Kiva. All rights reserved.
			</p>
		</kv-page-container>
	</div>
</template>

<script>
import KivaLogo from '@/assets/inline-svgs/logos/kiva-logo.svg';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		KivaLogo,
		KvGrid,
		KvPageContainer,
	},
	data() {
		return {
			year: new Date().getFullYear(),
		};
	}
};
</script>
