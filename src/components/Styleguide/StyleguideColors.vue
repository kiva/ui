<template>
	<section>
		<h1>Colors</h1>
		<ul class="color-groups">
			<li class="color-group" v-for="group in colorGroups" :key="group.categoy">
				<h2>{{ group.category }}</h2>
				<ul class="color-blocks">
					<li class="color-block" v-for="color in group.colors" :key="color[0]">
						<div class="color-box" :style="{ backgroundColor: color[0] }"></div>
						<div>
							<kv-button
								class="smallest secondary"
								@click.native="copyToClipboard(color[0])">
								{{ color[0] }}
							</kv-button>
							<kv-button
								class="smallest secondary"
								@click.native="copyToClipboard(color[1])">
								{{ color[1] }}
							</kv-button>
						</div>
					</li>
				</ul>
			</li>
		</ul>
	</section>
</template>

<script>
import copy from 'copy-to-clipboard';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton
	},
	data() {
		return {
			colorGroups: [
				{
					category: 'Greens',
					colors: [
						['#8ccb8c', '$kiva-accent-green'],
						['#aee15c', '$kiva-light-green'],
						['#4faf4e', '$kiva-green'],
						['#49953f', '$kiva-icon-green'],
						['#247037', '$kiva-darkgreen'],
						['#DDFFF4', '$aqua-light-green'],
						['#C4E7DB', '$aqua-medium-green'],
					]
				},
				{
					category: 'Blues',
					colors: [
						['#d2f0f8', '$kiva-filter-indicator-bg'],
						['#6badc2', '$shadow-lightblue'],
						['#1f92ba', '$shadow-blue'],
						['#118aec', '$kiva-accent-blue'],
						['#006ed3', '$kiva-accent-darkblue'],
						['#0066a9', '$kiva-textlink-visited'],
					]
				},
				{
					category: 'Greys',
					colors: [
						['#ffffff', '$white'],
						['#fafafa', '$kiva-bg-lightgray'],
						['#efefef', '$kiva-bg-darkgray'],
						['#d8d8d8', '$kiva-stroke-gray'],
						['#cccccc', '$subtle-gray'],
						['#999999', '$kiva-text-light'],
						['#666666', '$kiva-text-medium'],
						['#484848', '$kiva-text-dark'],
						['#333333', '$dark-charcoal'],
						['#000000', '$black'],

					]
				},
				{
					category: 'Highlights',
					colors: [
						['#d74937', '$kiva-accent-red'],
						['#6859c0', '$kiva-accent-purple'],
						['#fee259', '$kiva-alert-yellow'],
					]
				},
			]
		};
	},
	methods: {
		copyToClipboard(string) {
			return copy(string);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.color-groups,
.color-blocks {
	list-style: none;
	padding: 0;
	margin: 0;
}

.color-blocks {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 1rem;
}

.color-card {
	text-align: center;
	padding: rem-calc(5);
}

.color-box {
	height: rem-calc(75);
	margin: 0 auto;
}

.color-hex {
	color: $dark-gray;
}

.color-name {
	font-weight: bold;
}



</style>
