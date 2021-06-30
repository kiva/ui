import KvMap from '@/components/Kv/KvMap';

export default {
	title: 'Kv/KvMap',
	component: KvMap,
	args: {
		autoZoomDelay: 1000,
		initialZoom: null,
		lat: 37.700091,
		long: -123.013243,
		mapId: 0,
		useLeaflet: false,
		zoomLevel: 4,
	},
};

const Template = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { KvMap },
	template: '<kv-map class="tw-rounded tw-overflow-hidden tw-m-4" :auto-zoom-delay="autoZoomDelay" :lat="lat" :long="long" :initial-zoom="initialZoom" :map-id="mapId" :use-leaflet="useLeaflet" :zoom-level="zoomLevel"  />',
});

export const Default = Template.bind({});
Default.args = {
	initialZoom: null,
	mapId: 1,
	zoomLevel: 14,
};

export const AutoZoom = Template.bind({});
AutoZoom.args = {
	initialZoom: 1,
	lat: -0.023559,
	long: 37.906193,
	mapId: 2,
	zoomLevel: 4,
}

export const Leaflet = Template.bind({});
Leaflet.args = {
	initialZoom: null,
	lat: -0.023559,
	long: 37.906193,
	mapId: 3,
	useLeaflet: true,
	zoomLevel: 6,
};

