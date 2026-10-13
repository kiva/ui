import { nextTick } from 'vue';
import { render } from '@testing-library/vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import useExperimentCopy, { createExperimentCopyOperation } from '#src/composables/useExperimentCopy';

const CONTENT_KEY = 'tip-copy';
const EXPERIMENT_KEY = 'tip_copy_exp';

const block = (key, headline, subHeadline) => ({
	sys: { contentType: { sys: { id: 'genericContentBlock' } } },
	fields: { key, headline, subHeadline },
});

const contentfulData = (entries = [{
	sys: { contentType: { sys: { id: 'uiSetting' } } },
	fields: {
		key: CONTENT_KEY,
		active: true,
		content: [
			block('tip-copy-a', 'A headline', 'A tagline for your {loans}'),
			block('tip-copy-b', 'B headline'),
		],
	},
}]) => ({
	contentful: {
		searchEntries: { items: entries.map(entry => ({ entryId: 'id', entry })) },
	},
});

// A fake Apollo client. Its cache holds the copy and the version, and emit() sends a
// later result the way the browser query would
function makeApollo({ cacheData = contentfulData(), version = 'b' } = {}) {
	let observer = null;
	const client = {
		readQuery: vi.fn(() => cacheData),
		readFragment: vi.fn(() => (version ? { id: EXPERIMENT_KEY, version } : null)),
		watchQuery: vi.fn(() => ({
			subscribe: o => {
				observer = o;
				return { unsubscribe: () => {} };
			},
		})),
	};
	return { client, emit: data => observer.next({ data }) };
}

// Mounts a small component that uses the copy set. The build adds preFetchOperations to real
// components, so here it is set by hand
function renderHost(client, trackEvent = vi.fn()) {
	const operation = createExperimentCopyOperation(CONTENT_KEY);
	let out;
	const Host = {
		name: 'Host',
		preFetchOperations: [operation],
		setup() {
			out = useExperimentCopy(operation, EXPERIMENT_KEY);
			return () => null;
		},
	};
	render(Host, {
		global: {
			...globalOptions,
			provide: { ...globalOptions.provide, apollo: client, $kvTrackEvent: trackEvent },
		},
	});
	return { out, trackEvent };
}

describe('useExperimentCopy', () => {
	it('builds a Contentful operation for the uiSetting', () => {
		const operation = createExperimentCopyOperation(CONTENT_KEY);

		expect(operation.query.definitions[0].name.value).toBe('contentfulEntries');
		expect(operation.preFetchVariables()).toEqual({
			contentType: 'uiSetting',
			contentKey: CONTENT_KEY,
		});
	});

	describe('reading the copy set', () => {
		it('reads the prefetched copy and the assigned version', () => {
			const { client } = makeApollo();
			const { out } = renderHost(client);

			expect(Object.keys(out.variants.value)).toEqual(['a', 'b']);
			expect(out.variants.value.b.headline).toBe('B headline');
			expect(out.version.value).toBe('b');
			expect(out.loading.value).toBe(false);
			expect(client.readFragment).toHaveBeenCalledWith(
				expect.objectContaining({ id: `Experiment:${EXPERIMENT_KEY}` })
			);
		});

		it('reports no version when the visitor is not assigned', () => {
			expect(renderHost(makeApollo({ version: null }).client).out.version.value).toBeNull();
			expect(renderHost(makeApollo({ version: 'unassigned' }).client).out.version.value).toBeNull();
		});

		it('reports no copy when the entry is missing', () => {
			const { out } = renderHost(makeApollo({ cacheData: contentfulData([]) }).client);

			expect(out.variants.value).toBeNull();
			expect(out.loading.value).toBe(false);
		});

		it('loads the copy on the client when it was not prefetched', async () => {
			const { client, emit } = makeApollo({ cacheData: null });
			const { out } = renderHost(client);

			expect(out.variants.value).toBeNull();
			expect(out.loading.value).toBe(true);
			expect(client.watchQuery).toHaveBeenCalledWith(expect.objectContaining({
				variables: expect.objectContaining({ contentType: 'uiSetting', contentKey: CONTENT_KEY }),
			}));

			emit(contentfulData());
			await nextTick();

			expect(out.variants.value.a.headline).toBe('A headline');
			expect(out.loading.value).toBe(false);
		});
	});

	describe('copy', () => {
		it('returns the text for the visitor\'s version', () => {
			const { out } = renderHost(makeApollo().client);

			expect(out.copy('headline')).toBe('B headline');
		});

		it('fills placeholders in the text', () => {
			const { out } = renderHost(makeApollo({ version: 'a' }).client);

			expect(out.copy('subHeadline', { loans: 'loans' })).toBe('A tagline for your loans');
		});

		it('returns null when the version\'s block leaves the field empty', () => {
			const { out } = renderHost(makeApollo().client);

			expect(out.copy('subHeadline')).toBeNull();
		});

		it('uses the a text when the visitor is not assigned', () => {
			const { out } = renderHost(makeApollo({ version: null }).client);

			expect(out.copy('headline')).toBe('A headline');
		});

		it('returns null when there is no copy set', () => {
			const { out } = renderHost(makeApollo({ cacheData: contentfulData([]) }).client);

			expect(out.copy('headline')).toBeNull();
		});

		it('returns the copy once it loads on the client', async () => {
			const { client, emit } = makeApollo({ cacheData: null });
			const { out } = renderHost(client);

			expect(out.copy('headline')).toBeNull();

			emit(contentfulData());
			await nextTick();

			expect(out.copy('headline')).toBe('B headline');
		});
	});

	describe('trackExposure', () => {
		it('sends the event with the version as the label when the version has copy', () => {
			const { out, trackEvent } = renderHost(makeApollo().client);

			expect(out.trackExposure('basket', 'EXP-TEST')).toBe(true);
			expect(trackEvent).toHaveBeenCalledTimes(1);
			expect(trackEvent).toHaveBeenCalledWith('basket', 'EXP-TEST', 'b', undefined);
		});

		it('sends nothing when the visitor is not assigned', () => {
			const { out, trackEvent } = renderHost(makeApollo({ version: null }).client);

			expect(out.trackExposure('basket', 'EXP-TEST')).toBe(false);
			expect(trackEvent).not.toHaveBeenCalled();
		});

		it('sends nothing when the assigned version has no copy', () => {
			const { out, trackEvent } = renderHost(makeApollo({ version: 'c' }).client);

			expect(out.trackExposure('basket', 'EXP-TEST')).toBe(false);
			expect(trackEvent).not.toHaveBeenCalled();
		});

		it('sends nothing when there is no copy set', () => {
			const { out, trackEvent } = renderHost(makeApollo({ cacheData: contentfulData([]) }).client);

			expect(out.trackExposure('basket', 'EXP-TEST')).toBe(false);
			expect(trackEvent).not.toHaveBeenCalled();
		});
	});
});
