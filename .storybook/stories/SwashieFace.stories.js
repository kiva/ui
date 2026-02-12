import SwashieFace from '#src/components/15Years/SwashieFace';
import { KvProgressCircle } from '@kiva/kv-components';

export default {
	title: 'components/SwashieFace',
	component: SwashieFace,
	args: {
		percentFull: 25,
		showLiquid: true,
	},
	argTypes: {
		percentFull: {
			control: 'range',
			options: {
				min: 0,
				max: 100,
				step: 1,
			}
		}
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		SwashieFace
	},
	setup() { return args; },
	template: `
		<swashie-face
			:percent-full="percentFull"
			:show-liquid="showLiquid"
			style="width: 10rem;"
		 />
	`,
});

export const Loading = Default.bind({});
Loading.args = {
	percentFull: null,
};

export const FiftyPercent = Default.bind({});
FiftyPercent.args = {
	percentFull: 50,
};

export const EightyPercent = Default.bind({});
EightyPercent.args = {
	percentFull: 80,
};

export const OneHundredPercent = Default.bind({});
OneHundredPercent.args = {
	percentFull: 100,
};

export const NoLiquid = Default.bind({});
NoLiquid.args = {
	percentFull: 80,
	showLiquid: false
};

export const Scaled = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		SwashieFace
	},
	template: `
		<div style="display: flex; flex-wrap: wrap;">
			<swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 2rem;" />
			<swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 3rem;" />
			<swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 5rem;" />
			<swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 8rem;" />
			<swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 13rem;" />
			<swashie-face :percent-full="percentFull" :show-liquid="showLiquid" style="width: 21rem;" />
		</div>
	`,
});
Scaled.args = {
	percentFull: 100
}

export const WithKvProgressCircle = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle,
		SwashieFace
	},
	template: `
	<div>
		<component is="style">
			.swashie {
				position: relative;
				width: 9.5rem;
				height: 9.5rem;
			}

			.swashie__progress-circle,
			.swashie__face {
				position: absolute;
				z-index: 1;
				width: 100%;
				height: 100%;
			}

			.swashie__progress-circle {
				--kv-progress-circle-foreground-color: #3E4653;
			}

			.swashie__face {
				padding: 7%;
			}
		</component>
		<div class="swashie">
			<kv-progress-circle :stroke-width="5" class="swashie__progress-circle" :value="percentFull" :show-number="true" />
			<swashie-face class="swashie__face" :percent-full="percentFull" :show-liquid="showLiquid" />
		</div>
	</div>
	`,
});
WithKvProgressCircle.args = {
	percentFull: 80
}

export const WithCShapeProgressCircle = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvProgressCircle,
		SwashieFace
	},
	template: `
	<div>
		<component is="style">
			.swashie {
				position: relative;
				width: 9.5rem;
				height: 9.5rem;
			}

			.swashie__progress-circle,
			.swashie__face {
				position: absolute;
				z-index: 1;
				width: 100%;
				height: 100%;
			}

			.swashie__progress-circle {
				--kv-progress-circle-background-color: transparent;
				transform: rotate(36deg);
			}

			.swashie__progress-circle--background {
				--kv-progress-circle-foreground-color: #E1DBD2;
			}

			.swashie__progress-circle--foreground {
				--kv-progress-circle-foreground-color: #319788;
				z-index: 2;
			}

			.swashie__face {
				padding: 10%;
			}
		</component>

		<div class="swashie">
			<kv-progress-circle
				class="swashie__progress-circle swashie__progress-circle--background"
				:stroke-width="12"
				:value="80"
				:show-number="false"
				aria-hidden="true"
			 />
			<kv-progress-circle
				class="swashie__progress-circle swashie__progress-circle--foreground"
				:stroke-width="12"
				:value="parseInt(percentFull * .8)"
				:show-number="false"
			 />
			<swashie-face
				class="swashie__face"
				:percent-full="percentFull"
				:show-liquid="showLiquid"
			 />
		</div>
	</div>
	`,
});
WithCShapeProgressCircle.args = {
	percentFull: 80
}
