<template>
	<www-page>
		<content-container class="md:tw-pt-6 lg:tw-pt-8 ">
			<h1 class="tw-mb-2">
				Make a loan, change a life
			</h1>
			<p class="tw-mb-4 tw-max-w-screen-lg">
				Each Kiva loan helps people build a better
				future for themselves and their families.
			</p>
		</content-container>
		<content-container class="md:tw-pt-6 lg:tw-pt-8">
			<h2>
				Find loans by category
			</h2>
		</content-container>
		<kv-page-container class="sm:tw-pt-3 md:tw-pt-4 lg:tw-pt-6">
			<kv-grid class="tw-grid-cols-12">
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="large" />
				</div>
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="large" />
				</div>
			</kv-grid>
			<kv-grid class="tw-grid-cols-12">
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="large" />
				</div>
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="large" />
				</div>
			</kv-grid>
		</kv-page-container>
		<kv-page-container class="sm:tw-pt-3 md:tw-pt-5 lg:tw-pt-7">
			<kv-grid class="tw-grid-cols-12">
				<div class="md:tw-col-span-4 lg:tw-col-span-4">
					<main-category-tile tile-size="medium" />
				</div>
				<div class="md:tw-col-span-4 lg:tw-col-span-4">
					<main-category-tile tile-size="medium" />
				</div>
				<div class="md:tw-col-span-4 lg:tw-col-span-4">
					<main-category-tile tile-size="medium" />
				</div>
			</kv-grid>
		</kv-page-container>
		<kv-page-container class="sm:tw-pt-3 md:tw-pt-5 lg:tw-pt-7">
			<kv-grid class="tw-grid-cols-12">
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="small" />
				</div>
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="small" />
				</div>
			</kv-grid>
			<kv-grid class="tw-grid-cols-12">
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="small" />
				</div>
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="small" />
				</div>
			</kv-grid>
			<kv-grid class="tw-grid-cols-12">
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="small" />
				</div>
				<div class="md:tw-col-span-6 lg:tw-col-span-6">
					<main-category-tile tile-size="small" />
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import ContentContainer from '@/components/BorrowerProfile/ContentContainer';
import MainCategoryTile from '@/components/Categories/MainCategoryTile';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'CategoriesBeta',
	components: {
		WwwPage,
		ContentContainer,
		MainCategoryTile,
		KvGrid,
		KvPageContainer
	},
};
</script>
