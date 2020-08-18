import KvFlag from '@/components/Kv/KvFlag';

import { getCountryList } from '~/flag-icon-css';

export default {
	title: 'Kv/KvFlag',
	component: KvFlag,
};

export const Default = () => ({
	components: {
		KvFlag
	},
	template: `
		<div>
			<div style="width: 32px">
				<kv-flag country="us" />
				<kv-flag country="au" />
				<kv-flag country="cn" />
				<kv-flag country="kr" />
				<kv-flag country="zw" />
			</div>
			<br />
			<kv-flag country="bz" style="width: 20px;" />
		</div>
	`,
});

export const DefaultInlineSvg = () => ({
	components: {
		KvFlag
	},
	template: `
		<div>
			<div style="width: 10rem;">
				<kv-flag :inline-svg="true" country="us" />
				<kv-flag :inline-svg="true" country="au" />
				<kv-flag :inline-svg="true" country="cn" />
				<kv-flag :inline-svg="true" country="kr" />
				<kv-flag :inline-svg="true" country="zw" />
			</div>
			<br />
			<kv-flag :inline-svg="true" country="bz" style="width: 5rem;" />
		</div>
	`,
});

export const Square = () => ({
	components: {
		KvFlag
	},
	template: `
		<div>
			<div style="width: 32px">
				<kv-flag aspect-ratio="1x1" country="us" />
				<kv-flag aspect-ratio="1x1" country="au" />
				<kv-flag aspect-ratio="1x1" country="cn" />
				<kv-flag aspect-ratio="1x1" country="kr" />
				<kv-flag aspect-ratio="1x1" country="zw" />
			</div>
			<br />
			<kv-flag aspect-ratio="1x1" country="bz" style="width: 20px;" />
		</div>
	`,
});

export const SquareInlineSvg = () => ({
	components: {
		KvFlag
	},
	template: `
		<div>
			<div style="width: 10rem;">
				<kv-flag aspect-ratio="1x1" :inline-svg="true" country="us" />
				<kv-flag aspect-ratio="1x1" :inline-svg="true" country="au" />
				<kv-flag aspect-ratio="1x1" :inline-svg="true" country="cn" />
				<kv-flag aspect-ratio="1x1" :inline-svg="true" country="kr" />
				<kv-flag aspect-ratio="1x1" :inline-svg="true" country="zw" />
			</div>
			<br />
			<kv-flag aspect-ratio="1x1" :inline-svg="true" country="bz" style="width: 5rem;" />
		</div>
	`,
});

export const Circular = () => ({
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
			<kv-flag country="us" aspect-ratio="1x1" class="circular" />
			<kv-flag country="au" aspect-ratio="1x1" class="circular" />
			<kv-flag country="cn" aspect-ratio="1x1" class="circular" />
			<kv-flag country="kr" aspect-ratio="1x1" class="circular" />
			<kv-flag country="zw" aspect-ratio="1x1" class="circular" />
		</div>
	`,
});

export const CircularInlineSvg = () => ({
	components: {
		KvFlag
	},
	template: `
		<div style="width: 10rem;">
			<component is="style">
				.circular {
					border-radius: 50%;
					overflow: hidden;
					border: 1px solid #ccc;
				}
			</component>
			<kv-flag country="us" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag country="au" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag country="cn" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag country="kr" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag country="zw" :inline-svg="true" aspect-ratio="1x1" class="circular" />
		</div>
	`,
});

export const AllCountries = () => ({
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
				:key="code"
			>
				<div>{{ country.code }} - {{ country.name }}</div>
				<kv-flag :country="country.code" style="width: 32px;" />
			</div>
		</div>
	`,
});

export const AllCountriesInlineSvg = () => ({
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
				:key="code"
			>
				<div>{{ country.code }} - {{ country.name }}<div>
				<kv-flag :country="country.code" :inline-svg="true" style="width: 10rem;" />
			</div>
		</div>
	`,
});
