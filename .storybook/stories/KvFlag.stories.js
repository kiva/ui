import KvFlag from '#src/components/Kv/KvFlag';

import { getCountryList } from 'flag-icon-css';

export default {
	title: 'Kv/KvFlag',
	component: KvFlag,
	args: {
		country: 'us',
		inlineSvg: false,
		aspectRatio: '4x3'
	},
	argTypes: {
		country: {
			control: {
				type: 'select',
			},
			options: getCountryList().map(country => country.code),
		},
		aspectRatio: {
			control: {
				type: 'radio',
			},
			options: ['4x3', '1x1'],
		}
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvFlag
	},
	setup() { return args; },
	template: `
		<div>
			<div style="width: 32px">
				<kv-flag
					:country="country"
					:inline-svg="inlineSvg"
					:aspect-ratio="aspectRatio"
				/>
			</div>
			<br />
			<kv-flag
				:country="country"
				:inline-svg="inlineSvg"
				:aspect-ratio="aspectRatio"
				style="width: 20px;"
			 />
		</div>
	`,
});

export const InlineSvg = Default.bind({});
InlineSvg.args = {
	inlineSvg: true,
};

export const Square = Default.bind({});
Square.args = {
	aspectRatio: '1x1'
};

export const Circular = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvFlag
	},
	template: `
		<div style="width: 32px;">
			<component is="style">
				.circular {
					border-radius: 50%;
					overflow: hidden;
					border: 1px solid #ccc;
					box-sizing: content-box;
				}
			</component>
			<kv-flag
				:country="country"
				:inline-svg="inlineSvg"
				:aspect-ratio="aspectRatio"
				class="circular"
			/>
		</div>
	`,
});
Circular.args = {
	aspectRatio: '1x1'
};

export const CircularInlineSvg = Circular.bind({});
CircularInlineSvg.args = {
	...Circular.args,
	inlineSvg: true
}

export const AllCountries = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvFlag
	},
	data() {
		return {
			countryList: getCountryList()
		}
	},
	template: `
		<div>
			<div
				v-for="country in countryList"
				:key="country.code"
			>
				<div>{{ country.code }} - {{ country.name }}</div>
				<kv-flag
					:country="country.code"
					:inline-svg="inlineSvg"
					:aspect-ratio="aspectRatio"
					style="width: 32px;"
				/>
			</div>
		</div>
	`,
});

AllCountries.argTypes = {
	country: { control: { disable: true } },
	inlineSvg: { control: { disable: true } }
}

export const AllCountriesInlineSvg = AllCountries.bind({});
AllCountriesInlineSvg.args = {
	...AllCountries.args,
	inlineSvg: true
}
AllCountriesInlineSvg.argTypes = {
	...AllCountries.argTypes,
}
