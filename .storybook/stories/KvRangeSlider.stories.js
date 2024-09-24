import KvRangeSlider from '#src/components/Kv/KvRangeSlider';

export default {
	title: 'Kv/Form Elements/KvRangeSlider',
	component: KvRangeSlider,
};

export const Default = () => ({
	components: {
		KvRangeSlider
	},
	data() {
		return {
			sliderVal: 100,
		}
	},
	template: `
		<fieldset>
			<legend>KvRangeSlider</legend>

			<kv-range-slider
				id="slider-1"
				:min="0"
				:max="500"
				v-model="sliderVal"
				@change="onChange"
				@input="onInput"
			>
				min: 0, max: 500
			</kv-range-slider>

			<br>

			<kv-range-slider
				id="slider-2"
				:min="0"
				:max="500"
				:step="50"
				v-model="sliderVal"
				disabled
			>
				min: 0, max: 500, step: 50, disabled
			</kv-range-slider>

			<br>

			<kv-range-slider
				id="slider-3"
				:min="0"
				:max="500"
				v-model="sliderVal"
			>
				<strong>Strong Label 💪</strong>
				<template #value>(value: {{sliderVal}})</template>
			</kv-range-slider>
		</fieldset>
	`,
	methods: {
		onInput(val) {
			console.log(`input: ${val}`);
		},
		onChange(val) {
			console.log(`change: ${val}`);
		}
	}
});

export const WithStep = () => ({
	components: {
		KvRangeSlider
	},
	data() {
		return {
			sliderVal: 0.075,
			sliderVal2: -500,
		}
	},
	template: `
		<fieldset>
			<kv-range-slider
				id="slider-1"
				:min="0"
				:max="0.1"
				:step="0.001"
				v-model="sliderVal"
			>
				min: 0, max: 0.1, step: 0.001
				<template #value>(Current Value: {{sliderVal}})</template>
			</kv-range-slider>

			<br>

			<kv-range-slider
				id="slider-2"
				:min="-1000"
				:max="1000"
				:step="100"
				v-model="sliderVal2"
			>
				min: -1000, max: 1000, step: 100
				<template #value>(Current Value: {{sliderVal2}})</template>
			</kv-range-slider>
		</fieldset>
	`,
});

export const OneWayBinding = () => ({
	components: {
		KvRangeSlider
	},
	data() {
		return {
			sliderVal: 50,
		}
	},
	template: `
		<fieldset>
			<kv-range-slider
				id="toggle-3"
				:value="sliderVal"
				@input="onInput"
			>
				:value instead of v-model
				<template #value>(Current Value: {{sliderVal}})</template>
			</kv-range-slider>
		</fieldset>
	`,
	methods: {
		onInput(val) {
			this.sliderVal = val;
		}
	}
});


export const FontSized = () => ({
	components: {
		KvRangeSlider
	},
	data() {
		return {
			sliderVal: 50,
		}
	},
	template: `
		<fieldset>
			<kv-range-slider
				id="slider-1"
				v-model="sliderVal"
				style="font-size: 2em"
			>
				font-size:
				<template #value>2em</template>
			</kv-range-slider>
			<kv-range-slider
				id="slider-2"
				v-model="sliderVal"
				style="font-size: 1em"
			>
				font-size:
				<template #value>1em</template>
			</kv-range-slider>
			<kv-range-slider
				id="slider-3"
				v-model="sliderVal"
				style="font-size: .75em"
			>
				font-size:
				<template #value>.75em</template>
			</kv-range-slider>
		</fieldset>
	`,
});
