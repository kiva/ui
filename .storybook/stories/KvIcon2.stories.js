import KvIcon2 from '@/components/Kv/KvIcon2';

export default {
	title: 'Kv/KvIcon2',
	component: KvIcon2,
 };

export const Default = () => ({
	components: {
		KvIcon2
	},
	template: `
	<div>
		<kv-icon2 name="star" style="width: 10rem; fill: blue;" />
		<kv-icon2 name="print" style="width: 10rem; fill: orange;" />
	</div>
	`,
});


function getAllIconNames(r) {
	return r.keys().map((filename) => {
		let str = filename;
		str = str.substring(2); // remove ./
		str = str.substring(0, str.length - 4); // remove .svg
		return str;
	});
}

export const allIcons = () => ({
	components: {
		KvIcon2
	},
	data() {
		return {
			iconNames: getAllIconNames(require.context('@/assets/inline-svgs/icons/', true, /\.svg$/))
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
					grid-template-rows: 1fr auto;
					align-items: center;
					text-align: center;
					font-size: 0.75rem;
				"
			 >
			 	<kv-icon2 :name="iconName" />
			 	<div>{{ iconName }}</div>
			</li>
		</ul>
	`,
});
