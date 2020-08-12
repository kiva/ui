import KvFlag2 from '@/components/Kv/KvFlag2';

function getFilenames(r) {
	return r.keys().map((filename) => {
		let str = filename;
		str = str.substring(2); // remove ./
		str = str.substring(0, str.length - 4); // remove .svg
		return str;
	});
}

export default {
	title: 'Kv/KvFlag2',
	component: KvFlag2,
 };


export const Default = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div style="width: 10rem;">
			<kv-flag2 country="us" />
			<kv-flag2 country="au" />
			<kv-flag2 country="cn" />
			<kv-flag2 country="kr" />
			<kv-flag2 country="zw" />
		</div>
	`,
});

export const DefaultFromSprite = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div style="width: 32px">
			<kv-flag2 :from-sprite="true" country="us" />
			<kv-flag2 :from-sprite="true" country="au" />
			<kv-flag2 :from-sprite="true" country="cn" />
			<kv-flag2 :from-sprite="true" country="kr" />
			<kv-flag2 :from-sprite="true" country="zw" />
		</div>
	`,
});

export const Square = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div style="width: 10rem;">
			<kv-flag2 country="us" aspect-ratio="1x1"/>
			<kv-flag2 country="au" aspect-ratio="1x1"/>
			<kv-flag2 country="cn" aspect-ratio="1x1"/>
			<kv-flag2 country="kr" aspect-ratio="1x1"/>
			<kv-flag2 country="zw" aspect-ratio="1x1"/>
		</div>
	`,
});

export const SquareFromSprite = () => ({
	components: {
		KvFlag2
	},
	template: `
		<div style="width: 32px;">
			<kv-flag2 country="us" :from-sprite="true" aspect-ratio="1x1"/>
			<kv-flag2 country="au" :from-sprite="true" aspect-ratio="1x1"/>
			<kv-flag2 country="cn" :from-sprite="true" aspect-ratio="1x1"/>
			<kv-flag2 country="kr" :from-sprite="true" aspect-ratio="1x1"/>
			<kv-flag2 country="zw" :from-sprite="true" aspect-ratio="1x1"/>
		</div>
	`,
});


export const Circular = () => ({
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
			<kv-flag2 country="us" aspect-ratio="1x1" class="circular"/>
			<kv-flag2 country="au" aspect-ratio="1x1" class="circular"/>
			<kv-flag2 country="cn" aspect-ratio="1x1" class="circular"/>
			<kv-flag2 country="kr" aspect-ratio="1x1" class="circular"/>
			<kv-flag2 country="zw" aspect-ratio="1x1" class="circular"/>
		</div>
	`,
});

export const CircularFromSprite = () => ({
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
			<kv-flag2 country="us" :from-sprite="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="au" :from-sprite="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="cn" :from-sprite="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="kr" :from-sprite="true" aspect-ratio="1x1" class="circular" />
			<kv-flag2 country="zw" :from-sprite="true" aspect-ratio="1x1" class="circular" />
		</div>
	`,
});

export const AllCountries = () => ({
	components: {
		KvFlag2
	},
	data() {
		return {
			iconNames: getFilenames(require.context('@/assets/inline-svgs/flags/4x3', true, /\.svg$/))
		}
	},
	template: `
		<div>
			<div
				v-for="iconName in iconNames"
				:key="iconName"
				style="width: 10rem;"
			>
				{{iconName}}
				<kv-flag2 :country="iconName" />
			</div>
		</div>
	`,
});

export const AllCountriesFromSprite = () => ({
	components: {
		KvFlag2
	},
	data() {
		return {
			iconNames: getFilenames(require.context('@/assets/inline-svgs/flags/4x3', true, /\.svg$/))
		}
	},
	template: `
		<div>
			<div
				v-for="iconName in iconNames"
				:key="iconName"
				style="width: 32px;"
			>
				{{iconName}}
				<kv-flag2 :country="iconName" :from-sprite="true" />
			</div>
		</div>
	`,
});
