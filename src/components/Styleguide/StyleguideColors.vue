<template>
	<div>
		<h1>Colors</h1>
		<ul class="color-group-list">
			<li class="color-group" v-for="group in colorGroups" :key="group.categoy">
				<h2>{{ group.category }}</h2>
				<ul class="color-block-list">
					<li class="color-block" v-for="color in group.colors" :key="color[0]">
						<div class="color-values">
							<button
								class="color-values-btn"
								@click="copyToClipboard(color[0])"
							>
								{{ color[0] }}
							</button>
							<button
								class="color-values-btn"
								@click="copyToClipboard(color[1])"
							>
								{{ color[1] }}
							</button>
						</div>
						<div class="color-square" :style="{ backgroundColor: color[0] }"></div>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	data() {
		return {
			colorGroups: [
				{
					category: 'Greens',
					colors: [
						['#aee15c', '$kiva-light-green'],
						['#8ccb8c', '$kiva-accent-green'],
						['#4faf4e', '$kiva-green'],
						['#49953f', '$kiva-icon-green'],
						['#247037', '$kiva-darkgreen'],
					]
				},
				{
					category: 'Blues',
					colors: [
						['#DDFFF4', '$aqua-light-green'],
						['#C4E7DB', '$aqua-medium-green'],
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
			try {
				navigator.clipboard.writeText(string);
			} catch (err) {
				console.error(err);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.color-group-list,
.color-block-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.color-group {
	margin-bottom: 4rem;
}

.color-block-list {
	display: grid;
	grid-gap: 1rem;
}

.color-block {
	display: grid;
	grid-template-columns: 12rem 1fr;
	grid-gap: 0.5rem;
}

.color-square {
	height: rem-calc(80);
}

.color-values {
	display: grid;
	grid-template-rows: auto auto;
	grid-gap: 0.5rem;
	align-content: center;
}

.color-values-btn {
	// color: #fff;
	padding: 0.125rem 0;
	text-align: left;
}
</style>
