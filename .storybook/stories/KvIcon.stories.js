import KvIcon from '#src/components/Kv/KvIcon';

function getFilenames(r) {
	return Object.keys(r).map((filename) => {
		let str = filename;
		str = str.substring(str.lastIndexOf('/') + 1); // remove leading path
		str = str.substring(0, str.length - 4); // remove .svg
		return str;
	});
}

export default {
	title: 'Kv/KvIcon',
	component: KvIcon,
};

export const Default = () => ({
	components: {
		KvIcon
	},
	template: `
	<div>
		<kv-icon name="print" style="width: 10rem; fill: orange;" />
	</div>
	`,
});

const iconGlob = import.meta.glob('/src/assets/icons/inline/*.*', { eager: true });

export const inlined = () => ({
	components: {
		KvIcon
	},
	data() {
		return {
			iconNames: getFilenames(iconGlob)
		}
	},
	template: `
		<ul style="
			list-style: none;
			display: grid;
			grid-gap: 3rem;
			grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
		">
			<li
				v-for="iconName in iconNames"
				:key="iconName"
				style="
					display: grid;
					grid-template-rows: 7rem auto;
					align-items: center;
					text-align: center;
					font-size: 0.75rem;
				"
			 >
			 	<kv-icon :name="iconName" />
			 	<div>{{ iconName }}</div>
			</li>
		</ul>
	`,
});

const spriteGlob = import.meta.glob('/src/assets/icons/sprite/*.*', { eager: true });

export const fromSprite = () => ({
	components: {
		KvIcon
	},
	data() {
		return {
			iconNames: getFilenames(spriteGlob)
		}
	},
	template: `
		<ul style="
			list-style: none;
			display: grid;
			grid-gap: 3rem;
			grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
		">
			<li
				v-for="iconName in iconNames"
				:key="iconName"
				style="
					display: grid;
					grid-template-rows: 7rem auto;
					align-items: center;
					text-align: center;
					font-size: 0.75rem;
				"
			>
			 	<kv-icon :name="iconName" :from-sprite="true" />
			 	<div>{{ iconName }}</div>
			</li>
		</ul>
	`,
});
