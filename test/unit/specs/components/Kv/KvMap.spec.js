import { render } from '@testing-library/vue';
import KvMap from '#src/components/Kv/KvMap';

// Mock global window properties
global.L = undefined;
global.maplibregl = undefined;

// Mock leaflet
const mockLeaflet = {
	map: vi.fn(() => ({
		setView: vi.fn(),
		fitBounds: vi.fn(),
		remove: vi.fn(),
		invalidateSize: vi.fn(),
		on: vi.fn(),
		off: vi.fn(),
	})),
	tileLayer: vi.fn(() => ({
		addTo: vi.fn(),
	})),
	marker: vi.fn(() => ({
		addTo: vi.fn(),
		bindPopup: vi.fn(),
	})),
	icon: vi.fn(() => ({})),
	latLngBounds: vi.fn(() => ({
		extend: vi.fn(),
	})),
};

vi.mock('leaflet', () => ({
	default: mockLeaflet,
}));

// Mock maplibre-gl
const mockMapLibre = {
	supported: vi.fn(() => true),
	Map: vi.fn(function MockMap() {
		this.setCenter = vi.fn();
		this.setZoom = vi.fn();
		this.fitBounds = vi.fn();
		this.remove = vi.fn();
		this.resize = vi.fn();
		this.on = vi.fn();
		this.off = vi.fn();
	}),
};

vi.mock('maplibre-gl', () => ({
	default: mockMapLibre,
}));

// Mock Intersection Observer
global.IntersectionObserver = vi.fn(function MockIntersectionObserver() {
	this.observe = vi.fn();
	this.unobserve = vi.fn();
	this.disconnect = vi.fn();
});

describe('KvMap.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset global objects
		global.L = undefined;
		global.maplibregl = undefined;
	});

	it('exports a valid Vue component', () => {
		expect(KvMap).toBeDefined();
		expect(KvMap.name).toBe('KvMap');
	});

	it('has lat prop', () => {
		expect(KvMap.props.lat).toBeDefined();
		expect(KvMap.props.lat.type).toBe(Number);
	});

	it('has long prop', () => {
		expect(KvMap.props.long).toBeDefined();
		expect(KvMap.props.long.type).toBe(Number);
	});

	it('has zoomLevel prop with default 4', () => {
		expect(KvMap.props.zoomLevel.default).toBe(4);
	});

	it('has mapId prop with default 0', () => {
		expect(KvMap.props.mapId).toBeDefined();
		expect(KvMap.props.mapId.type).toBe(Number);
		expect(KvMap.props.mapId.default).toBe(0);
	});

	it('has aspectRatio prop with default 1', () => {
		expect(KvMap.props.aspectRatio.default).toBe(1);
	});

	it('has initialZoom prop', () => {
		expect(KvMap.props.initialZoom).toBeDefined();
		expect(KvMap.props.initialZoom.type).toBe(Number);
	});

	it('has useLeaflet prop with default false', () => {
		expect(KvMap.props.useLeaflet.default).toBe(false);
	});

	it('has autoZoomDelay prop with default 1500', () => {
		expect(KvMap.props.autoZoomDelay.default).toBe(1500);
	});

	it('has width prop', () => {
		expect(KvMap.props.width).toBeDefined();
		expect(KvMap.props.width.type).toBe(Number);
	});

	it('has height prop', () => {
		expect(KvMap.props.height).toBeDefined();
		expect(KvMap.props.height.type).toBe(Number);
	});

	it('renders map container', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const mapContainer = container.querySelector('.tw-relative');
		expect(mapContainer).toBeTruthy();
	});

	it('renders map div with id', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const mapDiv = container.querySelector('#kv-map-holder-1');
		expect(mapDiv).toBeTruthy();
	});

	it('applies tw-w-full class', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const fullWidth = container.querySelector('.tw-w-full');
		expect(fullWidth).toBeTruthy();
	});

	it('applies tw-h-full class', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const fullHeight = container.querySelector('.tw-h-full');
		expect(fullHeight).toBeTruthy();
	});

	it('applies tw-bg-black class', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const bgBlack = container.querySelector('.tw-bg-black');
		expect(bgBlack).toBeTruthy();
	});

	it('applies tw-relative class', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const relative = container.querySelector('.tw-relative');
		expect(relative).toBeTruthy();
	});

	it('applies tw-block class', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const block = container.querySelector('.tw-block');
		expect(block).toBeTruthy();
	});

	it('has mapDimensions computed property', () => {
		expect(KvMap.computed.mapDimensions).toBeDefined();
	});

	it('has refString computed property', () => {
		expect(KvMap.computed.refString).toBeDefined();
	});

	it('has mapInstance data property', () => {
		expect(KvMap.data).toBeDefined();
	});

	it('has initializeMap method', () => {
		expect(KvMap.methods.initializeMap).toBeDefined();
	});

	it('has activateZoom method', () => {
		expect(KvMap.methods.activateZoom).toBeDefined();
	});

	it('has checkWebGL method', () => {
		expect(KvMap.methods.checkWebGL).toBeDefined();
	});

	it('has createWrapperObserver method', () => {
		expect(KvMap.methods.createWrapperObserver).toBeDefined();
	});

	it('watches lat', () => {
		expect(KvMap.watch.lat).toBeDefined();
	});

	it('watches long', () => {
		expect(KvMap.watch.long).toBeDefined();
	});

	it('sets position to absolute style', () => {
		const { container } = render(KvMap, {
			props: {
				lat: 37.7749,
				long: -122.4194,
				mapId: 1,
			},
		});

		const mapDiv = container.querySelector('[style*="position"]');
		expect(mapDiv).toBeTruthy();
	});
});
