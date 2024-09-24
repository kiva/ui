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
					:is-square="isSquare"
				/>
			</div>
			<br />
			<kv-flag
				:country="country"
				:is-square="isSquare"
				style="width: 20px;"
			 />
		</div>
	`,
});

export const Square = Default.bind({});
Square.args = {
	isSquare: true,
};

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
					style="width: 32px;"
				/>
			</div>
		</div>
	`,
});

AllCountries.argTypes = {
	country: { control: { disable: true } },
}
