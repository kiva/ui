import KvFlag2 from '@/components/Kv/KvFlag2';

import { getCountryList } from '~/flag-icon-css';

export default {
	title: 'Kv/KvFlag2',
	component: KvFlag2,
};

export const Default = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div>
			<div style="width: 32px">
				<kv-flag2 country="us" />
				<kv-flag2 country="au" />
				<kv-flag2 country="cn" />
				<kv-flag2 country="kr" />
				<kv-flag2 country="zw" />
			</div>
			<br />
			<kv-flag2 country="bz" style="width: 20px;" />
		</div>
	`,
});

export const DefaultInlineSvg = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div>
			<div style="width: 10rem;">
				<kv-flag2 :inline-svg="true" country="us" />
				<kv-flag2 :inline-svg="true" country="au" />
				<kv-flag2 :inline-svg="true" country="cn" />
				<kv-flag2 :inline-svg="true" country="kr" />
				<kv-flag2 :inline-svg="true" country="zw" />
			</div>
			<br />
			<kv-flag2 :inline-svg="true" country="bz" style="width: 5rem;" />
		</div>
	`,
});

export const Square = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div>
			<div style="width: 32px">
				<kv-flag2 aspect-ratio="1x1" country="us" />
				<kv-flag2 aspect-ratio="1x1" country="au" />
				<kv-flag2 aspect-ratio="1x1" country="cn" />
				<kv-flag2 aspect-ratio="1x1" country="kr" />
				<kv-flag2 aspect-ratio="1x1" country="zw" />
			</div>
			<br />
			<kv-flag2 aspect-ratio="1x1" country="bz" style="width: 20px;" />
		</div>
	`,
});

export const SquareInlineSvg = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div>
			<div style="width: 10rem;">
				<kv-flag2 aspect-ratio="1x1" :inline-svg="true" country="us" />
				<kv-flag2 aspect-ratio="1x1" :inline-svg="true" country="au" />
				<kv-flag2 aspect-ratio="1x1" :inline-svg="true" country="cn" />
				<kv-flag2 aspect-ratio="1x1" :inline-svg="true" country="kr" />
				<kv-flag2 aspect-ratio="1x1" :inline-svg="true" country="zw" />
			</div>
			<br />
			<kv-flag2 aspect-ratio="1x1" :inline-svg="true" country="bz" style="width: 5rem;" />
		</div>
	`,
});

export const Circular = () => ({
	components: {
		KvFlag2
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
			<kv-flag2 country="us" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="au" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="cn" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="kr" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="zw" aspect-ratio="1x1" class="circular" />
		</div>
	`,
});

export const CircularInlineSvg = () => ({
	components: {
		KvFlag2
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
			<kv-flag2 country="us" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="au" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="cn" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="kr" :inline-svg="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="zw" :inline-svg="true" aspect-ratio="1x1" class="circular" />
		</div>
	`,
});

export const AllCountries = () => ({
	components: {
		KvFlag2
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
				<kv-flag2 :country="country.code" style="width: 32px;" />
			</div>
		</div>
	`,
});

export const AllCountriesInlineSvg = () => ({
	components: {
		KvFlag2
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
				<kv-flag2 :country="country.code" :inline-svg="true" style="width: 10rem;" />
			</div>
		</div>
	`,
});
